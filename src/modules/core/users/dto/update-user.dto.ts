import { UserRole } from './user.dto';

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

export type UpdateUserDto = UpdateWorkerDto | UpdateCompanyDto;
