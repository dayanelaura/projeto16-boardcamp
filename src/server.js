import express from "express";
import connection from "./database/database.js";
import cors from 'cors';
import { categorieSchema } from "./models/categorieSchema.js";
import { gameSchema } from "./models/gameSchema.js";
import dayjs from "dayjs";
import { customerSchema } from "./models/customerSchema.js";

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

app.get('/games', async (req,res) => {
    try{
        let { name } = req.query;
        let games;

        if(name){
            games = await connection.query(`
                SELECT games.*, categories.name AS "categoryName" 
                FROM games JOIN categories 
                ON games."categoryId" = categories.id
                WHERE UPPER(games.name) LIKE '${name.toUpperCase()}%'
        `);
        }else{
            games = await connection.query(`
                SELECT games.*, categories.name AS "categoryName" 
                FROM games JOIN categories 
                ON games."categoryId" = categories.id
            `);
        }

        res.send(games.rows);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

app.post('/games', async (req,res) => {
    try{
        const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
        
        const { error } = gameSchema.validate(req.body, { abortEarly: false });
        if(error){
            const errors = error.details;
            const errorsTXT = errors.map(detail => detail.message);
            return res.status(400).send(errorsTXT);
        }
    
        const isThereId = await connection.query(`SELECT * FROM categories WHERE id='${categoryId}'`);
        if(isThereId.rows[0] === undefined)
            return res.sendStatus(400);
    
        const isThereName = await connection.query(`SELECT * FROM games WHERE name='${name}'`);
        if(isThereName.rows[0] !== undefined)
            return res.sendStatus(409);
        
        await connection.query(`
            INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") 
            VALUES ('${name}', '${image}', ${stockTotal}, ${categoryId}, ${pricePerDay}) 
        `);
        res.sendStatus(201);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

app.get('/customers', async (req,res) => {
    try {
        let { cpf } = req.query;
        let customers;

        if(cpf)
            customers = await connection.query(`SELECT * FROM customers WHERE UPPER(customers.cpf) LIKE '${cpf.toUpperCase()}%'`);
        else
            customers = await connection.query(`SELECT * FROM customers`);

        res.send(customers.rows);
    } catch(err){
        console.log(err);
        sendStatus(500);
    }
});

app.get('/customers/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const customer = await connection.query(`SELECT * FROM customers WHERE id=${id}`);
        
        if(customer.rows[0] === undefined)
            return res.sendStatus(404);

        res.send(customer);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

app.post('/customers', async (req, res) => {
    try{
        const { name, phone, cpf, birthday } = req.body;

        const { error } = customerSchema.validate(req.body, { abortEarly: false });
        if(error){
            const errors = error.details;
            const errorsTXT = errors.map(detail => detail.message);
            return res.status(400).send(errorsTXT);
        }
        
        if(isNaN(cpf) || isNaN(phone))
            return res.sendStatus(400);

        const birthdayValidation = dayjs(birthday).format('YYYY-MM-DD');
        if(!birthdayValidation || birthdayValidation !== birthday)
            return res.sendStatus(400);

        const isThereCpf = await connection.query(`SELECT * FROM customers WHERE cpf='${cpf}'`);
        if(isThereCpf.rows[0] !== undefined)
            return res.sendStatus(409);

        connection.query(`
            INSERT INTO customers (name, phone, cpf, birthday)
            VALUES ('${name}', '${phone}', '${cpf}', '${birthday}')
        `);

        res.sendStatus(201);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

app.listen(4000, () => {
    console.log("Server running in port 4000");
});