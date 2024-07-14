import { RequestHandler } from "express";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { catchAsync } from "../student/student.controller";
import { UserServices } from "./user.service";


const createStudent: RequestHandler = catchAsync(async (req, res) => {
    const { password, student: studentData } = req.body;
    // const zodParseData = studentValidationSchema.parse(studentData)
    const result = await UserServices.createUserIntoDb(password, studentData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User created successfully',
        data: result
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
});
export const userControllers = {
    createStudent,
}