import {
  IsString,
  IsEnum,
  IsArray,
  IsBoolean,
  IsOptional,
} from "class-validator";

export class ValidationRule {
  @IsString()
  @IsOptional()
  pattern?: string;

  @IsString()
  @IsOptional()
  message?: string;
}

export class DependsOn {
  @IsString()
  questionId: string;

  getOptions: (answer: string) => string[];
}

export type QuestionType = "radio" | "checkbox" | "text" | "select" | "rating";
export type QuestionCategory = "marketing" | "support";

export class Question {
  @IsString()
  id: string;

  @IsString()
  text: string;

  @IsEnum(["radio", "checkbox", "text", "select", "rating"])
  type: QuestionType;

  @IsArray()
  @IsOptional()
  options?: string[];

  @IsBoolean()
  @IsOptional()
  hasOther?: boolean;

  @IsBoolean()
  required: boolean;

  @IsEnum(["marketing", "support"])
  category: QuestionCategory;

  @IsOptional()
  validation?: ValidationRule;

  @IsOptional()
  dependsOn?: DependsOn;
}
