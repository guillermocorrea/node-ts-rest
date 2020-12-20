import { Router } from 'express';

class IndexRoutes {
  private router: Router;
  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get('/', (req, res) => res.send('Hello Index'));
  }

  getRouter() {
    return this.router;
  }
}

const indexRoutes = new IndexRoutes();

export default indexRoutes.getRouter();
