import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Company, Worker } from '../../../entities';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

const entities = [User, Worker, Company];

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
