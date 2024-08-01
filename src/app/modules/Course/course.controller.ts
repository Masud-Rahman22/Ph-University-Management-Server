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
    const result = await CourseServices.getAllCoursesFromDB(req.query);

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

const assignFacultiesWithCourse = catchAsync(async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const { faculties } = req.body;
    const result =
        await CourseServices.assignFacultiesWithCourseIntoDB(courseId, faculties);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculties assigned successfully',
        data: result,
    });
});

const removeFacultiesWithCourse = catchAsync(async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const { faculties } = req.body;
    const result =
        await CourseServices.removeFacultiesWithCourseIntoDB(courseId, faculties);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Faculties removed successfully',
        data: result,
    });
});

const updateCourse = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await CourseServices.updateCourseIntoDB(
        id,
        req.body,
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course is updated successfully',
        data: result,
    });
});

export const CourseControllers = {
    createCourse,
    getAllCourses,
    getASingleCourse,
    deleteACourse,
    updateCourse,
    assignFacultiesWithCourse,
    removeFacultiesWithCourse
};