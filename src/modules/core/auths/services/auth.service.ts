import { AuthConfig } from './auth.config';
import { Inject, Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';
import {
  AuthConfirmSignUpDto,
  AuthCredentialsDto,
  AuthResendConfirmationDto,
} from '../dto/auth.dto';
import { UserService } from '../../users/services/user.service';
import { CreateUserDto } from '../../users/dto/user.dto';
import { UserRole } from '../../users/dto/user.dto';
import { FilesService } from '../../../shared/uploadfiles/services/files.service';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;
  // private sessionUserAttributes: {};
  constructor(
    @Inject('AuthConfig')
    private readonly authConfig: AuthConfig,
    @Inject('UserService')
    private userService: UserService,
    @Inject('FilesService')
    private filesService: FilesService,
  ) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.authConfig.userPoolId,
      ClientId: this.authConfig.clientId,
    });
  }

  async validateRole(username: string): Promise<UserRole> {
    const user = await this.userService.findByUsername(username);
    return user.role;
  }

  async registerUser(createUserData: CreateUserDto, profileImageFile: Express.Multer.File) {
    const newCreateUserDto = createUserData;
    const { username, email, password } = createUserData;
    if (profileImageFile) {
      const profileImage = await this.filesService.uploadFile({
        file: profileImageFile,
        storagePath: `profiles`,
      });
      newCreateUserDto.profile_img = profileImage;
    }
    return new Promise((resolve, reject) => {
      return this.userPool.signUp(
        username,
        password,
        [new CognitoUserAttribute({ Name: 'email', Value: email })],
        null,
        (err, result) => {
          if (!result) {
            reject(err);
          } else {
            this.userService.createUser(newCreateUserDto);
            resolve(result.user);
          }
        },
      );
    });
  }

  confirmSignup(user: AuthConfirmSignUpDto) {
    const { username, code } = user;

    const userData = {
      Username: username,
      Pool: this.userPool,
    };

    const newUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      return newUser.confirmRegistration(code, false, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  resendConfirmationSignup(user: AuthResendConfirmationDto) {
    const { username } = user;

    const userData = {
      Username: username,
      Pool: this.userPool,
    };

    const newUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      return newUser.resendConfirmationCode((err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  // resetPassword(user: AuthConfirmSignUpDto) {
  //   const { username, code } = user;
  //   const userData = {
  //     Username: username,
  //     Pool: this.userPool,
  //   };

  //   const newUser = new CognitoUser(userData);
  //   return new Promise((resolve, reject) => {
  //     return newUser.forgotPassword(code, false, (err, result) => {
  //       if (err) reject(err);
  //       else resolve(result);
  //     });
  //   });
  // }

  authenticateUser(user: AuthCredentialsDto) {
    const { username, password } = user;

    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });
    const userData = {
      Username: username,
      Pool: this.userPool,
    };

    const newUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      return newUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }
}
