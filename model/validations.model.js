const validations = {
  // Check if the field from constraints exists in the body
  checkFields: (constraintField, body) => {
    if (!(constraintField in body)) {
      return `Missing field: ${constraintField}`;
    }
  },

  // Required field validation
  required: (value, field) => {
    if (!value || value.toString().trim() === "") {
      return `${field} is required.`;
    }
  },

  // Min length validation
  minLength: (value, field, length) => {
    if (value && value.length < length) {
      return `${field} must be at least ${length} characters long.`;
    }
  },

  // Email validation using regular expression
  email: (value, field) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (value && !emailPattern.test(value)) {
      return `${field} is not a valid email address.`;
    }
  },

  minValue: (value, field, args) => {
    if (value && value < args) {
      return `${field} must be at least ${args}`;
    }
  },
};

export default validations;
