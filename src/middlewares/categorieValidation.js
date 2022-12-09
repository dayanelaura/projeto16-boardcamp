/* import connection from "../database/database.js";
import { categorieSchema } from "../models/categorieSchema.js";

export async function categorieValidation(req, res){
    const { name } = req.body;

    const { error } = categorieSchema.validate(req.body, { abortEarly: false });
    if(error){
        const errors = error.details;
        const errorsTXT = errors.map(detail => detail.message);
        return res.status(400).send(errorsTXT);
    }

    const isThereName = await connection.query(`SELECT * FROM categories WHERE name='${name}'`);
    if(isThereName)
        return res.sendStatus(409);
} */