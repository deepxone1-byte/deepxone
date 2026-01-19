import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import pool from '../config/database';
import { Artwork } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface CreateArtworkData {
  user_id: number;
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  created_year?: number;
  is_published?: boolean;
}

interface UpdateArtworkData {
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  created_year?: number;
  is_published?: boolean;
  is_featured?: boolean;
}

export class ArtworkService {
  private uploadDir = process.env.UPLOAD_DIR || './uploads';

  async createArtwork(data: CreateArtworkData, file: Express.Multer.File) {
    const { user_id, title, description, category, tags, created_year, is_published } = data;

    const imagePath = file.path;
    const thumbnailPath = await this.createThumbnail(imagePath);

    const imageUrl = `/uploads/artworks/${path.basename(imagePath)}`;
    const thumbnailUrl = `/uploads/thumbnails/${path.basename(thumbnailPath)}`;

    const metadata = await sharp(imagePath).metadata();

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO artworks (user_id, title, description, image_url, thumbnail_url, category, tags, width, height, created_year, is_published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        title,
        description || null,
        imageUrl,
        thumbnailUrl,
        category || null,
        tags ? JSON.stringify(tags) : null,
        metadata.width || null,
        metadata.height || null,
        created_year || null,
        is_published || false
      ]
    );

    return this.getArtworkById(result.insertId);
  }

  async getArtworkById(id: number) {
    const [artworks] = await pool.query<RowDataPacket[]>(
      `SELECT a.*, u.username, u.full_name as artist_name, u.profile_image as artist_image
       FROM artworks a
       JOIN users u ON a.user_id = u.id
       WHERE a.id = ?`,
      [id]
    );

    if (artworks.length === 0) {
      throw new Error('Artwork not found');
    }

    const artwork = artworks[0];
    if (artwork.tags) {
      artwork.tags = JSON.parse(artwork.tags);
    }

    return artwork;
  }

  async getArtworks(filters: {
    user_id?: number;
    category?: string;
    is_published?: boolean;
    is_featured?: boolean;
    page?: number;
    limit?: number;
  }) {
    const { user_id, category, is_published, is_featured, page = 1, limit = 20 } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT a.*, u.username, u.full_name as artist_name, u.profile_image as artist_image
      FROM artworks a
      JOIN users u ON a.user_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (user_id !== undefined) {
      query += ' AND a.user_id = ?';
      params.push(user_id);
    }

    if (category) {
      query += ' AND a.category = ?';
      params.push(category);
    }

    if (is_published !== undefined) {
      query += ' AND a.is_published = ?';
      params.push(is_published);
    }

    if (is_featured !== undefined) {
      query += ' AND a.is_featured = ?';
      params.push(is_featured);
    }

    query += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [artworks] = await pool.query<RowDataPacket[]>(query, params);

    const countQuery = query.substring(0, query.indexOf('ORDER BY')).replace('a.*, u.username, u.full_name as artist_name, u.profile_image as artist_image', 'COUNT(*) as total');
    const [countResult] = await pool.query<RowDataPacket[]>(countQuery, params.slice(0, -2));
    const total = countResult[0].total;

    artworks.forEach(artwork => {
      if (artwork.tags) {
        artwork.tags = JSON.parse(artwork.tags);
      }
    });

    return {
      artworks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async updateArtwork(id: number, userId: number, data: UpdateArtworkData) {
    const [artworks] = await pool.query<RowDataPacket[]>(
      'SELECT user_id FROM artworks WHERE id = ?',
      [id]
    );

    if (artworks.length === 0) {
      throw new Error('Artwork not found');
    }

    if (artworks[0].user_id !== userId) {
      throw new Error('Unauthorized to update this artwork');
    }

    const updates: string[] = [];
    const values: any[] = [];

    Object.keys(data).forEach(key => {
      if (data[key as keyof UpdateArtworkData] !== undefined) {
        updates.push(`${key} = ?`);
        if (key === 'tags' && Array.isArray(data.tags)) {
          values.push(JSON.stringify(data.tags));
        } else {
          values.push(data[key as keyof UpdateArtworkData]);
        }
      }
    });

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(id);

    await pool.query(
      `UPDATE artworks SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );

    return this.getArtworkById(id);
  }

  async deleteArtwork(id: number, userId: number) {
    const [artworks] = await pool.query<RowDataPacket[]>(
      'SELECT user_id, image_url, thumbnail_url FROM artworks WHERE id = ?',
      [id]
    );

    if (artworks.length === 0) {
      throw new Error('Artwork not found');
    }

    if (artworks[0].user_id !== userId) {
      throw new Error('Unauthorized to delete this artwork');
    }

    await pool.query('DELETE FROM artworks WHERE id = ?', [id]);

    const imagePath = path.join(process.cwd(), artworks[0].image_url);
    const thumbnailPath = path.join(process.cwd(), artworks[0].thumbnail_url);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    if (fs.existsSync(thumbnailPath)) {
      fs.unlinkSync(thumbnailPath);
    }

    return { message: 'Artwork deleted successfully' };
  }

  async incrementViews(id: number) {
    await pool.query('UPDATE artworks SET views = views + 1 WHERE id = ?', [id]);
  }

  private async createThumbnail(imagePath: string): Promise<string> {
    const thumbnailDir = path.join(this.uploadDir, 'thumbnails');
    if (!fs.existsSync(thumbnailDir)) {
      fs.mkdirSync(thumbnailDir, { recursive: true });
    }

    const filename = path.basename(imagePath);
    const thumbnailPath = path.join(thumbnailDir, `thumb_${filename}`);

    await sharp(imagePath)
      .resize(400, 400, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 85 })
      .toFile(thumbnailPath);

    return thumbnailPath;
  }
}

export default new ArtworkService();
