import express from 'express';
import bodyParser from 'body-parser';

class Application {
  private readonly app: express.Application;
  constructor() {
    this.app = express();
  }
  start() {
    this.configureMiddleware();
    this.routeInit();
    return this.app;
  }
  configureMiddleware() {
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
  }
  routeInit() {
    this.app.get('/api/v1/test', (req, res) => {
      res.json({ ok: true });
    });
  }
}

export default Application;
