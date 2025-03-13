import express, { Request, Response } from 'express';
import pool from './db';

const app = express();
app.use(express.json());
app.get('/', async (req: Request, res: Response) => {
    try {
        // Teste simples para ver se o banco está respondendo
        const result = await pool.query('SELECT NOW() as agora');
        const dataHora = result.rows[0].agora;
        res.send(`Olá, mundo! O banco PostgreSQL respondeu: ${dataHora}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao conectar no banco');
    }
});

app.post('/signup', async (req: Request, res: Response) => {
    const client = await pool.connect();    
    try {
        const query = `INSERT INTO usuarios (email, password, username) VALUES ($1, $2, $3) RETURNING id`;
        const values = [req.body.email, req.body.password, req.body.username];
        const result = await client.query(query, values)
        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao conectar no banco');
    }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
