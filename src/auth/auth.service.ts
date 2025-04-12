import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { Admin } from "../admin/entities/admin.entity";
import { User } from "../users/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    // First try to find admin
    const admin = await this.adminRepository.findOne({
      where: { username },
    });

    if (admin) {
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (isPasswordValid) {
        const { password, ...result } = admin;
        return { ...result, role: "admin" };
      }
    }

    // If not admin, try to find user
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const { password, ...result } = user;
        return result;
      }
    }

    return null;
  }

  async login(credentials: { username: string; password: string }) {
    const user = await this.validateUser(
      credentials.username,
      credentials.password
    );

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    return {
      message: "Login successful",
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }
}
