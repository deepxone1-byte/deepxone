import pool from '../config/database';
import { Video } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface CreateVideoData {
  user_id: number;
  title: string;
  description?: string;
  youtube_url: string;
  artwork_id?: number;
  blog_post_id?: number;
  is_published?: boolean;
}

interface UpdateVideoData {
  title?: string;
  description?: string;
  youtube_url?: string;
  artwork_id?: number;
  blog_post_id?: number;
  is_published?: boolean;
}

export class VideoService {
  async createVideo(data: CreateVideoData) {
    const { user_id, title, description, youtube_url, artwork_id, blog_post_id, is_published } = data;

    const youtube_id = this.extractYouTubeId(youtube_url);
    if (!youtube_id) {
      throw new Error('Invalid YouTube URL');
    }

    const thumbnail_url = `https://img.youtube.com/vi/${youtube_id}/maxresdefault.jpg`;

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO videos (user_id, title, description, youtube_url, youtube_id, thumbnail_url, artwork_id, blog_post_id, is_published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        title,
        description || null,
        youtube_url,
        youtube_id,
        thumbnail_url,
        artwork_id || null,
        blog_post_id || null,
        is_published || false
      ]
    );

    return this.getVideoById(result.insertId);
  }

  async getVideoById(id: number) {
    const [videos] = await pool.query<RowDataPacket[]>(
      `SELECT v.*, u.username, u.full_name as creator_name
       FROM videos v
       JOIN users u ON v.user_id = u.id
       WHERE v.id = ?`,
      [id]
    );

    if (videos.length === 0) {
      throw new Error('Video not found');
    }

    return videos[0];
  }

  async getVideos(filters: {
    user_id?: number;
    artwork_id?: number;
    blog_post_id?: number;
    is_published?: boolean;
    page?: number;
    limit?: number;
  }) {
    const { user_id, artwork_id, blog_post_id, is_published, page = 1, limit = 20 } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT v.*, u.username, u.full_name as creator_name
      FROM videos v
      JOIN users u ON v.user_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (user_id !== undefined) {
      query += ' AND v.user_id = ?';
      params.push(user_id);
    }

    if (artwork_id !== undefined) {
      query += ' AND v.artwork_id = ?';
      params.push(artwork_id);
    }

    if (blog_post_id !== undefined) {
      query += ' AND v.blog_post_id = ?';
      params.push(blog_post_id);
    }

    if (is_published !== undefined) {
      query += ' AND v.is_published = ?';
      params.push(is_published);
    }

    query += ' ORDER BY v.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [videos] = await pool.query<RowDataPacket[]>(query, params);

    const countQuery = query.substring(0, query.indexOf('ORDER BY')).replace('v.*, u.username, u.full_name as creator_name', 'COUNT(*) as total');
    const [countResult] = await pool.query<RowDataPacket[]>(countQuery, params.slice(0, -2));
    const total = countResult[0].total;

    return {
      videos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async updateVideo(id: number, userId: number, data: UpdateVideoData) {
    const [videos] = await pool.query<RowDataPacket[]>(
      'SELECT user_id FROM videos WHERE id = ?',
      [id]
    );

    if (videos.length === 0) {
      throw new Error('Video not found');
    }

    if (videos[0].user_id !== userId) {
      throw new Error('Unauthorized to update this video');
    }

    const updates: string[] = [];
    const values: any[] = [];

    Object.keys(data).forEach(key => {
      if (data[key as keyof UpdateVideoData] !== undefined) {
        if (key === 'youtube_url' && data.youtube_url) {
          const youtube_id = this.extractYouTubeId(data.youtube_url);
          if (!youtube_id) {
            throw new Error('Invalid YouTube URL');
          }
          updates.push('youtube_url = ?', 'youtube_id = ?', 'thumbnail_url = ?');
          values.push(
            data.youtube_url,
            youtube_id,
            `https://img.youtube.com/vi/${youtube_id}/maxresdefault.jpg`
          );
        } else {
          updates.push(`${key} = ?`);
          values.push(data[key as keyof UpdateVideoData]);
        }
      }
    });

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(id);

    await pool.query(
      `UPDATE videos SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );

    return this.getVideoById(id);
  }

  async deleteVideo(id: number, userId: number) {
    const [videos] = await pool.query<RowDataPacket[]>(
      'SELECT user_id FROM videos WHERE id = ?',
      [id]
    );

    if (videos.length === 0) {
      throw new Error('Video not found');
    }

    if (videos[0].user_id !== userId) {
      throw new Error('Unauthorized to delete this video');
    }

    await pool.query('DELETE FROM videos WHERE id = ?', [id]);

    return { message: 'Video deleted successfully' };
  }

  private extractYouTubeId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }
}

export default new VideoService();
