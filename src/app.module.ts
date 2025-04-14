import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AdminModule } from "./admin/admin.module";
import { Admin } from "./admin/entities/admin.entity";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { User } from "./users/entities/user.entity";
import { SurveyModule } from "./survey/survey.module";
import { Survey } from "./survey/entities/survey.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "admin",
      database: "survey_db",
      entities: [Admin, User, Survey],
      synchronize: true,
      logging: true,
    }),
    AdminModule,
    AuthModule,
    UsersModule,
    SurveyModule,
  ],
})
export class AppModule {}
