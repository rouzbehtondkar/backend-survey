import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AdminModule } from "./admin/admin.module";
import { Admin } from "./admin/entities/admin.entity";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "admin",
      database: "survey_db",
      entities: [Admin],
      synchronize: true,
    }),
    AdminModule,
    AuthModule,
  ],
})
export class AppModule {}
