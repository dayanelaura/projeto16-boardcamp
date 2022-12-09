import joi from 'joi';

export const categorieSchema = joi.object({
    name: joi.string().min(2).required()
});