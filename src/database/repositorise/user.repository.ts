import { db } from '../db.js';

export class UserRepository {
  findAll() {
    return db.user.findMany();
  }

  findByEmail(email: string) {
    return db.user.findFirst({
      where: {
        email,
      },
    });
  }

  findById(id: number) {
    return db.user.findFirst({
      where: {
        id,
      },
    });
  }

  create(data: {
    name: string;
    email: string;
    passwordHash: string;
    roleId:number;
  }) {
    return db.user.create({
      data,
    });
  }
}

export class RoleRepository {
  findByName(name: string) {
    return db.role.findFirst({ where: { name } });
  }
}