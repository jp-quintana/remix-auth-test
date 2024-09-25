import { Routes } from './routes';
import { Server } from './server';
import dotenv from 'dotenv';

dotenv.config();

const main = () => {
  new Server(3000, Routes.getRoutes()).start();
};

main();
