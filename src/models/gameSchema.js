import joi from 'joi';

export const gameSchema = joi.object({
    name: joi.string().min(1).required(),
    image: joi.string(),
    stockTotal: joi.number().positive().required(),
    categoryId: joi.number(),
    pricePerDay: joi.number().positive().required(),
});