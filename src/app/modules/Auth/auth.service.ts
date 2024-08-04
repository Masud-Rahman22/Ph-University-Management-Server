import httpStatus from "http-status"
import AppError from "../../errors/AppError"
import { User } from "../user/user.model"
import { TLoginUser } from "./auth.interface"
import bcrypt from 'bcrypt';
const loginUser = async (payload: TLoginUser) => {
    const doesUserExist = await User.findOne({ id: payload?.id })
    if (!doesUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'this user is not found!')
    }

    const isDeleted = doesUserExist?.isDeleted;

    if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'this user is deleted!')
    }

    const userStatus = doesUserExist?.status;

    if (userStatus) {
        throw new AppError(httpStatus.FORBIDDEN, 'this user is blocked!')
    }

    const isPasswordMatched = await bcrypt.compare(payload?.password,
        doesUserExist?.password
    )
    console.log(isPasswordMatched)
    return {};
}

export const AuthServices = {
    loginUser
}