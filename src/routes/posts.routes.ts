import { Router, Request, Response, NextFunction } from 'express';
import { autoInjectable, inject, delay } from 'tsyringe';
import { validateInput } from '../middlewares/validate-input.middleware';
import { PostDto } from '../models/post.dto';
import { PostService } from '../services/post.service';

@autoInjectable()
class PostsRoutes {
  private router: Router;

  constructor(
    @inject(delay(() => PostService)) private postService?: PostService
  ) {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get('/', this.getPosts);
    this.router.get('/:id', this.getPost);
    this.router.post('/', validateInput<PostDto>(PostDto), this.createPost);
    this.router.put('/:id', validateInput<PostDto>(PostDto), this.updatePost);
    this.router.delete('/:id', this.deletePost);
  }

  private getPosts = async (req: Request, res: Response) => {
    const posts = await this.postService?.getAll();
    res.json(posts);
  };

  private getPost = async (req: Request, res: Response) => {
    const post = await this.postService?.getById(req.params.id);
    if (!post) {
      return res.status(404).send();
    }
    res.json(post);
  };

  private createPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const createdPost = await this.postService?.create(res.locals.input);
      res.status(201).json(createdPost);
    } catch (err) {
      next(err);
    }
  };

  private updatePost = async (req: Request, res: Response) => {
    const updated = await this.postService?.update(
      req.params.id,
      res.locals.input
    );
    res.json(updated);
  };

  private deletePost = async (req: Request, res: Response) => {
    await this.postService?.delete(req.params.id);
    res.status(204).send();
  };

  getRouter() {
    return this.router;
  }
}

const postsRoutes = new PostsRoutes();

export default postsRoutes.getRouter();
