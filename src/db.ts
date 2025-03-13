import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,           // "db" dentro do docker-compose
  user: process.env.DB_USER,           // "meu_usuario"
  password: process.env.DB_PASSWORD,   // "minha_senha"
  database: process.env.DB_NAME,       // "meu_banco"
  port: Number(process.env.DB_PORT) || 5432
});

export default pool;
