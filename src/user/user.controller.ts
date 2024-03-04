import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UUIDService } from 'src/uuid/uuid.service';
import { Response } from 'express';

const MIN_LOGIN_LENGTH = 1;
const MIN_PASSWORD_LENGTH = 5;

@Controller()
export class UserController {
  constructor(private readonly userService: UserService, private readonly uuidService: UUIDService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const { login, password } = createUserDto;
    const errors: Partial<Record<keyof CreateUserDto, string>> = {};

    if (login?.length < MIN_LOGIN_LENGTH) {
      errors.login = 'Login is not provided or invalid';
    } 
    
    if (password.length < MIN_PASSWORD_LENGTH) {
      errors.password = 'Password is not provided or invalid';
    }

    if (Object.keys(errors).length !== 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        errors
      });
    }

    return res.status(HttpStatus.CREATED).json(this.userService.create(createUserDto));
  }

  @Get()
  findAll() {
    return this.userService.findAll();
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

    return res.status(HttpStatus.ACCEPTED).json(this.userService.findOne(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePasswordDto: UpdatePasswordDto, @Res() res: Response) {
    const { newPassword, oldPassword } = updatePasswordDto;
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
    
    if (user.password !== oldPassword) {
      return res.status(HttpStatus.FORBIDDEN).json({
        error: 'Password is incorrect'
      });
    }
    
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        errors: {
          newPassword: 'Password is not provided or invalid',
        }
      });
    }

    this.userService.update(id, updatePasswordDto)

    return res.status(HttpStatus.ACCEPTED).json(this.userService.findOne(id));
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
