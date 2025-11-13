import sql from 'mssql';
import { config } from '@/config';

let pool: sql.ConnectionPool | null = null;

/**
 * @summary
 * Gets or creates database connection pool
 *
 * @function getPool
 * @module instances/database
 *
 * @returns {Promise<sql.ConnectionPool>} Database connection pool
 *
 * @throws {Error} Connection errors
 */
export async function getPool(): Promise<sql.ConnectionPool> {
  if (!pool) {
    const dbConfig: sql.config = {
      server: config.database.server,
      port: config.database.port,
      database: config.database.database,
      user: config.database.user,
      password: config.database.password,
      options: {
        encrypt: config.database.options.encrypt,
        trustServerCertificate: config.database.options.trustServerCertificate,
      },
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
      },
    };

    pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();

    console.log('Database connection pool created');
  }

  return pool;
}

/**
 * @summary
 * Closes database connection pool
 *
 * @function closePool
 * @module instances/database
 *
 * @returns {Promise<void>}
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.close();
    pool = null;
    console.log('Database connection pool closed');
  }
}
