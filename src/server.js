import express from "express";
import connection from "./database/database.js";
import cors from 'cors';
import { categorieSchema } from "./models/categorieSchema.js";

const app = express();
app.use(express.json());
app.use(cors());

app.get('/categories', async (req,res) => {
    try{
        const categories = await connection.query("SELECT * FROM categories");
        res.send(categories.rows);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

app.post('/categories', async (req,res) => {
    try{
        const { error } = categorieSchema.validate(req.body, { abortEarly: false });
        if(error){
            const errors = error.details;
            const errorsTXT = errors.map(detail => detail.message);
            return res.status(400).send(errorsTXT);
        }
        
        const { name } = req.body;
        const isThereName = await connection.query(`SELECT * FROM categories WHERE name = '${name}'`);
        if(isThereName.rows[0] !== undefined)
            return res.sendStatus(409);

        await connection.query(`INSERT INTO categories (name) VALUES ('${name}')`);
        res.sendStatus(201);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

app.listen(4000, () => {
    console.log("Server running in port 4000");
});