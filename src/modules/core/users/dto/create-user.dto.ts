import { UserRole } from './user.dto';

export interface CreateUser {
  username: string;
  password: string;
  email: string;
  bio?: string;
  profile_img?: string;
  role: UserRole;
}

export interface CreateWorkerDto extends CreateUser {
  role: UserRole.WORKER;
}

export interface CreateCompanyDto extends CreateUser {
  role: UserRole.COMPANY;
  company_name: string;
  company_description?: string;
}

export type CreateUserDto = CreateWorkerDto | CreateCompanyDto;
