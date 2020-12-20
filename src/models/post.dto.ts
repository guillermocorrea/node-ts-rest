import { Expose } from 'class-transformer';
import { IsDefined } from 'class-validator';
import { PostAttrs } from './post';

export class PostDto implements PostAttrs {
  @IsDefined()
  @Expose()
  title!: string;
  @IsDefined()
  @Expose()
  url!: string;
  @IsDefined()
  @Expose()
  content!: string;
  @Expose()
  image?: string;
  @Expose()
  createdAt?: Date;
  @Expose()
  updatedAt?: Date;
}
