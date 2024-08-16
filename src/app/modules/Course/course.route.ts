import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidations } from './course.validation';
import { CourseControllers } from './course.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
    '/create-course',
    auth('admin'),
    validateRequest(
        CourseValidations.createCourseValidationSchema,
    ),
    CourseControllers.createCourse,
);

router.get(
    '/:id',
    auth('admin', 'faculty', 'student'),
    CourseControllers.getASingleCourse,
);

router.patch(
    '/:id',
    auth('admin'),
    validateRequest(
        CourseValidations.createCourseValidationSchema,
    ),
    CourseControllers.updateCourse
);

router.put(
    '/:courseId/assign-faculties',
    validateRequest(
        CourseValidations.facultiesWithCourseValidationSchema,
    ),
    CourseControllers.assignFacultiesWithCourse
)

router.delete(
    '/:courseId/remove-faculties',
    validateRequest(
        CourseValidations.facultiesWithCourseValidationSchema,
    ),
    CourseControllers.removeFacultiesWithCourse
)

router.delete('/:id', CourseControllers.deleteACourse);
router.get('/', CourseControllers.getAllCourses);


export const CourseRoutes = router;
