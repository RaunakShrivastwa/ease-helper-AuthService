import jwt from "jsonwebtoken";

interface JwtPayload {
  sub: number;
  role: "USER" | "PROVIDER" | "ADMIN";
  tv: string;
}

class JwtUtil {

  signAccessToken(payload: JwtPayload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: "2m",
      issuer: "auth-service",
      audience: "api-gateway",
    });
  }

  signRefreshToken(payload: JwtPayload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
      expiresIn: "30d",
      issuer: "auth-service",
    });
  }

  verifyRefreshToken(token: string): string | jwt.JwtPayload {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
  }
  
}

export default new JwtUtil();
