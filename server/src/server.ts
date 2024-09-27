import express, { Router } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

export class Server {
  public readonly app = express();
  constructor(private readonly port: number, private readonly routes: Router) {}

  start() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());

    this.app.use(
      cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      })
    );

    this.app.use('/api', this.routes);

    this.app.listen(this.port, () =>
      console.log(`Listening on port ${this.port}`)
    );
  }
}
