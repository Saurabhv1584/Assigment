import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
var jwt = require("jsonwebtoken");
import { User } from "../../user/entities/user.entity";

@Injectable()
export class JwtService {
  constructor(private configService: ConfigService) {}

  sign(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
      roles: user.roles,
    };

    const secret = this.configService.get<string>("JWT_SECRET");
    const expiresIn = this.configService.get<string>("JWT_EXPIRATION");

    const token = jwt.sign(payload, secret, { expiresIn });

    return token;
  }

  verifyToken(token: string): any {
    try {
      const secret = this.configService.get<string>("JWT_SECRET");
      const decoded = jwt.verify(token, secret);
      return decoded;
    } catch (error) {
      return null;
    }
  }
}
