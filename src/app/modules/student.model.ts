import { Schema, model } from 'mongoose';
// import validator from 'validator';
import {
    StudentModel,
    TGuardian,
    TLocalGuardian,
    TStudent,
    TUserName,
} from './student/student.interface';

const userNameSchema = new Schema<TUserName>({
    firstName: {
        type: String,
        required: true,
        // validate: {
        //     validator: (value: string) => validator.isAlpha(value),
        //     message: "{VALUE} is not a valid name"
        // }
    },
    middleName: {
        type: String,
    },
    lastName: {
        type: String,
        required: true,
    },
});

const guardianSchema = new Schema<TGuardian>({
    fatherName: {
        type: String,
        required: true,
    },
    fatherOccupation: {
        type: String,
        required: true,
    },
    fatherContactNo: {
        type: String,
        required: true,
    },
    motherName: {
        type: String,
        required: true,
    },
    motherOccupation: {
        type: String,
        required: true,
    },
    motherContactNo: {
        type: String,
        required: true,
    },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
    name: {
        type: String,
        required: true,
    },
    occupation: {
        type: String,
        required: true,
    },
    contactNo: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
});

const studentSchema = new Schema<TStudent, StudentModel>({
    id: { type: String },
    name: userNameSchema,
    gender: {
        type: String,
        enum: ['male', 'female', 'others'],
        required: true,
    },
    dateOfBirth: { type: String },
    email: { type: String, required: true },
    contactNo: { type: String, required: true },
    emergencyContactNo: { type: String, required: true },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    guardian: guardianSchema,
    localGuardian: localGuardianSchema,
    profileImg: { type: String },
    isActive: {
        type: String,
        enum: ['active', 'blocked'],
        default: 'active'
    },
});

// for static

studentSchema.statics.isUserExists = async function (id: string) {
    const existingUser = await Student.findOne({ id })
    return existingUser;
}

// for instance
// studentSchema.methods.isUserExists = async function (id: string) {
//     const existingUser = await Student.findOne({ id })
//     return existingUser;
// }

export const Student = model<TStudent, StudentModel>('Student', studentSchema);
