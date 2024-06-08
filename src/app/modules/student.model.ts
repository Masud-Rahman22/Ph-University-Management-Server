import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
// import validator from 'validator';
import {
    StudentModel,
    TGuardian,
    TLocalGuardian,
    TStudent,
    TUserName,
} from './student/student.interface';
import config from '../config';

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
    id: { type: String, required: [true, 'Id is required'], unique: true },
    password: { type: String, required: [true, 'Id is required'], maxlength: [20, 'password can not exceed 20 characters'] },
    name: userNameSchema,
    gender: {
        type: String,
        enum: ['male', 'female', 'others'],
        required: true,
    },
    dateOfBirth: { type: String },
    email: { type: String, required: true, unique: true },
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
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    toJSON: {
        virtuals: true,
    }
});

// virtual

studentSchema.virtual('fullName').get(function () {
    return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`
})

// middleware for password hashing
studentSchema.pre('save', async function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this;
    user.password = await bcrypt.hash(user.password, Number(config.bcrypt_salt_rounds),)
    next();
})
studentSchema.post('save', async function (doc, next) {
    doc.password = ''
    next();
})

// Query middleware
studentSchema.pre('find', async function (next) {
    this.find({ isDeleted: { $ne: true } })
    next();
})
studentSchema.pre('findOne', async function (next) {
    this.find({ isDeleted: { $ne: true } })
    next();
})
studentSchema.pre('aggregate', async function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } })
    next();
})

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
