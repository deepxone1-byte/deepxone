import { Router, Response } from 'express';
import { validationResult } from 'express-validator';
import artworkService from '../services/artworkService';
import { authenticate, authorize, optionalAuth, AuthRequest } from '../middleware/auth';
import { uploadSingle } from '../middleware/upload';
import { artworkValidator, idValidator, paginationValidator } from '../middleware/validator';
import { UserRole } from '../types';
import logger from '../config/logger';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.ARTIST, UserRole.STUDENT),
  uploadSingle,
  artworkValidator,
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'Image file is required' });
      }

      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const artworkData = {
        ...req.body,
        user_id: req.user.id
      };

      if (req.body.tags && typeof req.body.tags === 'string') {
        artworkData.tags = JSON.parse(req.body.tags);
      }

      const artwork = await artworkService.createArtwork(artworkData, req.file);
      logger.info(`Artwork created: ${artwork.id} by user ${req.user.id}`);

      res.status(201).json(artwork);
    } catch (error) {
      logger.error('Artwork creation error:', error);
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Artwork creation failed'
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

    if (req.query.category) {
      filters.category = req.query.category as string;
    }

    if (req.query.is_featured) {
      filters.is_featured = req.query.is_featured === 'true';
    }

    if (!req.user || req.user.role === UserRole.USER) {
      filters.is_published = true;
    } else if (req.query.is_published !== undefined) {
      filters.is_published = req.query.is_published === 'true';
    }

    const result = await artworkService.getArtworks(filters);
    res.json(result);
  } catch (error) {
    logger.error('Artwork fetch error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch artworks'
    });
  }
});

router.get('/:id', idValidator, optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const artwork = await artworkService.getArtworkById(parseInt(req.params.id));

    if (!artwork.is_published && (!req.user || (req.user.id !== artwork.user_id && req.user.role !== UserRole.ADMIN))) {
      return res.status(404).json({ error: 'Artwork not found' });
    }

    await artworkService.incrementViews(parseInt(req.params.id));

    res.json(artwork);
  } catch (error) {
    logger.error('Artwork fetch error:', error);
    res.status(404).json({
      error: error instanceof Error ? error.message : 'Artwork not found'
    });
  }
});

router.put('/:id', authenticate, idValidator, artworkValidator, async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const artwork = await artworkService.updateArtwork(
      parseInt(req.params.id),
      req.user.id,
      req.body
    );

    logger.info(`Artwork updated: ${req.params.id} by user ${req.user.id}`);
    res.json(artwork);
  } catch (error) {
    logger.error('Artwork update error:', error);
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Artwork update failed'
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

    const result = await artworkService.deleteArtwork(
      parseInt(req.params.id),
      req.user.id
    );

    logger.info(`Artwork deleted: ${req.params.id} by user ${req.user.id}`);
    res.json(result);
  } catch (error) {
    logger.error('Artwork deletion error:', error);
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Artwork deletion failed'
    });
  }
});

export default router;
