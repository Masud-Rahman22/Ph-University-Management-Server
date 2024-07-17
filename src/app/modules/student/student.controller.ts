import { NextFunction, Request, RequestHandler, Response } from 'express';
import { studentServices } from './student.service';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';

export const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err))
  }
}

const getAllStudents = catchAsync(async (req, res) => {
  const result = await studentServices.getAllStudents();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Students retrieved successfully',
    data: result
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
});
const getASingleStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await studentServices.getASingleStudent(studentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'A student is retrieved successfully',
    data: result
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
});

const updateStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const { student } = req.body;
  const result = await studentServices.updateStudentIntoDb(studentId, student);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is updated succesfully',
    data: result,
  });
});

const deleteASingleStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await studentServices.deleteASingleStudent(studentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Deleted a student successfully',
    data: result
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
});

export const studentControllers = {
  getAllStudents,
  getASingleStudent,
  deleteASingleStudent,
  updateStudent
};
