import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Company, Worker } from '../../../../entities';
import { UserService } from '../services/user.service';
import { UserInfoDto, UserRole } from '../dto/user.dto';
import { CreateUserDto } from '../dto/create-user.dto';

describe('UserController', () => {
  let userService: UserService;
  let userRepositoryMock: Repository<User>;
  let workerRepositoryMock: Repository<Worker>;
  let companyRepositoryMock: Repository<Company>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Worker),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Company),
          useClass: Repository,
        },
      ],
    }).compile();

    userService = app.get<UserService>(UserService);
    userRepositoryMock = app.get<Repository<User>>(getRepositoryToken(User));
    workerRepositoryMock = app.get<Repository<Worker>>(getRepositoryToken(Worker));
    companyRepositoryMock = app.get<Repository<Company>>(getRepositoryToken(Company));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('get users', () => {
    it('should return empty user list', () => {
      const spy = jest.spyOn(userRepositoryMock, 'find').mockResolvedValueOnce([]);
      userService.findAll().then((result) => {
        expect(spy).toHaveBeenCalled();
        expect(result).toHaveLength(0);
      });
    });
  });

  // describe('create a new user', () => {
  //   it('should create and return a new user that have role worker', () => {
  //     const createWorkerDto: CreateUserDto = {
  //       username: 'worker',
  //       password: 'worker',
  //       email: 'worker@worker.com',
  //       role: UserRole.WORKER,
  //     };

  //     let expectUserData: User = new User();
  //     expectUserData = {
  //       ...createWorkerDto,
  //       id: 1,
  //       company: null,
  //       worker: null,
  //     };

  //     let expectWorkerData: Worker = new Worker();
  //     expectWorkerData = {
  //       id: 1,
  //       qualification: '',
  //       phone_number: '',
  //       experience: '',
  //       user: expectUserData,
  //     };
  //     expectUserData.worker = expectWorkerData;

  //     const expectUserResult: UserInfoDto = {
  //       username: 'worker',
  //       email: 'worker@worker.com',
  //       role: UserRole.WORKER,
  //     };

  //     const spy = jest.spyOn(userRepositoryMock, 'save').mockResolvedValueOnce(expectUserData);
  //     userService.createUser(createWorkerDto).then((result) => {
  //       expect(spy).toHaveBeenCalled();
  //       expect(spy).toEqual(expectUserData);
  //       expect(result).toEqual(expectUserResult);
  //     });
  //   });

  //   it('should create and return a new user that have role company', () => {
  //     const createCompanyDto: CreateUserDto = {
  //       username: 'company',
  //       password: 'company',
  //       email: 'company@company.com',
  //       role: UserRole.COMPANY,
  //       company_name: 'company 01',
  //     };

  //     let expectUserData: User = new User();
  //     expectUserData = {
  //       ...createCompanyDto,
  //       id: 1,
  //       company: null,
  //       worker: null,
  //     };

  //     let expectCompanyData: Company = new Company();
  //     expectCompanyData = {
  //       id: 1,
  //       company_name: createCompanyDto.company_name,
  //       user: expectUserData,
  //     };
  //     expectUserData.company = expectCompanyData;

  //     const expectUserResult: UserInfoDto = {
  //       username: 'company',
  //       email: 'company@company.com',
  //       role: UserRole.COMPANY,
  //     };

  //     const spy = jest.spyOn(userRepositoryMock, 'save').mockResolvedValueOnce(expectUserData);
  //     userService.createUser(createCompanyDto).then((result) => {
  //       expect(spy).toHaveBeenCalled();
  //       expect(spy).toEqual(expectUserData);
  //       expect(result).toEqual(expectUserResult);
  //     });
  //   });
  // });
});
