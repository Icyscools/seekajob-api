import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { AuthConfig } from './services/auth.config';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '../users/user.module';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), UserModule],
  controllers: [AuthController],
  providers: [AuthConfig, AuthService, JwtStrategy],
})
export class AuthModule {}
