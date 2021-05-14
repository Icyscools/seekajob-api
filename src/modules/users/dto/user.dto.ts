export interface UserProfileDto {
  username: string;
  password: string;
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
