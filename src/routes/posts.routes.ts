import { Router, Request, Response, NextFunction } from 'express';
import { nextTick } from 'process';
import { autoInjectable } from 'tsyringe';
import { validateInput } from '../middlewares/validate-input.middleware';
import { PostDto } from '../models/post.dto';
import { PostService } from '../services/post.service';

@autoInjectable()
export class PostsRoutes {
  private router: Router;

  constructor(private postService?: PostService) {
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

  private updatePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const updated = await this.postService?.update(
        req.params.id,
        res.locals.input
      );
      res.json(updated);
    } catch (err) {
      next(err);
    }
  };

  private deletePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.postService?.delete(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };

  getRouter() {
    return this.router;
  }
}
