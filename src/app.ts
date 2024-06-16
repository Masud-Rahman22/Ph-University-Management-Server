import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { studentRoutes } from './app/modules/student/student.route';
import { UserRoutes } from './app/modules/user/user.route';
const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/users', UserRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('app is running')
});
export default app;
// console.log(process.cwd())
