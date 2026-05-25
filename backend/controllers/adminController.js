const Vendor = require('../models/Vendor');
const Website = require('../models/Website');
const User = require('../models/User');
const Payment = require('../models/Payment');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Fetch all registered merchants listing
 */
const getVendors = asyncHandler(async (req, res) => {
  const vendors = await Vendor.find().populate('ownerId', 'name email');
  ApiResponse.success(res, 'Vendors list successfully fetched', vendors);
});

/**
 * Fetch all visual website profiles
 */
const getWebsites = asyncHandler(async (req, res) => {
  const websites = await Website.find().populate('vendorId', 'businessName subdomain');
  ApiResponse.success(res, 'Websites list successfully fetched', websites);
});

/**
 * Load administrative dashboard metrics (SaaS aggregates)
 */
const getAdminAnalytics = asyncHandler(async (req, res) => {
  const usersCount = await User.countDocuments();
  const vendorsCount = await Vendor.countDocuments();
  const sitesCount = await Website.countDocuments({ published: true });
  
  const payments = await Payment.find({ status: 'captured' });
  const totalSaaSSales = payments.reduce((acc, curr) => acc + curr.amount, 0);

  ApiResponse.success(res, 'Admin overview metrics generated', {
    totalUsers: usersCount,
    totalMerchants: vendorsCount,
    activeSites: sitesCount,
    totalPlatformBillingSales: totalSaaSSales
  });
});

const updateVendorStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!['Active', 'Suspended', 'Pending'].includes(status)) {
    return ApiResponse.badRequest(res, 'Invalid status provided');
  }

  const vendor = await Vendor.findByIdAndUpdate(
    id, 
    { status },
    { new: true }
  ).populate('ownerId', 'name email');

  if (!vendor) {
    return ApiResponse.notFound(res, 'Vendor not found');
  }

  ApiResponse.success(res, 'Vendor status updated successfully', vendor);
});

/**
 * Delete a vendor completely
 */
const deleteVendor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const vendor = await Vendor.findByIdAndDelete(id);
  
  if (!vendor) {
    return ApiResponse.notFound(res, 'Vendor not found');
  }

  // Also delete associated website if exists
  await Website.findOneAndDelete({ vendorId: id });

  ApiResponse.success(res, 'Vendor deleted successfully', { id });
});

module.exports = {
  getVendors,
  getWebsites,
  getAdminAnalytics,
  updateVendorStatus,
  deleteVendor
};
