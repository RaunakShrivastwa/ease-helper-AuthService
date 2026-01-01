import axios from "axios";
import dataBase from "../../config/dataBase";
import dotenv from "dotenv";
import responseError from "../error/responseError";
import { Response } from "express";
import { Auth } from "../model/Auth";
import { User } from "../model/User";
dotenv.config();

export class UserRepository {
  private tableName: string;
  private pool: any;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.pool = dataBase.getPool(); // ✅ Get pool here
  }

  async createAuthTable(): Promise<string> {
    try {
      const query = ` create table ${this.tableName} (
      id SERIAL PRIMARY KEY,
        userId INTEGER NOT NULL,
        refreshToken VARCHAR(255) NOT NULL,
        expiresAt TIMESTAMP NOT NULL,
        isRevoked BOOLEAN DEFAULT FALSE,
        deviceInfo TEXT,
        ipAddress VARCHAR(45),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP); `;

      await this.pool.query(query);
      return "Auth table created successfully";
    } catch (err: any) {
      return `Error creating ${this.tableName} table: ${err.message}`;
    }
  }

  async createUserInfoTable(): Promise<string> {
    try {
      const query = `create table ${this.tableName} (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(300),
        role VARCHAR(50),
        catogery VARCHAR(100),
        location VARCHAR(200),
        isActive VARCHAR(45) DEFAULT TRUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ); `;

      await this.pool.query(query);
      return "UserAuth table created successfully";
    } catch (err: any) {
      return `Error creating ${this.tableName} table: ${err.message}`;
    }
  }

  async createAuth(auth: any): Promise<Auth> {
    const columns: string[] = [];
    const placeholders: string[] = [];
    const values: any[] = [];

    for (const key in auth) {
      columns.push(key);
      placeholders.push(`$${columns.length}`);
      values.push((auth as any)[key]);
    }
    const query = `
      INSERT INTO ${this.tableName} (${columns.join(", ")})
      VALUES (${placeholders.join(", ")})
      RETURNING *;
    `;
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getAll(): Promise<any[]> {
    const query = `SELECT * FROM ${this.tableName} AS a INNER JOIN "userinfo" AS u ON a."userid" = u."id";`;

    const result = await this.pool.query(query);
    return result.rows;
  }

  async findByEmail(email: string, res: Response) {
    try {
      let query = `select * from ${this.tableName} where email = $1`;
      let result = await this.pool.query(query, [email]);
      console.log(query);
      return result.rows[0];
    } catch (err) {
      return responseError.responseError(res, err);
    }
  }

  async findById(id: number, res: Response): Promise<any[] | Object> {
    try {
      let query = `SELECT * FROM ${this.tableName} WHERE userID = $1 AND isRevoked = false`;
      let result = await this.pool.query(query, [id]);
      return result.rows;
    } catch (err) {
      return responseError.responseError(res, err);
    }
  }

  findByRefreshToken(refreshToken: string, res: Response) {
    try {
      let query = `SELECT * FROM Auth WHERE refreshToken = $1`;
      let result = this.pool.query(query, [refreshToken]);
      return result.rows[0];
    } catch (err) {
      return responseError.responseError(res, err);
    }

  }

  async revokeSessionById(sessionId: number) {
    const query = `
    UPDATE ${this.tableName}
    SET "isrevoked" = TRUE,
        "updatedat" = NOW()
    WHERE id = $1
  `;

    await this.pool.query(query, [sessionId]);
  }

  async deleteUser(id: number): Promise<boolean> {
    const query = `DELETE FROM ${this.tableName} WHERE id = $1;`;
    const result = await this.pool.query(query, [id]);
    console.log("resulkt",result);
    
    return result.rowCount > 0;
  }



}
