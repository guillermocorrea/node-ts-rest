import { UserAttrs } from '../models/user';
import { IBaseRepositoryService } from './base-repository.service.interface';

export interface IUserService
  extends IBaseRepositoryService<string, UserAttrs> {}
