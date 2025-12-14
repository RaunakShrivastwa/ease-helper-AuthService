import { database } from "../config/dataBase";
import { logger } from "./logger";

// Map JS types to PostgreSQL types
const typeMapper = (value: any) => {
  switch (typeof value) {
    case "number":
      return "INTEGER";
    case "string":
      return "VARCHAR(255)";
    case "boolean":
      return "BOOLEAN";
    default:
      return "TEXT";
  }
};

export async function autoCreateTable(classInstance: any, tableName: string) {
  try {
    const pool = database.getPool(); // ✅ Get pool from class instance

    const sample = new classInstance(...[]);
    const modelColumns = Object.getOwnPropertyNames(sample);

    // 1. Create table if not exists
    const createCols = modelColumns
      .map((col) => {
        const type = typeMapper(sample[col]);
        if (col === "id") return `"id" SERIAL PRIMARY KEY`;
        return `"${col}" ${type}`;
      })
      .join(", ");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS ${tableName} (
        ${createCols}
      );
    `);

    logger.info(`Ensured table '${tableName}' exists`);

    // 2. Get current column names from DB
    const dbRes = await pool.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = '${tableName}';
    `);

    const dbColumns = dbRes.rows.map((r: any) => r.column_name);

    // 3. Find missing columns
    const missing = modelColumns.filter((col) => !dbColumns.includes(col));

    let changed = false;

    // 4. Add missing columns
    for (const col of missing) {
      const type = typeMapper(sample[col]);

      await pool.query(`
        ALTER TABLE ${tableName}
        ADD COLUMN "${col}" ${type};
      `);

      logger.info(`Added column '${col}' to table '${tableName}'`);
      changed = true;
    }

    if (changed) {
      logger.info(`Table '${tableName}' updated with new fields`);
    } else {
      logger.info(`Table '${tableName}' already up-to-date`);
    }
  } catch (error: any) {
    logger.error(`Migration error in table '${tableName}': ${error.message}`);
  }
}
