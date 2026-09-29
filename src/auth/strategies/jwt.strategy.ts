import {
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  
  import { PassportStrategy } from '@nestjs/passport';
  import {
    ExtractJwt,
    Strategy,
  } from 'passport-jwt';
  
  import { UserRepository } from '../../database/repositorise/user.repository.js';
  
  @Injectable()
  export class JwtStrategy extends PassportStrategy(
    Strategy,
  ) {
    constructor(
      private readonly userRepository: UserRepository,
    ) {
      const jwtSecret = process.env.JWT_SECRET;
  
      if (!jwtSecret) {
        throw new Error(
          'JWT_SECRET environment variable is not configured',
        );
      }
  
      super({
        jwtFromRequest:
          ExtractJwt.fromAuthHeaderAsBearerToken(),
  
        ignoreExpiration: false,
  
        secretOrKey: jwtSecret,
      });
    }
  
    async validate(payload: {
      sub: number;
      email: string;
      role: string;
    }) {
      const user = await this.userRepository.findById(
        payload.sub,
      );
  
      if (!user) {
        throw new UnauthorizedException(
          'User no longer exists',
        );
      }
  
      // Return user data that will be available as req.user
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.roleId,
      };
    }
  }