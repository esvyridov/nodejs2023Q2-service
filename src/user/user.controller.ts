import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { UUIDService } from 'src/uuid/uuid.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';

const MIN_LOGIN_LENGTH = 1;
const MAX_LOGIN_LENGTH = 128;
const MIN_PASSWORD_LENGTH = 4;
const MAX_PASSWORD_LENGTH = 128;

const formatUser = (user: User): Omit<User, 'password' | 'createdAt' | 'updatedAt'> & { createdAt: number; updatedAt: number } => {
  const userCopy: User = { ...user };

  delete userCopy.password;

  return {
    ...userCopy,
    createdAt: user.createdAt.valueOf(),
    updatedAt: user.updatedAt.valueOf(),
  };
};

@ApiTags('User')
@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly uuidService: UUIDService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const { login, password } = createUserDto;
    const errors: Partial<Record<keyof CreateUserDto, string>> = {};

    if (
      typeof login !== 'string' ||
      login.length < MIN_LOGIN_LENGTH ||
      login.length > MAX_LOGIN_LENGTH
    ) {
      errors.login = 'Field "login" is not provided or invalid';
    }

    if (
      typeof password !== 'string' ||
      password.length < MIN_PASSWORD_LENGTH ||
      password.length > MAX_PASSWORD_LENGTH
    ) {
      errors.password = 'Field "password" is not provided or invalid';
    }

    if (Object.keys(errors).length !== 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        errors,
      });
    }

    return res
      .status(HttpStatus.CREATED)
      .json(formatUser(await this.userService.create(createUserDto)));
  }

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    if (!this.uuidService.validate(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: `ID=${id} is not valid UUID`,
      });
    }

    const user = await this.userService.findOne(id);

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: `User with ID=${id} is not found`,
      });
    }

    return res.status(HttpStatus.OK).json(formatUser(user));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Res() res: Response,
  ) {
    if (!this.uuidService.validate(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: `ID=${id} is not valid UUID`,
      });
    }

    const { newPassword, oldPassword } = updatePasswordDto;
    const errors: Partial<Record<keyof UpdatePasswordDto, string>> = {};

    if (
      typeof newPassword !== 'string' ||
      newPassword.length < MIN_PASSWORD_LENGTH ||
      newPassword.length > MAX_PASSWORD_LENGTH
    ) {
      errors.newPassword = 'Field "newPassword" is not provided or invalid';
    }

    if (
      typeof oldPassword !== 'string' ||
      oldPassword.length < MIN_PASSWORD_LENGTH ||
      oldPassword.length > MAX_PASSWORD_LENGTH
    ) {
      errors.oldPassword = 'Field "oldPassword" is not provided or invalid';
    }

    if (Object.keys(errors).length !== 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        errors,
      });
    }

    const user = await this.userService.findOne(id);

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: `User with ID=${id} is not found`,
      });
    }

    if (user.password !== oldPassword) {
      return res.status(HttpStatus.FORBIDDEN).json({
        error: "Passwords don't match",
      });
    }

    return res
      .status(HttpStatus.OK)
      .json(formatUser(await this.userService.update(id, updatePasswordDto)));
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    if (!this.uuidService.validate(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: `ID=${id} is not valid UUID`,
      });
    }

    const user = await this.userService.findOne(id);

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: `User with ID=${id} is not found`,
      });
    }

    await this.userService.remove(id);

    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
