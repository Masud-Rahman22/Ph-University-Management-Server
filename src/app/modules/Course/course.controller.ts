import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { CourseServices } from './course.service';

const createCourse = catchAsync(async (req: Request, res: Response) => {
    const result = await CourseServices.createCourseIntoDB(
        req.body,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course is created successfully',
        data: result,
    });
});

const getAllCourses = catchAsync(async (req: Request, res: Response) => {
    const result = await CourseServices.getAllCoursesFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Courses are retrieved successfully',
        data: result,
    });
});

const getASingleCourse = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
        await CourseServices.getASingleCourseFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course is retrieved successfully',
        data: result,
    });
});

const deleteACourse = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
        await CourseServices.deleteCourseFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course is deleted successfully',
        data: result,
    });
});

// const updateAcademicFaculty = catchAsync(async (req: Request, res: Response) => {
//     const { facultyId } = req.params;
//     const result = await AcademicFacultyServices.updateAcademicFacultyIntoDB(
//         facultyId,
//         req.body,
//     );
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Academic faculty is updated successfully',
//         data: result,
//     });
// });

export const AcademicFacultyControllers = {
    createCourse,
    getAllCourses,
    getASingleCourse,
    deleteACourse,
    // updateAcademicFaculty,
};