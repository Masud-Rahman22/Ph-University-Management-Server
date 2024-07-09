import express from 'express';
import { academicSemesterControllers } from './academicSemester.controller';

const router = express.Router();

router.post('/create-academic-semester', academicSemesterControllers.createAcademicSemester)

// router.get('/', studentControllers.getAllStudents);
// router.get('/:studentId', studentControllers.getASingleStudent);
// router.delete('/:studentId', studentControllers.deleteASingleStudent);


export const academicSemesterRoutes = router;
