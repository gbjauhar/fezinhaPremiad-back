import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CustomResponse {
  @Field()
  message: string;

  @Field()
  status: number;
}
