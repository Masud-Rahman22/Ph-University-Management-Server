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
    id: { type: String, required: [true, 'Id is required'], unique: true },
    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'User id is required'],
        unique: true,
        ref: 'User'
    },

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

export const Student = model<TStudent, StudentModel>('Student', studentSchema);
