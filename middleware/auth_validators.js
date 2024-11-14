import ErrorResponse from "../model/error.model.js";
import Validator from "../util/validator.js";

export const loginConstraints = {
  username: ["required", "email"],
  password: ["required", "minLength:8"],
};

export const registerConstraints = {
  username: ["required", "email"],
  password: ["required", "minLength:8"],
  age: ["required", "minValue:18"],
};
 
export function authValidator (authConstraints)  { return (req, res, next) => {
  let error = Validator.validate(loginConstraints, req.body);
  if (error) {
    return next(new ErrorResponse(error, 401));
  }
  next();
}}

