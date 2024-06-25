import { NextFunction, Request, Response } from 'express';
import { studentServices } from './student.service';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';

const getAllStudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await studentServices.getAllStudents();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All Students retrieved successfully',
      data: result
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err) {
    next(err)
  }
};
const getASingleStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId } = req.params;
    const result = await studentServices.getASingleStudent(studentId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'A student is retrieved successfully',
      data: result
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err) {
    next(err)
  }
};
const deleteASingleStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId } = req.params;
    const result = await studentServices.deleteASingleStudent(studentId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Deleted a student successfully',
      data: result
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err) {
    next(err);
  }
};

export const studentControllers = {
  getAllStudents,
  getASingleStudent,
  deleteASingleStudent
};
