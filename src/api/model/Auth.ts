export class Auth {          // unique session id
  userId: number;          // reference to User service
  refreshToken: string;    // stored securely (hashed in prod)
  expiresAt: Date;         // refresh token expiry
  isRevoked: boolean;      // logout / security revoke
  deviceInfo?: string;     // browser / device
  ipAddress?: string;      // last known IP
  createdAt: Date;
  updatedAt: Date;

  constructor(userId: number,refreshToken: string,expiresAt: Date,deviceInfo?: string,ipAddress?: string ) {
    this.userId = userId;
    this.refreshToken = refreshToken;
    this.expiresAt = expiresAt;
    this.deviceInfo = deviceInfo;
    this.ipAddress = ipAddress;
    this.isRevoked = false;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  revoke() {
    this.isRevoked = true;
    this.updatedAt = new Date();
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

}
