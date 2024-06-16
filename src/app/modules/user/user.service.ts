import config from "../../config";
import { Student } from "../student.model";
import { TStudent } from "../student/student.interface";
import { TUser } from "./user.interface";
import { User } from "./user.model";


const createUserIntoDb = async (password: string, studentData: TStudent) => {

    const userData: Partial<TUser> = {};

    userData.password = password || (config.default_password as string);

    userData.role = "student";

    //set manually generated id
    userData.id = '2030100001'

    //create a userData
    const newUser = await User.create(userData); // built in static method

    // create a student
    if (Object.keys(newUser).length) {
        studentData.id = newUser.id;
        studentData.user = newUser._id;
        const newStudent = await Student.create(studentData);
        return newStudent;
    }
};

export const userService = {
    createUserIntoDb
}