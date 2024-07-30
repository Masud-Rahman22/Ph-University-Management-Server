import express from 'express';
import { studentControllers } from './student.controller';

const router = express.Router();

router.get('/', studentControllers.getAllStudents);
router.get('/:id', studentControllers.getASingleStudent);
router.patch('/:id', studentControllers.updateStudent);
router.delete('/:id', studentControllers.deleteASingleStudent);
export const studentRoutes = router;
