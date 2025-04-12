import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Admin } from "../../admin/entities/admin.entity";
import { User } from "../../users/entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: "super-secret-jwt-key-123",
    });
  }

  async validate(payload: any) {
    const { sub: id, username, role } = payload;

    // First check in admin table
    const admin = await this.adminRepository.findOne({
      where: { username },
    });

    if (admin) {
      return { ...admin, role: "admin" };
    }

    // If not admin, check in users table
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (user) {
      return user;
    }

    throw new UnauthorizedException();
  }
}
