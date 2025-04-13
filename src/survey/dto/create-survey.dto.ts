import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsBoolean,
  IsOptional,
} from "class-validator";

export class CreateSurveyDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsArray()
  questions: any[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
