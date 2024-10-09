import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User, Role as PRole } from '@prisma/client';
import { Role } from './enums/role.enum';
import { ROLES_KEY } from './roles.decorator';

type CustomUserType = User & {
  roles: PRole[];
};

@Injectable()
export class GqlRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  protected getUser(context: ExecutionContext): CustomUserType {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext().req.user;
  }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const user = this.getUser(context);

    const userData = user;

    const userIsBlocked = userData?.roles?.some(
      (db_role) => db_role.name === Role.BLOCKED,
    );

    if (userIsBlocked) {
      return false;
    }

    return requiredRoles.some((role) =>
      userData.roles.some((db_role) => db_role.name === role),
    );
  }
}
