import { loggerFormat } from './middlewares/logger.middleware';
import express from 'express';
import morgan from 'morgan';
import helment from 'helmet';
import indexRoutes from './routes/index.routes';
import compression from 'compression';
import cors from 'cors';
import { PostsRoutes } from './routes/posts.routes';
import addRequestId from 'express-request-id';
import { errorHandler } from './middlewares/error-handler.middleware';
import usersRoutes from './routes/users.routes';
import './database';
import './di.container';
import { environment } from './environment';
import { createTerminus } from '@godaddy/terminus';
import mongoose from 'mongoose';
import http from 'http';

export class Server {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  private async onSignal() {
    console.log('server is starting cleanup');
    await mongoose.disconnect();
    console.log('MongoDB Disconnected!');
  }

  private async onHealthCheck() {
    // checks if the system is healthy, like the db connection is live
    // resolves, if health, rejects if not
    return mongoose.connection.readyState === 1;
  }

  private async config() {
    // Settings
    this.app.set('port', process.env.PORT || 3000);
    // Middlewares
    if (!environment.isTestEnvironment) {
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
    }
    this.app.use(addRequestId());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(helment());
    this.app.use(compression());
    this.app.use(cors());
  }

  private routes() {
    this.app.use('/', indexRoutes);
    this.app.use('/api/posts', new PostsRoutes().getRouter());
    this.app.use('/api/users', usersRoutes);
    this.app.use(errorHandler);
  }

  async start() {
    const server = http.createServer(this.app);
    createTerminus(server, {
      signal: 'SIGINT',
      healthChecks: { '/healthcheck': this.onHealthCheck },
      onSignal: this.onSignal,
    });
    server.listen(this.app.get('port'), () => {
      console.log('Listening on port', this.app.get('port'));
    });
  }

  getApp() {
    return this.app;
  }
}
