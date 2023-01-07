/* eslint-disable prettier/prettier */
import {
  Controller,
  UseGuards,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto';

@UseGuards(JwtGuard)
@Controller('api/transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post('transaction')
  createTransaction(@Body() dto: CreateTransactionDto) {
    return this.transactionService.createTransaction(dto);
  }

  @Get()
  viewAllTransactionsMade() {
    return this.transactionService.viewAllTransactionsMade();
  }

  @Get(':id')
  viewSingleTransaction(@Param('id', ParseIntPipe) transactionId: number) {
    return this.transactionService.viewSingleTransaction(transactionId);
  }
}
