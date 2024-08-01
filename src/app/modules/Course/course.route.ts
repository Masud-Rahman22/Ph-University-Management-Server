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

router.patch(
    '/:id',
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
