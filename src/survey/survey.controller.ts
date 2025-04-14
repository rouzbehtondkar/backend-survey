import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AdminAccessGuard } from "../auth/guards/admin-access.guard";
import { SurveyService } from "./survey.service";
import { CreateSurveyDto } from "./dto/create-survey.dto";
import { UpdateSurveyDto } from "./dto/update-survey.dto";

@Controller("survey")
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminAccessGuard)
  create(@Body() createSurveyDto: CreateSurveyDto, @Request() req) {
    return this.surveyService.create({
      ...createSurveyDto,
      userId: req.user.id,
    });
  }

  @Post(":id/answer")
  @HttpCode(HttpStatus.OK)
  submitAnswer(@Param("id") id: string, @Body() answers: Record<string, any>) {
    return this.surveyService.submitAnswer(id, answers);
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminAccessGuard)
  findAll() {
    return this.surveyService.findAll();
  }

  @Get("my-surveys")
  @UseGuards(JwtAuthGuard)
  findMySurveys(@Request() req) {
    return this.surveyService.findByUser(req.user.id);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, AdminAccessGuard)
  findOne(@Param("id") id: string) {
    return this.surveyService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, AdminAccessGuard)
  update(@Param("id") id: string, @Body() updateSurveyDto: UpdateSurveyDto) {
    return this.surveyService.update(id, updateSurveyDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, AdminAccessGuard)
  remove(@Param("id") id: string) {
    return this.surveyService.remove(id);
  }

  @Get("active/first-question")
  getFirstQuestion() {
    return this.surveyService.getFirstQuestion();
  }

  @Get("questions/all")
  getAllQuestions() {
    return this.surveyService.getAllQuestions();
  }
}
