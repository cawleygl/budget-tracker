import express, { type Request, type Response }  from 'express';
import { budgetRoutes } from './budgetRoutes.ts';

export const router = express.Router();

/* GET home page. */
router.get('/', function(req: Request, res: Response) {
  res.render('home', {message: 'World'});
});

router.use("/budgets", budgetRoutes);

