import { loggerFormat } from './middlewares/logger.middleware';
import 'reflect-metadata';
import express from 'express';
import morgan from 'morgan';
import helment from 'helmet';
import indexRoutes from './routes/index.routes';
import compression from 'compression';
import cors from 'cors';
import postsRoutes from './routes/posts.routes';
import './di.container';
import addRequestId from 'express-request-id';
import { errorHandler } from './middlewares/error-handler.middleware';
import usersRoutes from './routes/users.routes';

export class Server {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  private config() {
    // Settings
    this.app.set('port', process.env.PORT || 3000);
    // Middlewares
    this.app.use(
      morgan(loggerFormat, {
        skip: (req, res) => {
          return res.statusCode < 400;
        },
        stream: process.stderr,
      })
    );
    this.app.use(
      morgan(loggerFormat, {
        skip: (req, res) => {
          return res.statusCode >= 400;
        },
        stream: process.stdout,
      })
    );
    this.app.use(addRequestId());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(helment());
    this.app.use(compression());
    this.app.use(cors());
  }

  private routes() {
    this.app.use('/', indexRoutes);
    this.app.use('/api/posts', postsRoutes);
    this.app.use('/api/users', usersRoutes);
    this.app.use(errorHandler);
  }

  start() {
    this.app.listen(this.app.get('port'), () => {
      console.log('Listening on port', this.app.get('port'));
    });
  }
}
