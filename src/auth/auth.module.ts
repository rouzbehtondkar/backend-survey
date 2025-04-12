import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { Admin } from "../admin/entities/admin.entity";
import { User } from "../users/entities/user.entity";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, User]),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      secret: "super-secret-jwt-key-123",
      signOptions: {
        expiresIn: "24h",
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
