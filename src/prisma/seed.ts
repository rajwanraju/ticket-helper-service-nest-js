import 'dotenv/config';

import * as bcrypt from 'bcrypt';

import { db } from '../database/db.js';

async function main() {
  // Create roles
  const adminRole = await db.role.upsert({
    where: {
      name: 'ADMIN',
    },
    update: {},
    create: {
      name: 'ADMIN',
      description: 'System administrator',
    },
  });

  const agentRole = await db.role.upsert({
    where: {
      name: 'AGENT',
    },
    update: {},
    create: {
      name: 'AGENT',
      description: 'Support agent',
    },
  });

  const userRole = await db.role.upsert({
    where: {
      name: 'USER',
    },
    update: {},
    create: {
      name: 'USER',
      description: 'Regular user',
    },
  });

  // Create permissions
  const permissionNames = [
    'ticket:create',
    'ticket:read',
    'ticket:update',
    'ticket:delete',
    'ticket:assign',

    'user:create',
    'user:read',
    'user:update',
    'user:delete',

    'role:create',
    'role:read',
    'role:update',
    'role:delete',

    'permission:create',
    'permission:read',
    'permission:update',
    'permission:delete',
  ];

  const permissions = [];

  for (const name of permissionNames) {
    const permission = await db.permission.upsert({
      where: { name },
      update: {},
      create: {
        name,
      },
    });

    permissions.push(permission);
  }

  // Give every permission to ADMIN
  for (const permission of permissions) {
    await db.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }

  // Create default admin user
  const passwordHash = await bcrypt.hash(
    process.env.ADMIN_PASSWORD!,
    12,
  );

  await db.user.upsert({
    where: {
      email: process.env.ADMIN_EMAIL!,
    },
    update: {
      roleId: adminRole.id,
    },
    create: {
      name: 'System Admin',
      email: process.env.ADMIN_EMAIL!,
      passwordHash,
      roleId: adminRole.id,
    },
  });

  console.log('Roles created');
  console.log('Permissions created');
  console.log('Admin permissions assigned');
  console.log('Admin user created');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });