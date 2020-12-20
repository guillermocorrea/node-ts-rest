import { User, UserDocument } from '../models/user';
import { UserAttrs } from '../models/user';
import { IUserService } from '../interfaces/user.service.interface';
import { BaseRepositoryService } from './base-repository.service';

export class UserService
  extends BaseRepositoryService<string, UserAttrs, UserDocument>
  implements IUserService {
  constructor() {
    super(User);
  }

  getById(id: string): Promise<UserAttrs> {
    return User.findById(id).populate('posts') as any;
  }
}
