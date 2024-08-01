import httpStatus from "http-status"
import AppError from "../../errors/AppError"
import { AcademicSemester } from "../academicSemester/academicSemester.model"
import { TSemesterRegistration } from "./semesterRegistration.interface"

const createSemesterRegistrationIntoDB = async (payload: TSemesterRegistration) => {
    const academicSemester = payload?.academicSemester
    const isAcademicSemesterExists = await AcademicSemester.findById(academicSemester)
    if (!isAcademicSemesterExists) {
        throw new AppError(httpStatus.NOT_FOUND, "this academic semester does not exist")
    }
}

export const SemesterRegistrationService = {
    createSemesterRegistrationIntoDB
} 