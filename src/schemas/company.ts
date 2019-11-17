import Joi from 'joi';
import validationMiddleware from '../middleware/validationMiddleware';
import { Request, Response, NextFunction } from 'express';

const companyEntity = Joi.object({
  assignee_first_name: Joi.string(),
  assignee_first_seen_date: Joi.string(),
  assignee_id: Joi.string(),
  assignee_last_name: Joi.string(),
  assignee_last_seen_date: Joi.string(),
  assignee_lastknown_city: Joi.string(),
  assignee_lastknown_country: Joi.string(),
  assignee_lastknown_location_id: Joi.string(),
  assignee_lastknown_state: Joi.string(),
  assignee_organization: Joi.string(),
  assignee_total_num_patents: Joi.string(),
});

const schemaDefinition = Joi.object().pattern(Joi.string(), companyEntity);

const requestValidation = Joi.object({
  company: Joi.string().required(),
  page: Joi.number().required(),
}).required();

export const companySchemaDefinition = (req: Request, res: Response, next: NextFunction) => {
  validationMiddleware({
    query: requestValidation,
    options: {
      joiOptions: {
        abortEarly: false,
      },
    },
  })(req, res, next);
};
