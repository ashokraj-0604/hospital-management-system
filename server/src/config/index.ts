import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.PORT || '3001', 10),
  env: process.env.NODE_ENV || 'development',

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpireIn: process.env.JWT_EXPIRE_IN || '1h',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production',
  jwtRefreshExpireIn: process.env.JWT_REFRESH_EXPIRE_IN || '7d',

  // Database (placeholder for future implementation)
  database: {
    type: process.env.DB_TYPE || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'hms',
  },
};
