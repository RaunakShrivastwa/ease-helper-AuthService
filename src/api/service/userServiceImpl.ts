import { User } from "../model/User";
import { UserRepository } from "../repo/userRepo";
import { Response } from "express";
import { UserService } from "./userService";
import { Auth } from "../model/Auth";

export class UserServiceImpl implements UserService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository("Auth");
  }

  findAuthByToken(token: string, res: Response): Promise<Auth | null> {
    return this.userRepo.findByRefreshToken(token,res);
  }
  
  createAuth(auth: Auth): Promise<Auth> {
    return this.userRepo.createAuth(auth);
  }
  
  logout(refreshToken: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  revokeAllSessions(userId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  findByEmail(email: string, res: Response): Promise<User | null> {
    return this.userRepo.findByEmail(email, res);
  }
  getAllAuthSessions(): Promise<Auth[]> {
    return this.userRepo.getAll();
  }

  findById(id: number, res: Response): Promise<any | null> {
    return this.userRepo.findById(id, res); 
  }

  
}
