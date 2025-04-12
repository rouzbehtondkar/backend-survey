import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateAdminDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
