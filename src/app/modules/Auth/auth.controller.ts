import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { catchAsync } from "../student/student.controller"
import { Request, Response } from "express";
import { AuthServices } from "./auth.service";

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthServices.loginUser(req.body)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Offered Course is created successfully !',
        data: result,
    });
})

export const AuthControllers = {
    loginUser
}