import { ForbiddenException } from '@nestjs/common';
import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';
import { Role as DBRole, User } from '@prisma/client';

type ContextType = {
  req: {
    user: User & {
      roles: DBRole[];
    };
  };
};

export const checkRoleMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext<any, ContextType>,
  next: NextFn,
) => {
  const { info, context } = ctx;
  const { extensions } = info.parentType.getFields()[info.fieldName];

  /**
   * In a real-world application, the "userRole" variable
   * should represent the caller's (user) role (for example, "ctx.user.role").
   */
  const userRole = context?.req?.user?.roles?.some(
    (role) => role.name === extensions.role,
  );
  if (!userRole) {
    // or just "return null" to ignore
    throw new ForbiddenException(
      `User does not have sufficient permissions to access "${info.fieldName}" field.`,
    );
  }
  return next();
};
