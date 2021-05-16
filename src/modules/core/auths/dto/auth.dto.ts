export interface AuthRegisterDto {
  email: string;
  password: string;
  username: string;
}

export interface AuthConfirmSignUpDto {
  username: string;
  code: string;
}

export interface AuthResendConfirmationDto {
  username: string;
}

export interface AuthCredentialsDto {
  password: string;
  username: string;
}
