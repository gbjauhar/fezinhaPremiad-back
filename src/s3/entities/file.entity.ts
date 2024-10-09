import { ObjectType, Field } from '@nestjs/graphql';
import { File as DBFile } from '@prisma/client';

@ObjectType()
export class File implements DBFile {
  @Field(() => String, { description: 'The id of the file' })
  id: string;

  @Field(() => String, { description: 'The url of the file' })
  file_url: string;

  @Field(() => String, { description: 'The key/name of the game' })
  file_key: string;

  @Field({ description: 'The creation date of the game' })
  created_at: Date;

  @Field({ description: 'The update date of the game' })
  updated_at: Date;
}
