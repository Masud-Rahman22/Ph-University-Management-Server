import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { catchAsync } from "../student/student.controller"
import { Request, Response } from "express";
import { AuthServices } from "./auth.service";
import config from "../../config";

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthServices.loginUser(req.body)
    const { refreshToken, accessToken, needsPasswordChange } = result;
    res.cookie('refreshToken', refreshToken, {
        secure: config.NODE_ENV === "production",
        httpOnly: true,
    })
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Logged in successfully !',
        data: {
            accessToken,
            needsPasswordChange
        },
    });
})

const changePassword = catchAsync(async (req: Request, res: Response) => {
    const { ...passwordData } = req.body;
    const result = await AuthServices.changePasswordIntoDB(req.user, passwordData)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'password changed successfully !',
        data: result,
    });
})

export const AuthControllers = {
    loginUser,
    changePassword
}