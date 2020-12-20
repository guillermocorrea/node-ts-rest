import { Router, Request, Response, NextFunction } from 'express';
import { autoInjectable } from 'tsyringe';
import { validateInput } from '../middlewares/validate-input.middleware';
import { UserDto } from '../models/user.dto';
import { UserService } from '../services/user.service';

@autoInjectable()
class UsersRoutes {
  private router: Router;

  constructor(private usersService?: UserService) {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get('/', this.getUsers);
    this.router.get('/:id', this.getUser);
    this.router.post('/', validateInput<UserDto>(UserDto), this.createUsers);
    this.router.put('/:id', validateInput<UserDto>(UserDto), this.updateUsers);
    this.router.delete('/:id', this.deleteUsers);
  }

  private getUsers = async (_: Request, res: Response) => {
    const Users = await this.usersService?.getAll();
    res.json(Users);
  };

  private getUser = async (req: Request, res: Response) => {
    const User = await this.usersService?.getById(req.params.id);
    if (!User) {
      return res.status(404).send();
    }
    res.json(User);
  };

  private createUsers = async (
    _: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const createdUser = await this.usersService?.create(res.locals.input);
      res.status(201).json(createdUser);
    } catch (err) {
      next(err);
    }
  };

  private updateUsers = async (req: Request, res: Response) => {
    const updated = await this.usersService?.update(
      req.params.id,
      res.locals.input
    );
    res.json(updated);
  };

  private deleteUsers = async (req: Request, res: Response) => {
    await this.usersService?.delete(req.params.id);
    res.status(204).send();
  };

  getRouter() {
    return this.router;
  }
}

const usersRoutes = new UsersRoutes();

export default usersRoutes.getRouter();
