// import { Request, Response, NextFunction } from 'express';
// import * as Joi from 'joi';
// // import {SchemaDefinitions} from '../schemas'
// import asyncMiddleware from './asyncMiddleware';
// import { JoiError } from './errorHandler';
// // import {Schema} from 'types-joi'
// type Fields = 'body' | 'params' | 'query';
// const validationMiddleware = (schema: any) =>
//   asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
//     // const validations = fields.map(field => {
//     //   return Joi.validate(schema, req[field]);
//     // });
//     // const validationResult = await Promise.all(validations);
//     // console.log(validationResult);
//     const validationResult = await Joi.validate(req.query, schema).catch(e => {
//       throw new JoiError(e);
//     });
//     next();

//     // return Joi.validate(req.query, schema)
//     //   .then(result => {
//     //     console.log({ result });
//     //     next();
//     //   })
//     //   .catch(err => {
//     //     throw new JoiError(err);
//     //   });
//   });

// export default validationMiddleware;
import * as joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export interface Validation {
  options?: ValidationOptions;
  body?: joi.SchemaLike;
  headers?: joi.SchemaLike;
  query?: joi.SchemaLike;
  cookies?: joi.SchemaLike;
  params?: joi.SchemaLike;
}

export interface ValidationOptions {
  allowUnknownBody?: boolean;
  allowUnknownQuery?: boolean;
  allowUnknownHeaders?: boolean;
  allowUnknownParams?: boolean;
  allowUnknownCookies?: boolean;
  joiOptions?: joi.ValidationOptions;
  [key: string]: any;
}
type PFields = 'body' | 'query' | 'headers' | 'params' | 'cookies';
const props: PFields[] = ['body', 'query', 'headers', 'params', 'cookies'];

export const validate = (settings: Validation) => {
  let errors: any = [];
  settings.options = settings.options || {};

  return (req: Request, res: Response, next: NextFunction) => {
    for (const p of props) {
      if (settings.hasOwnProperty(p)) {
        const options = settings.options.hasOwnProperty('joiOptions') ? settings.options.joiOptions : {};
        const name = `allowUnknown${p[0].toUpperCase()}${p.slice(1)}`;

        options.allowUnknown = settings.options.hasOwnProperty(name) ? settings.options[name] : true;

        const result = joi.validate(req[p], settings[p], options);

        if (result.hasOwnProperty('error') && result.error) {
          errors = errors.concat(result.error.details);
        }
      }
    }

    if (errors.length) {
      return next({
        isJoi: true,
        errors: errors,
      });
    }

    next();
  };
};

export default validate;
