import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';
import { logger } from '../config/logger.js';

// Re-export body for use in other files
export { body };

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation errors:', errors.array());
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: errors.array()
      }
    });
  }
  next();
};

export const validateRegistration: ValidationChain[] = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('profile.firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('profile.lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('profile.phone')
    .isMobilePhone('en-IN')
    .withMessage('Please provide a valid Indian phone number'),
  
  body('profile.location.address')
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Address must be between 10 and 200 characters'),
  
  body('profile.location.city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  
  body('profile.location.state')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters'),
  
  body('profile.location.pincode')
    .isPostalCode('IN')
    .withMessage('Please provide a valid Indian pincode'),
  
  body('profile.location.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Coordinates must be an array of exactly 2 numbers')
    .custom((coords) => {
      if (!Array.isArray(coords) || coords.length !== 2) {
        throw new Error('Coordinates must be an array of exactly 2 numbers');
      }
      const [lng, lat] = coords;
      if (typeof lng !== 'number' || typeof lat !== 'number') {
        throw new Error('Coordinates must be numbers');
      }
      if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
        throw new Error('Invalid coordinate values');
      }
      return true;
    })
];

export const validateLogin: ValidationChain[] = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

export const validateProviderRegistration: ValidationChain[] = [
  body('businessName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Business name must be between 2 and 100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 50, max: 1000 })
    .withMessage('Description must be between 50 and 1000 characters'),
  
  body('services')
    .isArray({ min: 1 })
    .withMessage('At least one service must be provided'),
  
  body('services.*.category')
    .notEmpty()
    .withMessage('Service category is required'),
  
  body('services.*.subcategory')
    .notEmpty()
    .withMessage('Service subcategory is required'),
  
  body('services.*.basePrice')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Base price must be a positive number'),
  
  body('services.*.unit')
    .isIn(['hour', 'service', 'square_feet'])
    .withMessage('Service unit must be hour, service, or square_feet'),
  
  body('serviceAreas')
    .isArray({ min: 1 })
    .withMessage('At least one service area must be provided'),
  
  body('serviceAreas.*.city')
    .notEmpty()
    .withMessage('Service area city is required'),
  
  body('serviceAreas.*.pincodes')
    .isArray({ min: 1 })
    .withMessage('At least one pincode must be provided for service area'),
  
  body('serviceAreas.*.radius')
    .isNumeric()
    .isFloat({ min: 1, max: 50 })
    .withMessage('Service area radius must be between 1 and 50 km')
];