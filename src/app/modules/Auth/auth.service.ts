import httpStatus from "http-status"
import AppError from "../../errors/AppError"
import { User } from "../user/user.model"
import { TLoginUser } from "./auth.interface"
// import bcrypt from 'bcrypt';
const loginUser = async (payload: TLoginUser) => {
    const user = (await User.isUserExistByCustomId(payload?.id))
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'this user is not found!')
    }

    const isDeleted = user?.isDeleted;

    if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'this user is deleted!')
    }

    const userStatus = user?.status;

    if (userStatus) {
        throw new AppError(httpStatus.FORBIDDEN, 'this user is blocked!')
    }

    if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
        throw new AppError(httpStatus.FORBIDDEN, 'Password does not match!')
    }
    return {};
}

export const AuthServices = {
    loginUser
}