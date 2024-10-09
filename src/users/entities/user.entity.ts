import { Extensions, Field, Int, ObjectType } from '@nestjs/graphql';
import { User as DBUser, Role as DBRole, RolesEnum } from '@prisma/client';
import { Role as ERole } from 'src/roles/enums/role.enum';
import { checkRoleMiddleware } from 'src/roles/gql-role.middleware';
import { Exclude } from 'class-transformer';

@ObjectType()
export class Role implements DBRole {
  @Field()
  id: string;

  @Field(() => RolesEnum)
  name: RolesEnum;

  @Field({ nullable: true })
  description: string;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}

@ObjectType()
export class User implements DBUser {
  residence_number: string;
  city: string;
  credit_limit: number;
  credit: number;
  complement: string;

  value: number;

  code: string;

  associated_to: string;

  address: string;

  neighborhood: string;

  cep: string;

  uf: string;

  country: string;

  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  cel: string;

  @Field({ nullable: true })
  doccument: string;

  @Field({ middleware: [checkRoleMiddleware] })
  @Extensions({ role: ERole.ADMIN })
  @Exclude()
  password: string;

  @Field()
  created_at: Date;

  @Field()
  afiliado?: string;

  @Field()
  updated_at: Date;

  @Field(() => [Role], { nullable: true })
  roles?: Role[];
}

@ObjectType()
export class UserPage {
  @Field(() => Int)
  nextPage: number;

  @Field(() => [User])
  nodes: User[];
}
