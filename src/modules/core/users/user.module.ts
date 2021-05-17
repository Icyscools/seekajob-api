import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Company, Worker } from '../../../entities';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { FilesModule } from '../../shared/uploadfiles/files.module';

const entities = [User, Worker, Company];

@Module({
  imports: [TypeOrmModule.forFeature(entities), FilesModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
