import { Router, Response } from 'express';
import { validationResult } from 'express-validator';
import videoService from '../services/videoService';
import { authenticate, authorize, optionalAuth, AuthRequest } from '../middleware/auth';
import { videoValidator, idValidator, paginationValidator } from '../middleware/validator';
import { UserRole } from '../types';
import logger from '../config/logger';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.ARTIST),
  videoValidator,
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const videoData = {
        ...req.body,
        user_id: req.user.id
      };

      const video = await videoService.createVideo(videoData);
      logger.info(`Video created: ${video.id} by user ${req.user.id}`);

      res.status(201).json(video);
    } catch (error) {
      logger.error('Video creation error:', error);
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Video creation failed'
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
      limit: parseInt(req.query.limit as string) || 20
    };

    if (req.query.user_id) {
      filters.user_id = parseInt(req.query.user_id as string);
    }

    if (req.query.artwork_id) {
      filters.artwork_id = parseInt(req.query.artwork_id as string);
    }

    if (req.query.blog_post_id) {
      filters.blog_post_id = parseInt(req.query.blog_post_id as string);
    }

    if (!req.user || (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.ARTIST)) {
      filters.is_published = true;
    } else if (req.query.is_published !== undefined) {
      filters.is_published = req.query.is_published === 'true';
    }

    const result = await videoService.getVideos(filters);
    res.json(result);
  } catch (error) {
    logger.error('Videos fetch error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch videos'
    });
  }
});

router.get('/:id', idValidator, optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const video = await videoService.getVideoById(parseInt(req.params.id));

    if (!video.is_published && (!req.user || (req.user.id !== video.user_id && req.user.role !== UserRole.ADMIN))) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json(video);
  } catch (error) {
    logger.error('Video fetch error:', error);
    res.status(404).json({
      error: error instanceof Error ? error.message : 'Video not found'
    });
  }
});

router.put('/:id', authenticate, idValidator, videoValidator, async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const video = await videoService.updateVideo(
      parseInt(req.params.id),
      req.user.id,
      req.body
    );

    logger.info(`Video updated: ${req.params.id} by user ${req.user.id}`);
    res.json(video);
  } catch (error) {
    logger.error('Video update error:', error);
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Video update failed'
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

    const result = await videoService.deleteVideo(
      parseInt(req.params.id),
      req.user.id
    );

    logger.info(`Video deleted: ${req.params.id} by user ${req.user.id}`);
    res.json(result);
  } catch (error) {
    logger.error('Video deletion error:', error);
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Video deletion failed'
    });
  }
});

export default router;
