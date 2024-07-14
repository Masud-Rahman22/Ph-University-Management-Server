import { Schema, model } from "mongoose";
import { TUser } from "./user.interface";
import config from "../../config";
import bcrypt from 'bcrypt';

const userSchema = new Schema<TUser>(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        // email: {
        //     type: String,
        //     required: true,
        //     unique: true,
        // },
        password: { type: String, required: [true, 'Id is required'], maxLength: [20, 'password can not exceed 20 characters'] },
        needsPasswordChange: {
            type: Boolean,
            default: true,
        },
        // passwordChangedAt: {
        //     type: Date,
        // },
        role: {
            type: String,
            enum: ['superAdmin', 'student', 'faculty', 'admin'],
        },
        status: {
            type: String,
            enum: ['in-progress', 'blocked'],
            default: 'in-progress',
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

// middleware for password hashing
userSchema.pre('save', async function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this;
    user.password = await bcrypt.hash(user.password, Number(config.bcrypt_salt_rounds),)
    next();
})
userSchema.post('save', async function (doc, next) {
    doc.password = ''
    next();
})


export const User = model<TUser>('User', userSchema)