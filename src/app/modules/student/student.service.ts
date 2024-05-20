import { Student } from '../student.model';
import { TStudent } from './student.interface';

const createStudentIntoDb = async (studentData: TStudent) => {

  if (await Student.isUserExists(studentData.id)) {
    throw new Error(`Student is already exists`);
  }

  const result = await Student.create(studentData); // built in static method

  // const student = new Student(studentData)

  // if (await student.isUserExists(studentData.id)) {
  //   throw new Error(`Student is already exists`);
  // }

  // const result = student.save(); // built in instance method

  return result;
};

const getAllStudents = async () => {
  const result = await Student.find();
  return result;
};

const getASingleStudent = async (id: string) => {
  const result = await Student.findOne({ id });
  return result;
};

export const studentServices = {
  createStudentIntoDb,
  getAllStudents,
  getASingleStudent,
};
