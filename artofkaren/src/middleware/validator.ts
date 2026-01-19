import { body, param, query, ValidationChain } from 'express-validator';

export const registerValidator: ValidationChain[] = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('username').isLength({ min: 3, max: 100 }).trim().withMessage('Username must be 3-100 characters'),
  body('full_name').isLength({ min: 1, max: 255 }).trim().withMessage('Full name is required'),
  body('role').optional().isIn(['artist', 'student', 'user']).withMessage('Invalid role')
];

export const loginValidator: ValidationChain[] = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

export const artworkValidator: ValidationChain[] = [
  body('title').isLength({ min: 1, max: 500 }).trim().withMessage('Title is required'),
  body('description').optional().isString(),
  body('category').optional().isString().trim(),
  body('tags').optional().isArray(),
  body('created_year').optional().isInt({ min: 1000, max: 9999 }),
  body('is_published').optional().isBoolean()
];

export const blogPostValidator: ValidationChain[] = [
  body('title').isLength({ min: 1, max: 500 }).trim().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('excerpt').optional().isString(),
  body('is_published').optional().isBoolean()
];

export const videoValidator: ValidationChain[] = [
  body('title').isLength({ min: 1, max: 500 }).trim().withMessage('Title is required'),
  body('youtube_url').isURL().withMessage('Valid YouTube URL is required'),
  body('description').optional().isString(),
  body('artwork_id').optional().isInt(),
  body('blog_post_id').optional().isInt()
];

export const idValidator: ValidationChain[] = [
  param('id').isInt({ min: 1 }).withMessage('Valid ID is required')
];

export const paginationValidator: ValidationChain[] = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100')
];
