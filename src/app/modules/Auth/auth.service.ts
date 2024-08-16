import httpStatus from "http-status"
import AppError from "../../errors/AppError"
import { User } from "../user/user.model"
import { TLoginUser } from "./auth.interface"
import config from "../../config"
import { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { createToken } from "./auth.utils"
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

    if (userStatus === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'this user is blocked!')
    }

    if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
        throw new AppError(httpStatus.FORBIDDEN, 'Password does not match!')
    }

    const jwtPayload = {
        userId: user?.id,
        role: user?.role
    }

    const accessToken = createToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as string)

    const refreshToken = createToken(jwtPayload, config.jwt_refresh_secret as string, config.jwt_refresh_expires_in as string)

    return {
        accessToken,
        refreshToken,
        needsPasswordChange: user?.needsPasswordChange
    };
}

const changePasswordIntoDB = async (userData: JwtPayload,
    payload: { oldPassword: string; newPassword: string },) => {

    const user = (await User.isUserExistByCustomId(userData.userId))
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'this user is not found!')
    }

    const isDeleted = user?.isDeleted;

    if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'this user is deleted!')
    }

    const userStatus = user?.status;

    if (userStatus === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'this user is blocked!')
    }

    if (!(await User.isPasswordMatched(payload?.oldPassword, user?.password))) {
        throw new AppError(httpStatus.FORBIDDEN, 'Password does not match!')
    }

    const newHashedPassword = await bcrypt.hash(
        payload.newPassword,
        Number(config.bcrypt_salt_rounds),
    );

    await User.findOneAndUpdate(
        {
            id: userData.userId,
            role: userData.role,
        },
        {
            password: newHashedPassword,
            needsPasswordChange: false,
            passwordChangedAt: new Date(),
        },
    );
    return null;
}

export const AuthServices = {
    loginUser,
    changePasswordIntoDB
}