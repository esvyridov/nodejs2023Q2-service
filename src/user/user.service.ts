import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { DatabaseService } from 'src/database/database.service';
import { User } from './entities/user.entity';
import { UUIDService } from 'src/uuid/uuid.service';

@Injectable()
export class UserService {
  constructor(private readonly dbService: DatabaseService, private readonly uuidService: UUIDService) {}
  
  create({ login, password}: CreateUserDto): User {
    const timestamp = new Date().valueOf();
    const user: User = {
      id: this.uuidService.generate(),
      login,
      password,
      version: 1, 
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.dbService.users.push(user);

    return user;
  }

  findAll(): User[] {
    return this.dbService.users;
  }

  findOne(id: string): User | undefined {
    return this.dbService.users.find((user) => user.id === id);
  }

  update(id: string, { newPassword }: UpdatePasswordDto): void {
    const timestamp = new Date().valueOf();
    this.dbService.users = this.dbService.users.map((user) => {
      if (user.id === id) {
        return {
          ...user,
          version: user.version + 1,
          password: newPassword,
          updatedAt: timestamp,
        }
      }
      
      return user;
    });
  }

  remove(id: string): void {
    this.dbService.users = this.dbService.users.filter((user) => user.id !== id);
  }
}
