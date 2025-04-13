import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Survey } from "./entities/survey.entity";
import { CreateSurveyDto } from "./dto/create-survey.dto";
import { UpdateSurveyDto } from "./dto/update-survey.dto";

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>
  ) {}

  async create(createSurveyDto: CreateSurveyDto) {
    const survey = this.surveyRepository.create(createSurveyDto);
    return await this.surveyRepository.save(survey);
  }

  async findAll() {
    return await this.surveyRepository.find();
  }

  async findOne(id: string) {
    const survey = await this.surveyRepository.findOne({ where: { id } });
    if (!survey) {
      throw new NotFoundException("نظرسنجی مورد نظر یافت نشد");
    }
    return survey;
  }

  async update(id: string, updateSurveyDto: UpdateSurveyDto) {
    const survey = await this.findOne(id);
    Object.assign(survey, updateSurveyDto);
    return await this.surveyRepository.save(survey);
  }

  async remove(id: string) {
    const survey = await this.findOne(id);
    await this.surveyRepository.remove(survey);
    return { message: "نظرسنجی با موفقیت حذف شد" };
  }
}
