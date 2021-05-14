import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Patch,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserInfoDto } from '../dto/user.dto';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('/:id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @Post()
  @Header('Cache-Control', 'none')
  createUser(@Body() dto: CreateUserDto): Promise<UserInfoDto> {
    const promise = new Promise<UserInfoDto>((resolve, reject) => {
      try {
        const user = this.userService.createUser(dto);
        resolve(user);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
    return promise.then((user) => user);
  }

  @Patch()
  @Header('Cache-Control', 'none')
  updateUser(@Body() dto: UpdateUserDto): Promise<UserInfoDto> {
    const promise = new Promise<UserInfoDto>((resolve, reject) => {
      try {
        const user = this.userService.updateUser(dto);
        resolve(user);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
    return promise.then((user) => user);
  }

  @Delete('/:id')
  removeUserById(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.userService.remove(id);
  }
}
