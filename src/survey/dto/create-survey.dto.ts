import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsBoolean,
  IsOptional,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { Question } from "../entities/question.entity";

export class CreateSurveyDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Question)
  questions: Question[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  userId?: string;
}
