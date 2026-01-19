import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { User, UserRole } from '../types';
import { RowDataPacket } from 'mysql2';

interface RegisterData {
  email: string;
  password: string;
  username: string;
  full_name: string;
  role?: UserRole;
}

interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  async register(data: RegisterData) {
    const { email, password, username, full_name, role = UserRole.USER } = data;

    const [existingUsers] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUsers.length > 0) {
      throw new Error('Email or username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO users (email, password, username, full_name, role, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [email, hashedPassword, username, full_name, role, true]
    );

    const userId = (result as any).insertId;

    const token = this.generateToken(userId, email, role);

    return {
      user: {
        id: userId,
        email,
        username,
        full_name,
        role
      },
      token
    };
  }

  async login(data: LoginData) {
    const { email, password } = data;

    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT id, email, password, username, full_name, role, is_active FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = users[0] as User;

    if (!user.is_active) {
      throw new Error('Account is inactive');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
        role: user.role
      },
      token
    };
  }

  async getProfile(userId: number) {
    const [users] = await pool.query<RowDataPacket[]>(
      `SELECT id, email, username, full_name, role, bio, profile_image, website, social_links, created_at
       FROM users WHERE id = ?`,
      [userId]
    );

    if (users.length === 0) {
      throw new Error('User not found');
    }

    return users[0];
  }

  async updateProfile(userId: number, data: Partial<User>) {
    const allowedFields = ['full_name', 'bio', 'website', 'social_links', 'profile_image'];
    const updates: string[] = [];
    const values: any[] = [];

    Object.keys(data).forEach(key => {
      if (allowedFields.includes(key) && data[key as keyof User] !== undefined) {
        updates.push(`${key} = ?`);
        values.push(data[key as keyof User]);
      }
    });

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(userId);

    await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return this.getProfile(userId);
  }

  private generateToken(id: number, email: string, role: UserRole): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET not configured');
    }

    const payload = { id, email, role };
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
  }
}

export default new AuthService();
