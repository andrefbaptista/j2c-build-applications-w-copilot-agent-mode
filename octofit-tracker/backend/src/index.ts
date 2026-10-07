import express from 'express';
import type { ErrorRequestHandler } from 'express';
import cors from 'cors';
import apiRouter from './routes/api.js';

const app = express();
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
app.use(apiRouter);

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  console.error('API request failed:', error);
  response.status(500).json({ error: 'Internal server error' });
};

app.use(errorHandler);

export default app;
