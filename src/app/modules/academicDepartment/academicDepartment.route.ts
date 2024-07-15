import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentControllers } from './academicDepartment.controller';
import { academicDepartmentValidation } from './academicDepartment.validation';

const router = express.Router();

router.post(
    '/create-academic-department',
    validateRequest(
        academicDepartmentValidation.createAcademicDepartmentValidationSchema,
    ),
    AcademicDepartmentControllers.createAcademicDepartment,
);

router.get(
    '/:departmentId',
    AcademicDepartmentControllers.getSingleAcademicDepartment,
);

router.patch(
    '/:departmentId',
    validateRequest(
        academicDepartmentValidation.updateAcademicDepartmentValidationSchema,
    ),
    AcademicDepartmentControllers.updateAcademicDepartment,
);

router.get('/', AcademicDepartmentControllers.getAllAcademicDepartments);


export const academicDepartmentRoutes = router;
