/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from "class-validator";

export class WalletDto {
  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsNotEmpty()
  balance: string;
}