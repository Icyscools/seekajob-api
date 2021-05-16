import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Company, Worker } from '../../../../entities';
import { UserInfoDto, UserRole } from '../dto/user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Worker)
    private workersRepository: Repository<Worker>,
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    // return this.usersRepository.findOne(id);
    return this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.worker', 'worker')
      .leftJoinAndSelect('user.company', 'company')
      .where('user.id = :id', { id: id })
      .getOne();
  }

  createUser(data: CreateUserDto): Promise<UserInfoDto> {
    if (data.role === UserRole.WORKER) {
      const { ...userData } = data;
      const userSchema = this.usersRepository.create({
        ...userData,
        role: UserRole.WORKER,
      });

      return this.usersRepository.save(userSchema).then((user) => {
        const workerSchema = this.workersRepository.create({
          user: user,
        });
        return this.workersRepository.save(workerSchema).then((worker) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          return worker.user;
        });
      });
    } else if (data.role === UserRole.COMPANY) {
      const { company_name, company_description, ...userData } = data;
      const userSchema = this.usersRepository.create({
        ...userData,
        role: UserRole.COMPANY,
      });

      return this.usersRepository.save(userSchema).then((user) => {
        const companySchema = this.companiesRepository.create({
          user: user,
          company_name,
          company_description,
        });
        return this.companiesRepository.save(companySchema).then((company) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          return company.user;
        });
      });
    }

    throw 'invalid role';
  }

  async updateUser(data: UpdateUserDto): Promise<UserInfoDto> {
    const foundUser = await this.findOne(data.id);
    if (foundUser && data.role === UserRole.WORKER) {
      const { experience, phone_number, qualification, ...userData } = data;

      const promise = Promise.all([
        this.usersRepository
          .createQueryBuilder('user')
          .update(User)
          .set({
            ...userData,
          })
          .where('user.id = :id', { id: data.id })
          .execute(),
        this.workersRepository
          .createQueryBuilder('worker')
          .update(Worker)
          .set({
            experience,
            phone_number,
            qualification,
          })
          .where('worker.userId = :id', { id: data.id })
          .execute(),
      ]);

      return promise.then(async (result) => {
        return await this.findOne(data.id);
      });
    } else if (foundUser && data.role === UserRole.COMPANY) {
      const { company_name, company_description, ...userData } = data;

      const promise = Promise.all([
        this.usersRepository
          .createQueryBuilder('user')
          .update(User)
          .set({
            ...userData,
          })
          .where('user.id = :id', { id: data.id })
          .execute(),
        this.companiesRepository
          .createQueryBuilder('company')
          .update(Company)
          .set({
            company_name,
            company_description,
          })
          .where('company.userId = :id', { id: data.id })
          .execute(),
      ]);

      return promise.then(async (result) => {
        return await this.findOne(data.id);
      });
    }

    throw 'not found';
  }

  async remove(id: number): Promise<boolean> {
    const foundUser = await this.findOne(id);
    if (foundUser && foundUser.role === UserRole.WORKER) {
      const promise = Promise.all([
        this.workersRepository
          .createQueryBuilder('worker')
          .softDelete()
          .where(`worker.userId = :id`, { id: id })
          .execute(),
        this.usersRepository.softDelete(id),
      ]).then((result) => result.every((record) => record.raw.affectedRows === 1));
      return promise;
    } else if (foundUser && foundUser.role === UserRole.COMPANY) {
      const promise = Promise.all([
        this.companiesRepository
          .createQueryBuilder('company')
          .softDelete()
          .where(`company.userId = :id`, { id: id })
          .execute(),
        this.usersRepository.softDelete(id),
      ]).then((result) => result.every((record) => record.raw.affectedRows === 1));
      return promise;
    }

    throw 'not found';
  }
}
