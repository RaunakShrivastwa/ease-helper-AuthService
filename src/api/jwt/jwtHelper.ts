import jwt from "jsonwebtoken";
import fs from 'fs/promises'; // fs/promises use karein async ke liye
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
  sub: number;
  role: "USER" | "PROVIDER" | "ADMIN";
  tv: string;
}

class JwtUtil {
  private privateKey: string | null = null;

  // Key ko load karne ke liye ek async method
  private async getPrivateKey() {
    if (!this.privateKey) {
      const keyPath = path.join(__dirname,'../../../key/access-private.key');
      this.privateKey = await fs.readFile(keyPath, "utf8");
    }
    return this.privateKey;
  }

  private async getPublicKey() {  
    
      const keyPath = path.join(__dirname,'../../../key/access-public.key');
      return await fs.readFile(keyPath, "utf8");
  
  }

  async signAccessToken(payload: JwtPayload) {
    const key = await this.getPrivateKey();
    return jwt.sign(payload, key, {
      expiresIn: "20m",
      issuer: "auth-service",
      algorithm: "RS256",
      audience: "api-gateway",
    });
  }

  async signRefreshToken(payload: JwtPayload) {
    const key = await this.getPrivateKey();
    return jwt.sign(payload, key, {
      expiresIn: "30d",
      issuer: "auth-service",
      algorithm: "RS256",
    });
  }

  async verifyRefreshToken(token: string): Promise<string | jwt.JwtPayload> {
    return jwt.verify(token, await this.getPublicKey());
  }
  
}

export default new JwtUtil();