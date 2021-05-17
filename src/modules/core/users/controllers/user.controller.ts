import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Patch,
  ParseIntPipe,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserInfoDto, UpdateUserDto } from '../dto/user.dto';
import { UserService } from '../services/user.service';
import { User } from '../../../../entities';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('/me')
  getUserFromCurrentUser(@Req() req): Promise<User> {
    const { username, role } = req.user;
    return this.userService.findFromCurrentUser(username, role);
  }

  @Get('/:id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @Get('/username/:username')
  getUserByUsername(@Param('username') username: string): Promise<User> {
    return this.userService.findByUsername(username);
  }

  // @dev create user occur on auth service when user register a new account
  // @Post()
  // @Header('Cache-Control', 'none')
  // createUser(@Body() dto: CreateUserDto): Promise<UserInfoDto> {
  //   const promise = new Promise<UserInfoDto>((resolve, reject) => {
  //     try {
  //       const user = this.userService.createUser(dto);
  //       resolve(user);
  //     } catch (err) {
  //       console.error(err);
  //       reject(err);
  //     }
  //   });
  //   return promise.then((user) => user);
  // }

  @Patch()
  @Header('Cache-Control', 'none')
  @UseInterceptors(FileInterceptor('profile_image'))
  updateUser(
    @Body() dto: UpdateUserDto,
    @UploadedFile() profileImage: Express.Multer.File,
  ): Promise<UserInfoDto> {
    const promise = new Promise<UserInfoDto>((resolve, reject) => {
      try {
        const user = this.userService.updateUser(dto, profileImage);
        resolve(user);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
    return promise.then((user) => user);
  }

  @Patch('/me')
  @Header('Cache-Control', 'none')
  @UseInterceptors(FileInterceptor('profile_image'))
  updateCurrentUser(
    @Req() req,
    @Body() dto: UpdateUserDto,
    @UploadedFile() profileImage: Express.Multer.File,
  ): Promise<UserInfoDto> {
    const { username, role } = req.user;
    const promise = new Promise<UserInfoDto>((resolve, reject) => {
      try {
        const user = this.userService.updateCurrentUser(username, role, dto, profileImage);
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
