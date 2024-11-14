import validations from "../model/validations.model.js";

export default class Validator {
  static validate = (constraints, body) => {
    for (let field in constraints) {
      // First check if field exists in body
      const fieldError = validations.checkFields(field, body);
      if (fieldError) {
        return fieldError;
      }

      const fieldValue = body[field];
      const fieldConstraints = constraints[field];

      for (let constraint of fieldConstraints) {
        const [validationType, ...args] = constraint.split(":");
        const validationFunc = validations[validationType];

        if (validationFunc) {
          const error = validationFunc(fieldValue, field, ...args);
          if (error) {
            return error;
          }
        }
      }
    }
    return null;
  };
}
