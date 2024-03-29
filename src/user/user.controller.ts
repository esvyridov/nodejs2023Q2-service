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
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { UUIDService } from 'src/uuid/uuid.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { LoggingInterceptor } from 'src/logging/logging.interceptor';
import { LoggingService } from 'src/logging/logging.service';
import * as bcrypt from 'bcrypt';
import { CRYPT_SALT } from 'src/auth/auth.constants';

@ApiTags('User')
@UseInterceptors(new LoggingInterceptor('User', new LoggingService()))
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
      typeof login !== 'string'
    ) {
      errors.login = 'Field "login" is not provided or invalid';
    }

    if (
      typeof password !== 'string'
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
      .json(this.userService.formatUser(await this.userService.create(createUserDto)));
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

    return res.status(HttpStatus.OK).json(this.userService.formatUser(user));
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
      typeof newPassword !== 'string'
    ) {
      errors.newPassword = 'Field "newPassword" is not provided or invalid';
    }

    if (
      typeof oldPassword !== 'string'
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

    if (!await bcrypt.compare(oldPassword, user.password)) {
      return res.status(HttpStatus.FORBIDDEN).json({
        error: "Passwords don't match",
      });
    }

    const hash = await bcrypt.hash(newPassword, CRYPT_SALT);

    return res
      .status(HttpStatus.OK)
      .json(this.userService.formatUser(await this.userService.update(id, {
        newPassword: hash,
      })));
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
