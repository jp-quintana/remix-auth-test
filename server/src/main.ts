import { Routes } from './routes';
import { Server } from './server';

const main = () => {
  new Server(3000, Routes.getRoutes()).start();
};

main();
