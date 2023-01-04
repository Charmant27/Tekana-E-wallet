/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditWalletDto, WalletDto } from './dto';
import { WalletService } from './wallet.service';

@UseGuards(JwtGuard)
@Controller('api/wallets')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get()
  getAllWallets(@GetUser('id') userId: number) {
    return this.walletService.getAllWallets(userId);
  }

  @Get(':id')
  getSingleWallet(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) walletId: number,
  ) {
    return this.walletService.getSingleWallet(userId, walletId);
  }

  @Post('wallet')
  createWallet(@GetUser('id') userId: number, @Body() dto: WalletDto) {
    return this.walletService.createWallet(userId, dto);
  }

  @Patch(':id')
  updateWallet(
    @GetUser('id') userId: number,
    @Body() dto: EditWalletDto,
    @Param('id', ParseIntPipe) walletId: number,
  ) {
    return this.walletService.updateWallet(userId, dto, walletId);
  }

  @Delete(':id')
  deleteWallet(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) walletId: number,
  ) {
    return this.walletService.deleteWallet(userId, walletId);
  }
}
