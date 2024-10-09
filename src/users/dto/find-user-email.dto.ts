import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class FindUserByEmailInput {
  @Field()
  email: string;

  @Field(() => Int, { nullable: true })
  page?: number;
}
