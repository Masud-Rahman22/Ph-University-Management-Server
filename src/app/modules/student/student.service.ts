import { Student } from '../student.model';

const getAllStudents = async () => {
  const result = await Student.find();
  return result;
};

const getASingleStudent = async (id: string) => {
  // const result = await Student.findOne({ id });
  const result = await Student.aggregate([{ $match: { id: id } }])
  return result;
};

const deleteASingleStudent = async (id: string) => {
  const result = await Student.updateOne({ id }, { isDeleted: true });
  return result;
};

export const studentServices = {
  getAllStudents,
  getASingleStudent,
  deleteASingleStudent
};
