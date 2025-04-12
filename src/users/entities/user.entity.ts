import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
  ADMIN = "admin",
  SALES_EXPERT = "sales_expert",
  MARKET_DEVELOPMENT_EXPERT = "market_development_expert",
  SALES_SUPERVISOR = "sales_supervisor",
  MARKET_DEVELOPMENT_SUPERVISOR = "market_development_supervisor",
}

@Entity("user")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.SALES_EXPERT,
  })
  role: UserRole;
}
