import { Module } from '@nestjs/common';
import { Company } from './entities/company.entity';
import { User } from './entities/user.entity';
import { Worker } from './entities/worker.entity';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';

const entities = [User, Worker, Company];

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
