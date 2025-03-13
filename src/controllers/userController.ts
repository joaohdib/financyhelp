import { Request, Response } from 'express';
import pool from '../db/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

const saltRounds = 10; 

async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

async function jwtToken() {
    const token = jwt.sign({}, JWT_SECRET, { expiresIn: 1, algorithm: "HS256"});
    return token;
}

export const signUp = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const query = `INSERT INTO usuarios (email, password, username) VALUES ($1, $2, $3) RETURNING id`;
    const values = [req.body.email, req.body.password, hashPassword(req.body.username)];

    const result = await client.query(query, values);
    res.status(201).json({ 
      message: 'Usuário criado com sucesso!', 
      userId: result.rows[0].id 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  } finally {
    client.release(); 
  }
};

export const login = async (req: Request, res: Response) => {
    const client = await pool.connect();
    try {
      const query = `SELECT * from usuarios WHERE username LIKE '${req.body.username}'`;
      const result = await client.query(query);
      if (result.rowCount != 0) {
        let comparandoSenha = await bcrypt.compare(req.body.password,result.rows[0].password);
        if (comparandoSenha) {
            res.status(200).json({token: jwtToken()});
        }
        else {
            res.status(401);
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao criar usuário' });
    } finally {
      client.release(); 
    }
  };