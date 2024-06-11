import { Schema, model } from "mongoose";
import { TUser } from "./user.interface";


const userSchema = new Schema<TUser>(
    {
        id: {
            type: String,
            required: true,
            // unique: true,
        },
        // email: {
        //     type: String,
        //     required: true,
        //     unique: true,
        // },
        password: {
            type: String,
            required: true,
            // select: 0,
        },
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

export const User = model<TUser>('User', userSchema)