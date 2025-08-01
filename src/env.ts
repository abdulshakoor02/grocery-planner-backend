import 'dotenv/config';
import { Env } from './models';

export const env: Env = {
  server: {
    port: Number(process.env.PORT)!,
  },
  database: {
    dbName: process.env.DB_NAME!,
    dbUser: process.env.POSTGRES_USER!,
    dbPassword: process.env.POSTGRES_PASSWORD!,
    dbPort: Number(process.env.POSTGRES_PORT)!,
    host: process.env.POSTGRES_HOST!,
    max: Number(process.env.DB_POOL_MAX)! || 10,
    min: Number(process.env.DB_POOL_MIN)! || 0,
    idle: Number(process.env.DB_POOL_IDLE)! || 10000,
  },
  qdrant: {
    url: process.env.QDRANT_URL!,
    apiKey: process.env.QDRANT_API_KEY!,
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY!,
    baseUrl: process.env.OPENAI_BASE_URL!,
    model: process.env.OPENAI_MODEL!,
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
  },
};
