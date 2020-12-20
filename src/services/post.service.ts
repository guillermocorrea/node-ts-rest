import { Post, PostDocument } from './../models/post';
import { PostAttrs } from '../models/post';
import { IPostService } from './../interfaces/post.service.interface';
import { BaseRepositoryService } from './base-repository.service';
import { singleton } from 'tsyringe';

@singleton()
export class PostService
  extends BaseRepositoryService<string, PostAttrs, PostDocument>
  implements IPostService {
  constructor() {
    super(Post);
  }
}
