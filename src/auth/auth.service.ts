import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Admin } from "../admin/entities/admin.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>
  ) {}

  async login(credentials: { username: string; password: string }) {
    const admin = await this.adminRepository.findOneBy({
      username: credentials.username,
      password: credentials.password,
    });

    if (!admin) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return { message: "Login successful" };
  }
}
