/* eslint-disable prettier/prettier */
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WalletDto, EditWalletDto } from './dto';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async createWallet(userId: number, dto: WalletDto) {
    const wallet = await this.prisma.wallet.create({
      data: {
        userId,
        ...dto,
      },
    });
    return wallet;
  }

  async getAllWallets(userId: number) {
    const wallets = await this.prisma.wallet.findMany({
      where: {
        userId,
      },
    });
    return wallets;
  }

  async getSingleWallet(userId: number, walletId: number) {
    const wallet = await this.prisma.wallet.findFirst({
      where: {
        id: walletId,
        userId,
      },
    });
    return wallet;
  }

  async updateWallet(userId: number, dto: EditWalletDto, walletId: number) {
    const wallet = await this.prisma.wallet.findUnique({
      where: {
        id: walletId,
      },
    });
    if (!wallet || wallet.userId !== userId) {
      throw new ForbiddenException('Invalid data');
    }
    return this.prisma.wallet.update({
      where: {
        id: walletId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteWallet(userId: number, walletId: number) {
    const wallet = await this.prisma.wallet.findUnique({
      where: {
        id: walletId,
      },
    });
    if (!wallet || wallet.userId !== userId) {
      throw new NotFoundException('wallet not found');
    }
    return this.prisma.wallet.delete({
      where: {
        id: walletId,
      },
    });
  }
}
