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
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';

const MIN_LOGIN_LENGTH = 1;
const MAX_LOGIN_LENGTH = 128;
const MIN_PASSWORD_LENGTH = 4;
const MAX_PASSWORD_LENGTH = 128;

const filterPasswordOut = (user: User): Omit<User, 'password'> => {
  const userCopy: User = { ...user };

  delete userCopy.password;

  return userCopy;
};

@ApiTags('User')
@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly uuidService: UUIDService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
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
      .json(filterPasswordOut(this.userService.create(createUserDto)));
  }

  @Get()
  findAll() {
    return this.userService.findAll().map(filterPasswordOut);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Res() res: Response) {
    if (!this.uuidService.validate(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: `ID=${id} is not valid UUID`,
      });
    }

    const user = this.userService.findOne(id);

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: `User with ID=${id} is not found`,
      });
    }

    return res.status(HttpStatus.OK).json(filterPasswordOut(user));
  }

  @Put(':id')
  update(
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

    const user = this.userService.findOne(id);

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

    this.userService.update(id, updatePasswordDto);

    return res
      .status(HttpStatus.OK)
      .json(filterPasswordOut(this.userService.findOne(id)));
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Res() res: Response) {
    if (!this.uuidService.validate(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: `ID=${id} is not valid UUID`,
      });
    }

    const user = this.userService.findOne(id);

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: `User with ID=${id} is not found`,
      });
    }

    this.userService.remove(id);

    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
