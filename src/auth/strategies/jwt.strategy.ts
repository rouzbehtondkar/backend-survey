import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Admin } from "../../admin/entities/admin.entity";
import { User } from "../../users/entities/user.entity";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_SECRET", "super-secret-jwt-key-123"),
    });
  }

  async validate(payload: any) {
    const { sub: id, username, role } = payload;

    // First check in admin table
    if (role === "admin") {
      const admin = await this.adminRepository.findOne({
        where: { id },
      });

      if (admin) {
        const { password, ...result } = admin;
        return { ...result, role: "admin" };
      }
    }

    // If not admin or admin not found, check in users table
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (user) {
      const { password, ...result } = user;
      return result;
    }

    throw new UnauthorizedException("User not found");
  }
}
