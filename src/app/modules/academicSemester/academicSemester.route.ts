import express from 'express';
import { academicSemesterControllers } from './academicSemester.controller';
import validateRequest from '../../middlewares/validateRequest';
import { academicSemesterValidations } from './academicSemester.validation';

const router = express.Router();

router.post('/create-academic-semester', validateRequest(academicSemesterValidations.createAcademicSemesterValidationSchema), academicSemesterControllers.createAcademicSemester)

// router.get('/', studentControllers.getAllStudents);
// router.get('/:studentId', studentControllers.getASingleStudent);
// router.delete('/:studentId', studentControllers.deleteASingleStudent);


export const academicSemesterRoutes = router;
