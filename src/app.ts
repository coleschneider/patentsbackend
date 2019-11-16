import express from 'express';
import bodyParser from 'body-parser';
import apiRoutes from './routes';
import errorHandler from './middleware/errorHandler';

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
    this.app.use(function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
  }
  routeInit() {
    this.app.use('/api', apiRoutes);
    this.app.use(errorHandler);
  }
}

export default Application;
