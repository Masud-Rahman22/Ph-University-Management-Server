import mongoose from 'mongoose';
import { Student } from '../student.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { TStudent } from './student.interface';

const getAllStudents = async (query: Record<string, unknown>) => {
  const queryObj = { ...query };
  const studentSearchAbleFields = ['email', 'name.firstName', 'presentAddress']
  let searchTerm = ''
  if (query.searchTerm) {
    searchTerm = query?.searchTerm as string;
  }
  const searchQuery = Student.find(
    {
      $or: studentSearchAbleFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      }))
    }
  )
  const excludeFields = ['searchTerm', 'sort', 'limit']
  excludeFields.forEach((el) => delete queryObj[el])
  const filterQuery = searchQuery
    .find(queryObj)
    .populate('admissionSemester').populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty'
      }
    });

  let sort = '-createdAt'

  if (query.sort) {
    sort = query?.sort as string;
  }

  const sortQuery = filterQuery.sort(sort);

  let limit = 1;

  if (query.limit) {
    limit = query.limit as number;
  }

  const limitQuery = await sortQuery.limit(limit);

  return limitQuery;
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
