import { Response } from "express";
import { User } from "../model/User.js";
import { Auth } from "../model/Auth.js";

export interface UserService {
  createAuth(auth: Auth): Promise<Auth>;
  findByEmail(email: string, res: Response): Promise<User | null>;
  logout(refreshToken: string): Promise<void>;
  revokeAllSessions(userId: string): Promise<void>;
  getAllAuthSessions(): Promise<Auth[]>;
  findById(id: number,res:Response): Promise<any[] | null>;
  findAuthByToken(token: string,res:Response): Promise<Auth | null>;
  deleteUserInfo(id:number):Promise<boolean>
  
}
