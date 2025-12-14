
import { statusType, UserRole } from "../validators/roleType";

export class User {
  id: number;
  name: string = "";
  email: string = "";
  password: string = "";
  address: string = "";
  phone: string = "";
  refreshToken: string;
  role: UserRole = UserRole.USER;
  status: statusType = statusType.ACTIVE;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
}
