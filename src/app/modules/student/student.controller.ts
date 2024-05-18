import { Request, Response } from "express";
import { studentServices } from "./student.service";

const createStudent = async (req: Request, res: Response) => {
    try {
        const student = req.body;
        const result = await studentServices.createStudentIntoDb(student)

        res.status(200).json({
            success: true,
            message: 'Student created successfully',
            data: result
        })
    } catch (error) {
        console.log(error)
    }
}

export const studentControllers = {
    createStudent
}