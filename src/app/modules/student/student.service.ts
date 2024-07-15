import mongoose from 'mongoose';
import { Student } from '../student.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';

const getAllStudents = async () => {
  const result = await Student.find().populate('admissionSemester').populate({
    path: 'academicDepartment',
    populate: {
      path: 'academicFaculty'
    }
  });
  return result;
};

const getASingleStudent = async (id: string) => {
  // const result = await Student.findOne({ id });
  const result = await Student.aggregate([{ $match: { id: id } }])
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
  }
};

export const studentServices = {
  getAllStudents,
  getASingleStudent,
  deleteASingleStudent
};
