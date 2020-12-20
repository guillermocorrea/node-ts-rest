require('dotenv').config();
import { Server } from './server';
import './database';

const server = new Server();
server.start();
