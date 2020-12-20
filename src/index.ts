import 'reflect-metadata';
require('dotenv').config();
import { Server } from './server';

const server = new Server();
server.start();
