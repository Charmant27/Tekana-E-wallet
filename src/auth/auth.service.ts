/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, SigninDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    try {
      //hash password
      const password = await argon.hash(dto.password);

      //create user
      const user = await this.prisma.user.create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          phoneNumber: dto.phoneNumber,
          gender: dto.gender,
          password,
        },
      });
      return this.userToken(
        user.id,
        user.firstName,
        user.lastName,
        user.email,
        user.phoneNumber,
        user.gender,
      );
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('credentials already in use!!!');
        }
      }
      throw error;
    }
  }

  async signin(dto: SigninDto) {
    //user login
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Incorrect credentials');
    }

    //password comparison
    const pwdMatch = await argon.verify(user.password, dto.password);

    if (!pwdMatch) {
      throw new ForbiddenException('Incorrect credentials');
    }

    return this.userToken(
      user.id,
      user.firstName,
      user.lastName,
      user.email,
      user.phoneNumber,
      user.gender,
    );
  }

  async userToken(
    userId: number,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    gender: string,
  ): Promise<{ access_token: string; payload: object }> {
    const payload = {
      sub: userId,
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      gender: gender,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '45m',
      secret: secret,
    });
    return {
      payload: payload,
      access_token: token,
    };
  }
}
