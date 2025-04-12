import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { Admin } from "./entities/admin.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>
  ) {}

  async onModuleInit() {
    try {
      // Delete existing admin if exists
      await this.adminRepository.delete({ username: "admin" });

      // Create new admin with hashed password
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const admin = this.adminRepository.create({
        username: "admin",
        password: hashedPassword,
      });

      const savedAdmin = await this.adminRepository.save(admin);
      console.log("Default admin created successfully:", {
        id: savedAdmin.id,
        username: savedAdmin.username,
      });
    } catch (error) {
      console.error("Error creating default admin:", error);
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.adminRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return await this.adminRepository.save(user);
  }

  create(createAdminDto: CreateAdminDto) {
    return "This action adds a new admin";
  }

  findAll() {
    return `This action returns all admin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
