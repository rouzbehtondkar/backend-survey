import { Injectable, OnModuleInit, NotFoundException } from "@nestjs/common";
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
      // Check if admin exists
      const adminExists = await this.adminRepository.findOne({
        where: { username: "admin" },
      });

      if (!adminExists) {
        // Create default admin
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
      } else {
        console.log("Admin user already exists");
      }
    } catch (error) {
      console.error("Error during admin initialization:", error);
      throw error;
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

  async create(createAdminDto: CreateAdminDto) {
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);
    const admin = this.adminRepository.create({
      ...createAdminDto,
      password: hashedPassword,
    });
    const savedAdmin = await this.adminRepository.save(admin);
    const { password, ...result } = savedAdmin;
    return result;
  }

  async findAll() {
    const admins = await this.adminRepository.find();
    return admins.map(({ password, ...rest }) => rest);
  }

  async findOne(id: string) {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    const { password, ...result } = admin;
    return result;
  }

  async update(id: string, updateAdminDto: UpdateAdminDto) {
    const admin = await this.findOne(id);

    if (updateAdminDto.password) {
      updateAdminDto.password = await bcrypt.hash(updateAdminDto.password, 10);
    }

    await this.adminRepository.update(id, updateAdminDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    await this.adminRepository.remove(admin);
    return { message: "Admin deleted successfully" };
  }
}
