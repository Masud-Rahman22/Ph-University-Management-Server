import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { AcademicSemesterServices } from './academicSemester.service';
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';

const createAcademicSemester = catchAsync(async (req: Request, res: Response) => {
    const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(
        req.body,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic semester is created successfully',
        data: result,
    });
});

const getAllAcademicSemesters = catchAsync(async (req: Request, res: Response) => {
    const result = await AcademicSemesterServices.getAllAcademicSemestersFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic semesters are retrieved successfully',
        data: result,
    });
});

const getSingleAcademicSemester = catchAsync(async (req: Request, res: Response) => {
    const { semesterId } = req.params;
    const result =
        await AcademicSemesterServices.getSingleAcademicSemesterFromDB(semesterId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic semester is retrieved successfully',
        data: result,
    });
});

const updateAcademicSemester = catchAsync(async (req: Request, res: Response) => {
    const { semesterId } = req.params;
    const result = await AcademicSemesterServices.updateAcademicSemesterIntoDB(
        semesterId,
        req.body,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic semester is retrieved successfully',
        data: result,
    });
});

export const AcademicSemesterControllers = {
    createAcademicSemester,
    getAllAcademicSemesters,
    getSingleAcademicSemester,
    updateAcademicSemester,
};