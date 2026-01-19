import pool from '../config/database';
import { BlogPost } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface CreateBlogPostData {
  user_id: number;
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  is_published?: boolean;
}

interface UpdateBlogPostData {
  title?: string;
  content?: string;
  excerpt?: string;
  featured_image?: string;
  is_published?: boolean;
}

export class BlogService {
  async createPost(data: CreateBlogPostData) {
    const { user_id, title, content, excerpt, featured_image, is_published } = data;
    const slug = this.generateSlug(title);

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO blog_posts (user_id, title, slug, content, excerpt, featured_image, is_published, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        title,
        slug,
        content,
        excerpt || null,
        featured_image || null,
        is_published || false,
        is_published ? new Date() : null
      ]
    );

    return this.getPostById(result.insertId);
  }

  async getPostById(id: number) {
    const [posts] = await pool.query<RowDataPacket[]>(
      `SELECT bp.*, u.username, u.full_name as author_name, u.profile_image as author_image
       FROM blog_posts bp
       JOIN users u ON bp.user_id = u.id
       WHERE bp.id = ?`,
      [id]
    );

    if (posts.length === 0) {
      throw new Error('Blog post not found');
    }

    return posts[0];
  }

  async getPostBySlug(slug: string) {
    const [posts] = await pool.query<RowDataPacket[]>(
      `SELECT bp.*, u.username, u.full_name as author_name, u.profile_image as author_image
       FROM blog_posts bp
       JOIN users u ON bp.user_id = u.id
       WHERE bp.slug = ?`,
      [slug]
    );

    if (posts.length === 0) {
      throw new Error('Blog post not found');
    }

    return posts[0];
  }

  async getPosts(filters: {
    user_id?: number;
    is_published?: boolean;
    page?: number;
    limit?: number;
  }) {
    const { user_id, is_published, page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT bp.*, u.username, u.full_name as author_name, u.profile_image as author_image
      FROM blog_posts bp
      JOIN users u ON bp.user_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (user_id !== undefined) {
      query += ' AND bp.user_id = ?';
      params.push(user_id);
    }

    if (is_published !== undefined) {
      query += ' AND bp.is_published = ?';
      params.push(is_published);
    }

    query += ' ORDER BY bp.published_at DESC, bp.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [posts] = await pool.query<RowDataPacket[]>(query, params);

    const countQuery = query.substring(0, query.indexOf('ORDER BY')).replace('bp.*, u.username, u.full_name as author_name, u.profile_image as author_image', 'COUNT(*) as total');
    const [countResult] = await pool.query<RowDataPacket[]>(countQuery, params.slice(0, -2));
    const total = countResult[0].total;

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async updatePost(id: number, userId: number, data: UpdateBlogPostData) {
    const [posts] = await pool.query<RowDataPacket[]>(
      'SELECT user_id, is_published FROM blog_posts WHERE id = ?',
      [id]
    );

    if (posts.length === 0) {
      throw new Error('Blog post not found');
    }

    if (posts[0].user_id !== userId) {
      throw new Error('Unauthorized to update this post');
    }

    const updates: string[] = [];
    const values: any[] = [];

    Object.keys(data).forEach(key => {
      if (data[key as keyof UpdateBlogPostData] !== undefined) {
        updates.push(`${key} = ?`);
        values.push(data[key as keyof UpdateBlogPostData]);
      }
    });

    if (data.is_published && !posts[0].is_published) {
      updates.push('published_at = ?');
      values.push(new Date());
    }

    if (data.title) {
      updates.push('slug = ?');
      values.push(this.generateSlug(data.title));
    }

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(id);

    await pool.query(
      `UPDATE blog_posts SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );

    return this.getPostById(id);
  }

  async deletePost(id: number, userId: number) {
    const [posts] = await pool.query<RowDataPacket[]>(
      'SELECT user_id FROM blog_posts WHERE id = ?',
      [id]
    );

    if (posts.length === 0) {
      throw new Error('Blog post not found');
    }

    if (posts[0].user_id !== userId) {
      throw new Error('Unauthorized to delete this post');
    }

    await pool.query('DELETE FROM blog_posts WHERE id = ?', [id]);

    return { message: 'Blog post deleted successfully' };
  }

  private generateSlug(title: string): string {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const timestamp = Date.now();
    return `${baseSlug}-${timestamp}`;
  }
}

export default new BlogService();
