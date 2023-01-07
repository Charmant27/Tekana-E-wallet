/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async createTransaction(dto: CreateTransactionDto) {
    const transaction = await this.prisma.transaction.create({
      data: {
        ...dto,
      },
    });
    return transaction;
  }

  async viewAllTransactionsMade() {
    return this.prisma.transaction.findMany({});
  }

  async viewSingleTransaction(transactionId: number) {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id: transactionId,
      },
    });
    if (!transaction) {
      throw new NotFoundException('could not find transaction');
    }
    return transaction;
  }
}
