import { Post, PostModel } from './models/post';
import { PostService } from './services/post.service';
import { IPostService } from './interfaces/post.service.interface';
import { container } from 'tsyringe';

container.register<PostModel>('Post', { useValue: Post });
container.register<IPostService>(PostService, { useClass: PostService });
