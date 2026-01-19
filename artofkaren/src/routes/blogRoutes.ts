import { Router, Response } from 'express';
import { validationResult } from 'express-validator';
import blogService from '../services/blogService';
import { authenticate, authorize, optionalAuth, AuthRequest } from '../middleware/auth';
import { blogPostValidator, idValidator, paginationValidator } from '../middleware/validator';
import { UserRole } from '../types';
import logger from '../config/logger';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.ARTIST),
  blogPostValidator,
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const postData = {
        ...req.body,
        user_id: req.user.id
      };

      const post = await blogService.createPost(postData);
      logger.info(`Blog post created: ${post.id} by user ${req.user.id}`);

      res.status(201).json(post);
    } catch (error) {
      logger.error('Blog post creation error:', error);
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Blog post creation failed'
      });
    }
  }
);

router.get('/', paginationValidator, optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const filters: any = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10
    };

    if (req.query.user_id) {
      filters.user_id = parseInt(req.query.user_id as string);
    }

    if (!req.user || (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.ARTIST)) {
      filters.is_published = true;
    } else if (req.query.is_published !== undefined) {
      filters.is_published = req.query.is_published === 'true';
    }

    const result = await blogService.getPosts(filters);
    res.json(result);
  } catch (error) {
    logger.error('Blog posts fetch error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch blog posts'
    });
  }
});

router.get('/slug/:slug', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const post = await blogService.getPostBySlug(req.params.slug);

    if (!post.is_published && (!req.user || (req.user.id !== post.user_id && req.user.role !== UserRole.ADMIN))) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json(post);
  } catch (error) {
    logger.error('Blog post fetch error:', error);
    res.status(404).json({
      error: error instanceof Error ? error.message : 'Blog post not found'
    });
  }
});

router.get('/:id', idValidator, optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await blogService.getPostById(parseInt(req.params.id));

    if (!post.is_published && (!req.user || (req.user.id !== post.user_id && req.user.role !== UserRole.ADMIN))) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json(post);
  } catch (error) {
    logger.error('Blog post fetch error:', error);
    res.status(404).json({
      error: error instanceof Error ? error.message : 'Blog post not found'
    });
  }
});

router.put('/:id', authenticate, idValidator, blogPostValidator, async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const post = await blogService.updatePost(
      parseInt(req.params.id),
      req.user.id,
      req.body
    );

    logger.info(`Blog post updated: ${req.params.id} by user ${req.user.id}`);
    res.json(post);
  } catch (error) {
    logger.error('Blog post update error:', error);
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Blog post update failed'
    });
  }
});

router.delete('/:id', authenticate, idValidator, async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await blogService.deletePost(
      parseInt(req.params.id),
      req.user.id
    );

    logger.info(`Blog post deleted: ${req.params.id} by user ${req.user.id}`);
    res.json(result);
  } catch (error) {
    logger.error('Blog post deletion error:', error);
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Blog post deletion failed'
    });
  }
});

export default router;
