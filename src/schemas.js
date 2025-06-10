import Joi from 'joi';

export const createUserSchema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required()
});

export const loginSchema = Joi.object({
   email: Joi.string().email(),
   username: Joi.string(),
   password: Joi.string().required()
}).or('email', 'username');

export const updatePasswordSchema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required()
});

export const createPostSchema = Joi.object({
  content: Joi.string()
    .required()
    .custom((value, helpers) => {
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount >= 200) {
        return helpers.message('Content must be less than 200 words');
      }
      return value;
    }),
  mediaUrl: Joi.string().uri().optional()
});