import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import routes from './routes/index.js';

const app = express()
const port = 3000

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log('Message Received:', req.method, req.url);
  console.log(new Date(Date.now()).toString());
  next();
});

app.use(routes);

app.use((req: Request, res: Response, next: NextFunction) => {
	res.status(500).send('Not Found');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})