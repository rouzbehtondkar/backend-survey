import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { Admin } from "../admin/entities/admin.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private jwtService: JwtService
  ) {}

  async login(credentials: { username: string; password: string }) {
    try {
      // Find admin by username
      const admin = await this.adminRepository.findOneBy({
        username: credentials.username,
      });

      if (!admin) {
        console.log(`No admin found with username: ${credentials.username}`);
        throw new UnauthorizedException("Invalid credentials");
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        credentials.password,
        admin.password
      );

      if (!isPasswordValid) {
        console.log(`Invalid password for username: ${credentials.username}`);
        throw new UnauthorizedException("Invalid credentials");
      }

      // Generate JWT token
      const payload = {
        sub: admin.id,
        username: admin.username,
      };

      const token = await this.jwtService.signAsync(payload);

      console.log(`Login successful for user: ${admin.username}`);

      return {
        message: "Login successful",
        access_token: token,
        admin: {
          id: admin.id,
          username: admin.username,
        },
      };
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException("An error occurred during login");
    }
  }
}
