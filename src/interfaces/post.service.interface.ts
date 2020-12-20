import { PostAttrs } from '../models/post';
import { IBaseRepositoryService } from './base-repository.service.interface';

export interface IPostService
  extends IBaseRepositoryService<string, PostAttrs> {}
