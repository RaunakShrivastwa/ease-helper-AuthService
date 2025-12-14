import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { UserRole, statusType } from "../validators/roleType"; // adjust path as needed

export class UserValidators {
  // Define the Joi schema as a static property
  private static userSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(/^(?=.*[0-9])(?=.*[a-zA-Z]).{6,20}$/)
      .required()
      .messages({
        "string.pattern.base":
          "Password must be alphanumeric and contain at least one digit",
      }),
    phone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .messages({ "string.pattern.base": "Phone must be 10 digits" }),
    address: Joi.string().max(255).optional(),
    role: Joi.string()
      .valid(...Object.values(UserRole)) // Use enum values
      .default(UserRole.USER),
    status: Joi.string()
      .valid(...Object.values(statusType)) // Use enum values
      .default(statusType.ACTIVE),
  });

  // Middleware function
  static useValidators(req: Request,res: Response, next: NextFunction) {
    const { error, value } = UserValidators.userSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        msg: "Validation failed",
        errors: error.details.map((d) => d.message),
      });
    }

    req.body = value;
    next();
  }

}
