import { db } from '@/lib/db/database.service'
import crypto from 'crypto'

export interface User {
  id: number
  email: string
  name: string
  google_id: string | null
  avatar_url: string | null
  created_at: Date
  updated_at: Date
  last_login: Date | null
}

export interface UserSession {
  id: string
  user_id: number
  expires_at: Date
  created_at: Date
}

export class AuthService {
  private static instance: AuthService

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  // Find or create user from Google OAuth profile
  async findOrCreateUser(profile: {
    email: string
    name: string
    google_id: string
    avatar_url?: string
  }): Promise<User> {
    // Check if user exists by google_id
    let result = await db.query<User>(
      'SELECT * FROM users WHERE google_id = ?',
      [profile.google_id]
    )

    if (result.rows.length > 0) {
      // Update last_login and avatar_url
      await db.query(
        'UPDATE users SET last_login = NOW(), avatar_url = ? WHERE id = ?',
        [profile.avatar_url || null, result.rows[0].id]
      )
      return result.rows[0]
    }

    // Check if user exists by email (for email-first flow)
    result = await db.query<User>(
      'SELECT * FROM users WHERE email = ?',
      [profile.email]
    )

    if (result.rows.length > 0) {
      // Link Google account to existing email user
      await db.query(
        'UPDATE users SET google_id = ?, avatar_url = ?, last_login = NOW() WHERE id = ?',
        [profile.google_id, profile.avatar_url || null, result.rows[0].id]
      )
      return result.rows[0]
    }

    // Create new user
    const insertResult = await db.query(
      'INSERT INTO users (email, name, google_id, avatar_url, last_login) VALUES (?, ?, ?, ?, NOW())',
      [profile.email, profile.name, profile.google_id, profile.avatar_url || null]
    )

    const newUser = await db.query<User>(
      'SELECT * FROM users WHERE id = ?',
      [insertResult.insertId]
    )

    return newUser.rows[0]
  }

  // Create user with just email (for email-only flow)
  async createEmailUser(email: string, name?: string): Promise<User> {
    // Check if user exists
    const existing = await db.query<User>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )

    if (existing.rows.length > 0) {
      // Update last_login
      await db.query(
        'UPDATE users SET last_login = NOW() WHERE id = ?',
        [existing.rows[0].id]
      )
      return existing.rows[0]
    }

    // Create new user
    const insertResult = await db.query(
      'INSERT INTO users (email, name, last_login) VALUES (?, ?, NOW())',
      [email, name || email.split('@')[0]]
    )

    const newUser = await db.query<User>(
      'SELECT * FROM users WHERE id = ?',
      [insertResult.insertId]
    )

    return newUser.rows[0]
  }

  // Get user by ID
  async getUserById(userId: number): Promise<User | null> {
    const result = await db.query<User>(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    )
    return result.rows[0] || null
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    const result = await db.query<User>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )
    return result.rows[0] || null
  }

  // Create session
  async createSession(userId: number): Promise<string> {
    const sessionId = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    await db.query(
      'INSERT INTO user_sessions (id, user_id, expires_at) VALUES (?, ?, ?)',
      [sessionId, userId, expiresAt]
    )

    // Update last_login
    await db.query(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [userId]
    )

    return sessionId
  }

  // Get user by session
  async getUserBySession(sessionId: string): Promise<User | null> {
    const result = await db.query<User & { expires_at: Date }>(
      `SELECT u.*, s.expires_at
       FROM users u
       JOIN user_sessions s ON u.id = s.user_id
       WHERE s.id = ? AND s.expires_at > NOW()`,
      [sessionId]
    )

    return result.rows[0] || null
  }

  // Delete session (logout)
  async deleteSession(sessionId: string): Promise<void> {
    await db.query('DELETE FROM user_sessions WHERE id = ?', [sessionId])
  }

  // Clean expired sessions
  async cleanExpiredSessions(): Promise<void> {
    await db.query('DELETE FROM user_sessions WHERE expires_at < NOW()')
  }

  // Save custom scenario for user
  async saveScenario(userId: number, title: string, context: string): Promise<number> {
    const result = await db.query(
      'INSERT INTO user_scenarios (user_id, title, context) VALUES (?, ?, ?)',
      [userId, title, context]
    )
    return result.insertId!
  }

  // Get user's custom scenarios
  async getUserScenarios(userId: number): Promise<Array<{
    id: number
    title: string
    context: string
    created_at: Date
  }>> {
    const result = await db.query(
      'SELECT id, title, context, created_at FROM user_scenarios WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    )
    return result.rows
  }

  // Save decision to history
  async saveDecisionHistory(data: {
    user_id?: number
    scenario_id?: number
    scenario_title: string
    scenario_context: string
    decision_mode: 'speed' | 'balanced' | 'compliance' | 'customer'
    ai_decision: string
    confidence: number
    risk: 'low' | 'medium' | 'high'
    business_impact: string
    reasoning: string
    ai_provider?: string
    response_time?: number
  }): Promise<void> {
    await db.query(
      `INSERT INTO decision_history
       (user_id, scenario_id, scenario_title, scenario_context, decision_mode,
        ai_decision, confidence, risk, business_impact, reasoning,
        ai_provider, response_time)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.user_id || null,
        data.scenario_id || null,
        data.scenario_title,
        data.scenario_context,
        data.decision_mode,
        data.ai_decision,
        data.confidence,
        data.risk,
        data.business_impact,
        data.reasoning,
        data.ai_provider || null,
        data.response_time || null,
      ]
    )
  }
}

export const authService = AuthService.getInstance()
