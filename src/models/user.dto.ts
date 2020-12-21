import { Expose } from 'class-transformer';
import { IsDefined, IsEmail } from 'class-validator';
import { UserAttrs } from './user';

export class UserDto implements UserAttrs {
  @IsDefined()
  @Expose()
  name!: string;
  @IsDefined()
  @Expose()
  @IsEmail()
  email!: string;
  @IsDefined()
  @Expose()
  password!: string;
  @IsDefined()
  @Expose()
  username!: string;
  @Expose()
  createdAt?: Date;
  @Expose()
  updatedAt?: Date;
}
