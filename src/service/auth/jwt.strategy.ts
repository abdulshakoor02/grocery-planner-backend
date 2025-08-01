import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UserService) {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    // LOGGING: Check the secret used for VERIFYING
    console.log('JWT STRATEGY VERIFYING WITH SECRET:', secret);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    // LOGGING: Check if the validate method is even being called
    console.log('JWT STRATEGY VALIDATE METHOD CALLED WITH PAYLOAD:', payload);
    // Find user by ID, not email (this is more secure)
    const user = await this.userService.findUserByEmail(payload.email);
    console.log('User found:', user);
    if (!user) {
      console.log('User not found, returning null');
      return null;
    }

    const userData = user.toJSON();
    delete userData.password;
    console.log('Returning user data:', userData);
    return userData;
  }
}
