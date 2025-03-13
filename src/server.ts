
import express, { Request, Response } from 'express';
import router from './routes'; // Importa o 'router' configurado

const app = express();
app.use(express.json());


// Exemplo de rota inicial (apenas de teste)
app.get('/', (req: Request, res: Response) => {
  res.send('Olá, mundo!');
});

// Usa as rotas que foram definidas no router
app.use('/', router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
