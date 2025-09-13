import Joi from "joi";

const loginValidator = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: { allow: false } })
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .min(5)
    .max(100)
    .required()
    .messages({
      "string.email": "Must be a valid email address",
      "string.pattern.base": "Email format is invalid",
      "string.min": "Email must be at least 5 characters",
      "string.max": "Email cannot exceed 100 characters",
      "any.required": "Email is required",
    }),

  password: Joi.string().trim().min(8).required().messages({
    "string.min": "Minimum length is 8 characters",
    "string.empty": "The Password field cannot be empty",
    "any.required": "The Password field is required",
  }),
});

export default loginValidator;
