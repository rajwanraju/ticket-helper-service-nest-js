import { ConflictException, Injectable } from '@nestjs/common';

import { UserRepository, RoleRepository } from '../database/repositorise/user.repository.js';
import { CreateUsersDto } from './dto/create-users.dto.interface.js';

const roles = new RoleRepository();

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async create(createUsersDto: CreateUsersDto) {
    const existingUser = await this.userRepository.findByEmail(createUsersDto.email);

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const userRole = await roles.findByName('USER');
    if (!userRole) {
      throw new Error('Default role not seeded — run the seed script');
    }

    return this.userRepository.create({
      name: createUsersDto.name,
      email: createUsersDto.email,
      passwordHash: '', // You should hash the password before saving it
      roleId:userRole.id
    });
  }
}