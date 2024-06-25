import { RequestHandler } from "express";
import { userService } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";


const createStudent: RequestHandler = async (req, res, next) => {
    try {
        const { password, student: studentData } = req.body;
        // const zodParseData = studentValidationSchema.parse(studentData)
        const result = await userService.createUserIntoDb(password, studentData);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'User created successfully',
            data: result
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err) {
        next(err)
    }
};
export const userControllers = {
    createStudent,
}