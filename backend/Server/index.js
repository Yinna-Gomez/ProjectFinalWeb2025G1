import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/ondas-col');

app.listen(3001, () => console.log('Servidor backend en puerto 3001'));