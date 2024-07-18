import mongoose from 'mongoose';
import { Student } from '../student.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { TStudent } from './student.interface';

const getAllStudents = async (query: Record<string, unknown>) => {
  let searchTerm = ''
  if (query.searchTerm) {
    searchTerm = query?.searchTerm as string;
  }
  const result = await Student.find(
    {
      $or: ['email', 'name.firstName', 'presentAddress'].map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      }))
    }
  ).populate('admissionSemester').populate({
    path: 'academicDepartment',
    populate: {
      path: 'academicFaculty'
    }
  });
  return result;
};

const getASingleStudent = async (id: string) => {
  const result = await Student.findOne({ id })
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty'
      }
    })
  return result;
};

const updateStudentIntoDb = async (id: string, payload: Partial<TStudent> = {}) => {
  const { name, guardian, localGuardian, ...remainingData } = payload;
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingData
  }

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }
  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }

  const result = await Student.findOneAndUpdate({ id }, modifiedUpdatedData, {
    new: true, runValidators: true
  })
  return result;
};

const deleteASingleStudent = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction()

    const deletedStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete a student')
    }

    const deletedUser = await User.findOneAndUpdate({ id }, { isDeleted: true }, { new: true, session })

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete a user')
    }
    await session.commitTransaction()
    await session.endSession()
    return deletedStudent;
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete a student')
  }
};

export const studentServices = {
  getAllStudents,
  getASingleStudent,
  deleteASingleStudent,
  updateStudentIntoDb
};
