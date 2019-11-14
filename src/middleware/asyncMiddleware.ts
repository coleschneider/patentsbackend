import { Request, Response, NextFunction } from 'express';
type ReqHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

type AssyncFn = (fn: ReqHandler) => (req: Request, res: Response, next: NextFunction) => void;

const asyncMiddleware: AssyncFn = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncMiddleware;
