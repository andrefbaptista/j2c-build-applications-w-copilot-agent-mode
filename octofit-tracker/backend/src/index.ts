import express from 'express';
import type { ErrorRequestHandler } from 'express';
import cors from 'cors';
import { connectDatabase } from './config/database.js';
import apiRouter from './routes/api.js';

const app = express();
const port = Number(process.env.PORT) || 8000;
const frontendOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];

if (process.env.CODESPACE_NAME) {
  frontendOrigins.push(
    `https://${process.env.CODESPACE_NAME}-5173.app.github.dev`,
  );
}

app.use(cors({ origin: frontendOrigins }));
app.use(express.json());
app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});
app.use('/api', apiRouter);

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  console.error('API request failed:', error);
  response.status(500).json({ error: 'Internal server error' });
};

app.use(errorHandler);

async function startServer() {
  try {
    await connectDatabase();
    app.listen(port, () => {
      console.log(`OctoFit API listening on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to start OctoFit API:', error);
    process.exitCode = 1;
  }
}

void startServer();
