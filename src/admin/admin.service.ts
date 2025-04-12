import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async onModuleInit() {
    const adminExists = await this.adminRepository.findOneBy({ username: 'admin' });
    if (!adminExists) {
      const admin = this.adminRepository.create({
        username: 'admin',
        password: 'admin123',
      });
      await this.adminRepository.save(admin);
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    // در اینجا می‌توانیم منطق اضافی مثل هش کردن پسورد را اضافه کنیم
    const user = this.adminRepository.create(createUserDto);
    return await this.adminRepository.save(user);
  }

  create(createAdminDto: CreateAdminDto) {
    return 'This action adds a new admin';
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
