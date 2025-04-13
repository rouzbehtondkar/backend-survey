import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AdminAccessGuard } from "../auth/guards/admin-access.guard";
import { SurveyService } from "./survey.service";
import { CreateSurveyDto } from "./dto/create-survey.dto";
import { UpdateSurveyDto } from "./dto/update-survey.dto";

@Controller("survey")
@UseGuards(JwtAuthGuard, AdminAccessGuard)
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Post()
  create(@Body() createSurveyDto: CreateSurveyDto) {
    return this.surveyService.create(createSurveyDto);
  }

  @Get()
  findAll() {
    return this.surveyService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.surveyService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateSurveyDto: UpdateSurveyDto) {
    return this.surveyService.update(id, updateSurveyDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.surveyService.remove(id);
  }
}
