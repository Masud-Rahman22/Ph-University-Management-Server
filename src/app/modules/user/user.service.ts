import { object } from "joi";
import config from "../../config";
import { TStudent } from "../student/student.interface";
import { NewUser } from "./user.interface";
import { User } from "./user.model";


const createUserIntoDb = async (password: string, studentData: TStudent) => {

    // if (await Student.isUserExists(studentData.id)) {
    //     throw new Error(`Student is already exists`);
    // }

    const user: NewUser = {};

    user.password = password || (config.default_password as string);

    user.role = "student";

    //set manually generated id
    user.id = '2030100001'

    //create a user
    const result = await User.create(user); // built in static method

    // create a student
    if (Object.keys(result).length) {
        studentData.id = result.id;
        studentData.user = result._id;
    }

    // const student = new Student(studentData)

    // if (await student.isUserExists(studentData.id)) {
    //   throw new Error(`Student is already exists`);
    // }

    // const result = student.save(); // built in instance method

    return result;
};

export const userService = {
    createUserIntoDb
}