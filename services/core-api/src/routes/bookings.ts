import { Router } from 'express';
import { Booking } from '../models/Booking.js';
import { Provider } from '../models/Provider.js';
import { User } from '../models/User.js';
import { logger } from '../config/logger.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { body, handleValidationErrors } from '../middleware/validation.js';

const router = Router();

// Create booking
router.post('/', authenticateToken, [
  body('providerId').isMongoId().withMessage('Valid provider ID is required'),
  body('service.category').notEmpty().withMessage('Service category is required'),
  body('service.subcategory').notEmpty().withMessage('Service subcategory is required'),
  body('service.description').isLength({ min: 10, max: 500 }).withMessage('Service description must be between 10 and 500 characters'),
  body('service.estimatedDuration').isNumeric().isFloat({ min: 0.5, max: 24 }).withMessage('Estimated duration must be between 0.5 and 24 hours'),
  body('location.address').isLength({ min: 10, max: 200 }).withMessage('Address must be between 10 and 200 characters'),
  body('location.coordinates').isArray({ min: 2, max: 2 }).withMessage('Coordinates must be an array of exactly 2 numbers'),
  body('schedule.preferredDate').isISO8601().withMessage('Preferred date must be a valid date'),
  body('schedule.preferredTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Preferred time must be in HH:MM format'),
  body('pricing.basePrice').isNumeric().isFloat({ min: 0 }).withMessage('Base price must be a positive number'),
  body('payment.method').isIn(['online', 'cash', 'wallet']).withMessage('Payment method must be online, cash, or wallet'),
  handleValidationErrors
], async (req: AuthRequest, res) => {
  try {
    const customerId = req.user!.userId;
    const { providerId, service, location, schedule, pricing, payment } = req.body;

    // Verify provider exists and is active
    const provider = await Provider.findById(providerId);
    if (!provider || !provider.isActive) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Provider not found or inactive'
        }
      });
    }

    // Calculate total amount
    const totalAmount = pricing.basePrice + (pricing.additionalCharges || 0);

    // Create booking
    const booking = new Booking({
      customerId,
      providerId,
      service,
      location,
      schedule,
      pricing: {
        ...pricing,
        totalAmount
      },
      payment: {
        method: payment.method,
        status: 'pending'
      },
      status: 'pending'
    });

    await booking.save();

    // Populate the booking with user details
    await booking.populate([
      { path: 'customerId', select: 'profile.firstName profile.lastName profile.phone' },
      { path: 'providerId', select: 'businessName services' }
    ]);

    logger.info('Booking created successfully', { bookingId: booking._id, customerId, providerId });

    res.status(201).json({
      success: true,
      data: { booking }
    });
  } catch (error) {
    logger.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create booking'
      }
    });
  }
});

// Get user's bookings
router.get('/my-bookings', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const { status, page = 1, limit = 20 } = req.query;

    const query: any = { customerId: userId };
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('providerId', 'businessName services rating')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string) * 1)
      .skip((parseInt(page as string) - 1) * parseInt(limit as string));

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: {
        bookings,
        meta: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          hasNext: parseInt(page as string) * parseInt(limit as string) < total
        }
      }
    });
  } catch (error) {
    logger.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get bookings'
      }
    });
  }
});

// Get provider's bookings
router.get('/provider-bookings', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const { status, page = 1, limit = 20 } = req.query;

    // Find provider by userId
    const provider = await Provider.findOne({ userId });
    if (!provider) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Provider profile not found'
        }
      });
    }

    const query: any = { providerId: provider._id };
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('customerId', 'profile.firstName profile.lastName profile.phone')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string) * 1)
      .skip((parseInt(page as string) - 1) * parseInt(limit as string));

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: {
        bookings,
        meta: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          hasNext: parseInt(page as string) * parseInt(limit as string) < total
        }
      }
    });
  } catch (error) {
    logger.error('Get provider bookings error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get provider bookings'
      }
    });
  }
});

// Get booking by ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const booking = await Booking.findById(id)
      .populate('customerId', 'profile.firstName profile.lastName profile.phone')
      .populate('providerId', 'businessName services rating');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Booking not found'
        }
      });
    }

    // Check if user has access to this booking
    if (booking.customerId.toString() !== userId && booking.providerId.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'AUTHORIZATION_ERROR',
          message: 'Access denied to this booking'
        }
      });
    }

    res.json({
      success: true,
      data: { booking }
    });
  } catch (error) {
    logger.error('Get booking by ID error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get booking'
      }
    });
  }
});

// Update booking status (provider only)
router.put('/:id/status', authenticateToken, [
  body('status').isIn(['confirmed', 'in_progress', 'completed', 'cancelled']).withMessage('Invalid status'),
  body('confirmedDate').optional().isISO8601().withMessage('Confirmed date must be a valid date'),
  body('confirmedTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Confirmed time must be in HH:MM format'),
  handleValidationErrors
], async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status, confirmedDate, confirmedTime } = req.body;
    const userId = req.user!.userId;

    // Find provider by userId
    const provider = await Provider.findOne({ userId });
    if (!provider) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Provider profile not found'
        }
      });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Booking not found'
        }
      });
    }

    // Check if provider owns this booking
    if (booking.providerId.toString() !== provider._id.toString()) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'AUTHORIZATION_ERROR',
          message: 'Access denied to this booking'
        }
      });
    }

    // Update booking
    const updateData: any = { status };
    if (confirmedDate) updateData['schedule.confirmedDate'] = confirmedDate;
    if (confirmedTime) updateData['schedule.confirmedTime'] = confirmedTime;

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate([
      { path: 'customerId', select: 'profile.firstName profile.lastName profile.phone' },
      { path: 'providerId', select: 'businessName services rating' }
    ]);

    logger.info('Booking status updated', { bookingId: id, status, providerId: provider._id });

    res.json({
      success: true,
      data: { booking: updatedBooking }
    });
  } catch (error) {
    logger.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update booking status'
      }
    });
  }
});

export { router as bookingsRouter };