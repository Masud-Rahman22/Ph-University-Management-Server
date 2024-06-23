import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";


const createStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { password, student: studentData } = req.body;
        // const zodParseData = studentValidationSchema.parse(studentData)
        const result = await userService.createUserIntoDb(password, studentData);

        res.status(200).json({
            success: true,
            message: 'Student created successfully',
            data: result,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err) {
        next(err)
    }
};
export const userControllers = {
    createStudent,
}