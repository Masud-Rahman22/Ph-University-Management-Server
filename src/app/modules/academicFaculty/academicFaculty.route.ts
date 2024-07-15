import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { academicFacultyValidation } from './academicFaculty.validate';
import { AcademicFacultyControllers } from './academicFaculty.controller';

const router = express.Router();

router.post(
    '/create-academic-faculty',
    validateRequest(
        academicFacultyValidation.createAcademicFacultyValidationSchema,
    ),
    AcademicFacultyControllers.createAcademicFaculty,
);

router.get(
    '/:facultyId',
    AcademicFacultyControllers.getSingleAcademicFaculty,
);

router.patch(
    '/:facultyId',
    validateRequest(
        academicFacultyValidation.updateAcademicFacultyValidationSchema,
    ),
    AcademicFacultyControllers.updateAcademicFaculty,
);

router.get('/', AcademicFacultyControllers.getAllAcademicFaculties);


export const academicFacultyRoutes = router;
