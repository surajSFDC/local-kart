import { Router } from 'express';
import { Provider } from '../models/Provider.js';
import { User } from '../models/User.js';
import { logger } from '../config/logger.js';
import { authenticateToken, authorizeRoles, AuthRequest } from '../middleware/auth.js';
import { validateProviderRegistration, handleValidationErrors } from '../middleware/validation.js';

const router = Router();

// Register as provider
router.post('/register', authenticateToken, authorizeRoles('customer'), validateProviderRegistration, handleValidationErrors, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const { businessName, description, services, serviceAreas, availability } = req.body;

    // Check if user already has a provider profile
    const existingProvider = await Provider.findOne({ userId });
    if (existingProvider) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'CONFLICT',
          message: 'Provider profile already exists for this user'
        }
      });
    }

    // Create AI-generated profile (simplified for MVP)
    const aiGeneratedProfile = {
      summary: `Professional ${services[0]?.category || 'service'} provider with expertise in ${services.map(s => s.subcategory).join(', ')}`,
      skills: services.map(s => s.subcategory),
      experience: 'Experienced professional',
      specialties: services.map(s => s.subcategory)
    };

    // Create provider profile
    const provider = new Provider({
      userId,
      businessName,
      description,
      aiGeneratedProfile,
      services,
      serviceAreas,
      availability,
      rating: { average: 0, count: 0 },
      portfolio: [],
      documents: []
    });

    await provider.save();

    // Update user role to provider
    await User.findByIdAndUpdate(userId, { role: 'provider' });

    logger.info('Provider registered successfully', { userId, providerId: provider._id });

    res.status(201).json({
      success: true,
      data: {
        provider: {
          _id: provider._id,
          userId: provider.userId,
          businessName: provider.businessName,
          description: provider.description,
          aiGeneratedProfile: provider.aiGeneratedProfile,
          services: provider.services,
          serviceAreas: provider.serviceAreas,
          availability: provider.availability,
          rating: provider.rating,
          portfolio: provider.portfolio,
          documents: provider.documents,
          isVerified: provider.isVerified,
          isActive: provider.isActive,
          createdAt: provider.createdAt,
          updatedAt: provider.updatedAt
        }
      }
    });
  } catch (error) {
    logger.error('Provider registration error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to register as provider'
      }
    });
  }
});

// Get provider profile
router.get('/profile', authenticateToken, authorizeRoles('provider'), async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
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

    res.json({
      success: true,
      data: { provider }
    });
  } catch (error) {
    logger.error('Get provider profile error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get provider profile'
      }
    });
  }
});

// Update provider profile
router.put('/profile', authenticateToken, authorizeRoles('provider'), async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const updateData = req.body;

    const provider = await Provider.findOneAndUpdate(
      { userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!provider) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Provider profile not found'
        }
      });
    }

    logger.info('Provider profile updated', { userId, providerId: provider._id });

    res.json({
      success: true,
      data: { provider }
    });
  } catch (error) {
    logger.error('Update provider profile error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update provider profile'
      }
    });
  }
});

// Search providers
router.get('/search', async (req, res) => {
  try {
    const { 
      city, 
      category, 
      lat, 
      lng, 
      radius = 10, 
      page = 1, 
      limit = 20 
    } = req.query;

    const query: any = {
      isActive: true,
      isVerified: true
    };

    // Filter by city
    if (city) {
      query['serviceAreas.city'] = new RegExp(city as string, 'i');
    }

    // Filter by service category
    if (category) {
      query['services.category'] = new RegExp(category as string, 'i');
    }

    // Location-based search
    let locationQuery = {};
    if (lat && lng) {
      locationQuery = {
        'serviceAreas': {
          $elemMatch: {
            city: city ? new RegExp(city as string, 'i') : { $exists: true },
            radius: { $gte: parseInt(radius as string) }
          }
        }
      };
    }

    const finalQuery = { ...query, ...locationQuery };

    const providers = await Provider.find(finalQuery)
      .populate('userId', 'profile.firstName profile.lastName profile.phone')
      .sort({ 'rating.average': -1, 'rating.count': -1 })
      .limit(parseInt(limit as string) * 1)
      .skip((parseInt(page as string) - 1) * parseInt(limit as string));

    const total = await Provider.countDocuments(finalQuery);

    res.json({
      success: true,
      data: {
        providers,
        meta: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          hasNext: parseInt(page as string) * parseInt(limit as string) < total
        }
      }
    });
  } catch (error) {
    logger.error('Search providers error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to search providers'
      }
    });
  }
});

// Get provider by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const provider = await Provider.findById(id)
      .populate('userId', 'profile.firstName profile.lastName profile.phone profile.avatar');

    if (!provider) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Provider not found'
        }
      });
    }

    res.json({
      success: true,
      data: { provider }
    });
  } catch (error) {
    logger.error('Get provider by ID error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get provider'
      }
    });
  }
});

export { router as providersRouter };