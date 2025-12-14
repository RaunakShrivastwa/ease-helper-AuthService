import { Pool } from "pg";
import dotenv from "dotenv";
import { logger } from "../util/logger";

dotenv.config();

class Database {
  public pool: Pool;

  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER!,
      host: process.env.DB_HOST!,
      database: process.env.DB_NAME!,
      password: process.env.DB_PASS!,
      port: Number(process.env.DB_PORT) || 5432,
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : false,
    });
  }

  public connectDatabase = async (): Promise<void> => {
    try {
      const client = await this.pool.connect();
      logger.info("Database connected successfully");
      client.release();
    } catch (error: any) {
      logger.error("Database connection failed: " + error.message);
      process.exit(1);
    }
  };

  public getPool(): Pool {
    return this.pool;
  }

  

}

export default new Database();
