import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { passportJwtSecret } from 'jwks-rsa';
import { AuthConfig } from '../services/auth.config';
import { AuthService } from '../services/auth.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService, private readonly authConfig: AuthConfig) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${authConfig.authority}/.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: authConfig.clientId,
      issuer: authConfig.authority,
      algorithms: ['RS256'],
    });
  }

  public async validate(payload: any) {
    const username = payload['cognito:username'];
    const email = payload['email'];
    const expireTokenDate = new Date(payload['exp'] * 1000);
    // const emailVerified = payload['email_verified'];
    return !!payload.sub && username && email && expireTokenDate > new Date() // && emailVerified
      ? {
          username,
          email,
          role: await this.authService.validateRole(username),
        }
      : null;
  }
}
