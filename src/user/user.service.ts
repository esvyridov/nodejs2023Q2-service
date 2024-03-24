import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  create({ login, password }: CreateUserDto): Promise<User> {
    return this.prismaService.user.create({
      data: {
        login,
        password,
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

  async update(
    id: string,
    { newPassword }: UpdatePasswordDto,
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
}
