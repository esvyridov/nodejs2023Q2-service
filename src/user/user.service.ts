import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CRYPT_SALT } from 'src/auth/auth.constants';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ login, password }: CreateUserDto): Promise<User> {
    const hash = await bcrypt.hash(password, CRYPT_SALT);

    return this.prismaService.user.create({
      data: {
        login,
        password: hash,
        version: 1,
      },
    });
  }

  findAll(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  findOne(id: string): Promise<User | undefined> {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  findOneByLogin(login: string): Promise<User | undefined> {
    return this.prismaService.user.findFirst({
      where: {
        login,
      },
    });
  }

  async update(
    id: string,
    { newPassword }: { newPassword: string },
  ): Promise<User | undefined> {
    const timestamp = new Date();

    const user = await this.findOne(id);

    return this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        version: user.version + 1,
        password: newPassword,
        updatedAt: timestamp,
      },
    });
  }

  remove(id: string): Promise<User | undefined> {
    return this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }

  formatUser(user: User): Omit<User, 'password' | 'createdAt' | 'updatedAt'> & {
    createdAt: number;
    updatedAt: number;
  } {
    const userCopy: User = { ...user };
  
    delete userCopy.password;
  
    return {
      ...userCopy,
      createdAt: user.createdAt.valueOf(),
      updatedAt: user.updatedAt.valueOf(),
    };
  };
}
