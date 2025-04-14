import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Survey } from "./entities/survey.entity";
import { CreateSurveyDto } from "./dto/create-survey.dto";
import { UpdateSurveyDto } from "./dto/update-survey.dto";
import { Question } from "./entities/question.entity";
import { provinces } from "./data/provinces";

@Injectable()
export class SurveyService {
  private readonly marketingQuestions: Question[] = [
    {
      id: "1",
      text: "آیا تا کنون تجربه استفاده از محصولات نویان را داشته اید؟",
      type: "radio",
      options: [
        "بله قبلا استفاده کردم",
        "خیر، این اولین بار است که با محصولات نویان آشنا می‌شوم",
      ],
      required: true,
      category: "marketing",
    },
    {
      id: "2",
      text: "مهمترین عاملی که در خرید کیت‌های تشخیصی برای شما اهمیت دارد چیست؟",
      type: "checkbox",
      options: [
        "کیفیت و دقت تشخیص",
        "قیمت مناسب",
        "سرعت دریافت نتایج",
        "خدمات پس از فروش و پشتیبانی",
        "سایر",
      ],
      hasOther: true,
      required: true,
      category: "marketing",
    },
    {
      id: "3",
      text: "چه عاملی می‌تواند شما را به خرید یا افزایش سفارش محصولات نویان ترغیب کند؟",
      type: "radio",
      options: [
        "ارائه تخفیف با پیشنهاد ویژه",
        "امکان تست رایگان قبل از خرید",
        "بهبود شرایط پرداخت و تسویه",
        "ارائه اطلاعات بیشتر درباره ویژگی‌های محصول",
      ],
      required: true,
      category: "marketing",
    },
    {
      id: "4",
      text: "در مقایسه با رقبا چقدر احتمال دارد که محصولات نویان را انتخاب کنید؟",
      type: "radio",
      options: [
        "اصلا احتمال ندارد",
        "احتمال کمی دارد",
        "احتمال متوسطی دارد",
        "احتمال زیادی دارد",
        "قطعا محصولات نویان را انتخاب می‌کنم",
      ],
      required: true,
      category: "marketing",
    },
    {
      id: "5",
      text: "ترجیح می‌دهید تیم فروش نویان به چه شکل با شما در تماس باشند؟",
      type: "radio",
      options: [
        "تماس تلفنی",
        "WhatsApp/Telegram",
        "E-mail",
        "ملاقات حضوری",
        "سایر",
      ],
      hasOther: true,
      required: true,
      category: "marketing",
    },
    {
      id: "6",
      text: "شماره تماس",
      type: "text",
      required: true,
      category: "marketing",
      validation: {
        pattern: "^(\\+98|0)?9\\d{9}$",
        message: "لطفاً یک شماره موبایل معتبر وارد کنید",
      },
    },
    {
      id: "11",
      text: "استان",
      type: "select",
      options: provinces.map((p) => p.name),
      required: true,
      category: "marketing",
    },
    {
      id: "12",
      text: "شهر",
      type: "select",
      options: [],
      required: true,
      category: "marketing",
      dependsOn: {
        questionId: "11",
        getOptions: (provinceAnswer: string) => {
          const province = provinces.find((p) => p.name === provinceAnswer);
          return province ? province.cities : [];
        },
      },
    },
  ] as Question[];

  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>
  ) {}

  async create(createSurveyDto: CreateSurveyDto) {
    try {
      const survey = this.surveyRepository.create({
        ...createSurveyDto,
        questions: [this.marketingQuestions[0]], // فقط سوال اول
        answers: {},
        isCompleted: false,
        userId: null, // به صورت صریح userId را null قرار می‌دهیم
      });

      return await this.surveyRepository.save(survey);
    } catch (error) {
      console.error("Error creating survey:", error);
      throw error;
    }
  }

  async submitAnswer(id: string, answers: Record<string, any>) {
    const survey = await this.findOne(id);

    if (!survey) {
      throw new NotFoundException("نظرسنجی مورد نظر یافت نشد");
    }

    // اگر این اولین پاسخ است (به سوال اول)
    if (Object.keys(survey.answers || {}).length === 0) {
      survey.answers = answers;

      // اگر پاسخ "بله" بود، بقیه سوالات را اضافه کن
      if (answers["1"] === "بله قبلا استفاده کردم") {
        survey.questions = this.marketingQuestions;
        survey.isCompleted = false; // مهم: نظرسنجی هنوز کامل نشده
      } else {
        // فقط اگر پاسخ "خیر" بود، نظرسنجی را تمام کن
        survey.isCompleted = true;
      }
    } else {
      // برای پاسخ‌های بعدی
      survey.answers = { ...survey.answers, ...answers };

      // فقط وقتی به همه سوالات پاسخ داده شد، نظرسنجی را کامل کن
      const requiredQuestions = survey.questions.filter((q) => q.required);
      const answeredRequired = requiredQuestions.every(
        (q) => survey.answers[q.id]
      );

      if (answeredRequired) {
        survey.isCompleted = true;
      }
    }

    return await this.surveyRepository.save(survey);
  }

  async findAll() {
    return await this.surveyRepository.find({
      relations: ["user"],
    });
  }

  async findOne(id: string) {
    const survey = await this.surveyRepository.findOne({
      where: { id },
      relations: ["user"],
    });

    if (!survey) {
      throw new NotFoundException("نظرسنجی مورد نظر یافت نشد");
    }

    return survey;
  }

  async findByUser(userId: string) {
    return await this.surveyRepository.find({
      where: { userId },
      relations: ["user"],
    });
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

  async getFirstQuestion() {
    return {
      id: this.marketingQuestions[0].id,
      text: this.marketingQuestions[0].text,
      type: this.marketingQuestions[0].type,
      options: this.marketingQuestions[0].options,
      required: this.marketingQuestions[0].required,
      category: this.marketingQuestions[0].category,
    };
  }

  async getAllQuestions() {
    return {
      title: "نظرسنجی محصولات نویان",
      description: "نظرسنجی در مورد تجربه استفاده از محصولات",
      questions: this.marketingQuestions,
    };
  }
}
