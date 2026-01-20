import mysql from 'mysql2/promise'

interface QueryResult<T> {
  rows: T[]
  affectedRows?: number
  insertId?: number
}

export class DatabaseService {
  private static instance: DatabaseService
  private pool: mysql.Pool

  private constructor() {
    this.pool = mysql.createPool({
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '3306'),
      database: process.env.DATABASE_NAME || 'deepxone',
      user: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || '',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    })
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }

  public async query<T = any>(
    sql: string,
    params?: any[]
  ): Promise<QueryResult<T>> {
    const connection = await this.pool.getConnection()

    try {
      const [results] = await connection.execute(sql, params)

      if (Array.isArray(results)) {
        return { rows: results as T[] }
      }

      const resultSet = results as mysql.ResultSetHeader
      return {
        rows: [],
        affectedRows: resultSet.affectedRows,
        insertId: resultSet.insertId,
      }
    } finally {
      connection.release()
    }
  }

  public async transaction<T>(
    callback: (connection: mysql.PoolConnection) => Promise<T>
  ): Promise<T> {
    const connection = await this.pool.getConnection()

    try {
      await connection.beginTransaction()
      const result = await callback(connection)
      await connection.commit()
      return result
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }

  public async healthCheck(): Promise<boolean> {
    try {
      const result = await this.query<{ health: number }>('SELECT 1 as health')
      return result.rows[0]?.health === 1
    } catch (error) {
      console.error('Database health check failed:', error)
      return false
    }
  }

  public async close(): Promise<void> {
    await this.pool.end()
  }
}

export const db = DatabaseService.getInstance()
