/* import connection from "../database/database.js";
import { gameSchema } from "../models/gameSchema.js";

export async function gameValidation(req, res){
    const { name, categoryId } = req.body;

    const { error } = gameSchema.validate(req.body, { abortEarly: false });
    if(error){
        const errors = error.details;
        const errorsTXT = errors.map(detail => detail.message);
        return res.status(400).send(errorsTXT);
    }

    const isThereId = await connection.query(`SELECT * FROM categories WHERE id='${categoryId}'`);
    if(!isThereId)
        return res.sendStatus(400);

    const isThereName = await connection.query(`SELECT * FROM games WHERE name='${name}'`);
    if(isThereName)
        return res.sendStatus(409);
} */