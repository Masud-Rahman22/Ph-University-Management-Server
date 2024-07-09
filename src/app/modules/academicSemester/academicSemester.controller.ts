import { RequestHandler } from "express";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { catchAsync } from "../student/student.controller";
import { academicSemesterServices } from "./academicSemester.service";


const createAcademicSemester: RequestHandler = catchAsync(async (req, res) => {
    const result = await academicSemesterServices.createAcademicSemesterIntoDb(req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic semester is created successfully',
        data: result
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
});
export const academicSemesterControllers = {
    createAcademicSemester,
}