import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidations } from './course.validation';
import { CourseControllers } from './course.controller';

const router = express.Router();

router.post(
    '/create-course',
    validateRequest(
        CourseValidations.createCourseValidationSchema,
    ),
    CourseControllers.createCourse,
);

router.get(
    '/:id',
    CourseControllers.getASingleCourse,
);

// router.patch(
//     '/:facultyId',
//     validateRequest(
//         CourseValidations.createCourseValidationSchema,
//     ),
//     CourseControllers.updateAcademicFaculty,
// );

router.delete('/:id', CourseControllers.deleteACourse);
router.get('/', CourseControllers.getAllCourses);


export const CourseRoutes = router;
