/* eslint-disable prettier/prettier */
import { IsOptional, IsString } from "class-validator";

export class EditWalletDto {
  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  balance?: string;
}