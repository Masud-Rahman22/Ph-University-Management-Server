import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from "../config";
import { TUserRole } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

const auth = (...requiredRoles: TUserRole[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization;
        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'you are not authorized to access this')
        }
        const decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;
        const { role, userId, iat } = decoded;

        const user = (await User.isUserExistByCustomId(userId))
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

        if (user.passwordChangedAt && User.isJwtIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'you are not authorized to access this')
        }

        if (requiredRoles && !requiredRoles.includes(role)) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'you are not authorized to access this')
        }

        req.user = decoded as JwtPayload;
        next();
    })
}

export default auth;