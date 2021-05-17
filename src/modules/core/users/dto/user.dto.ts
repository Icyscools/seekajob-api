export interface UserProfileDto {
  username: string;
  email: string;
  bio?: string;
  profile_img?: string;
  role: UserRole;
}

export enum UserRole {
  WORKER = 'worker',
  COMPANY = 'company',
}

export type UserInfoDto = Omit<UserProfileDto, 'password'>;

export interface UpdateUser {
  id: number;
  password?: string;
  email?: string;
  bio?: string;
  profile_img?: string;
  role: UserRole;
}

export interface UpdateWorkerDto extends UpdateUser {
  role: UserRole.WORKER;
  qualification?: string;
  phone_number?: string;
  experience?: string;
}

export interface UpdateCompanyDto extends UpdateUser {
  role: UserRole.COMPANY;
  company_name?: string;
  company_description?: string;
}

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

export type UpdateUserDto = UpdateWorkerDto | UpdateCompanyDto;
