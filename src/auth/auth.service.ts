import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UserRepository, RoleRepository } from '../database/repositorise/user.repository.js';
const roles = new RoleRepository();

import { RegisterDto } from './dto/register.dto.interface.js';
import { LoginDto } from './dto/login.dto.interface.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase().trim();

    const existingUser =
      await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictException(
        'Email already exists',
      );
    }

    const userRole = await roles.findByName('USER');
    if (!userRole) {
      throw new Error('Default role not seeded — run the seed script');
    }

    // Hash the password before storing it in the database
    const passwordHash = await bcrypt.hash(
      dto.password,
      12,
    );

    const user = await this.userRepository.create({
      name: dto.name.trim(),
      email,
      passwordHash,
      roleId: userRole.id
    });

    // Never return the password hash
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.roleId,
      createdAt: user.createdAt,
    };
  }

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase().trim();

    const user =
      await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    // Compare the plain password with the stored hash
    const passwordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!passwordValid) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.roleId,
    };

    // Generate a signed JWT access token
    const accessToken =
      await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.roleId,
      },
    };
  }
}