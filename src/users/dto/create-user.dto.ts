import { IsNotEmpty, IsString, IsEnum, MinLength } from "class-validator";
import { UserRole } from "../entities/user.entity";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}
