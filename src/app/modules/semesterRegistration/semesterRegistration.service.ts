import httpStatus from "http-status"
import AppError from "../../errors/AppError"
import { AcademicSemester } from "../academicSemester/academicSemester.model"
import { TSemesterRegistration } from "./semesterRegistration.interface"
import { SemesterRegistration } from "./semesterRegistration.model"

const createSemesterRegistrationIntoDB = async (payload: TSemesterRegistration) => {
    const academicSemester = payload?.academicSemester
    const isAcademicSemesterExists = await AcademicSemester.findById(academicSemester)
    if (!isAcademicSemesterExists) {
        throw new AppError(httpStatus.NOT_FOUND, "this academic semester does not exist")
    }
    const isSemesterRegistrationExists = await SemesterRegistration.findOne({ academicSemester })
    if (isSemesterRegistrationExists) {
        throw new AppError(httpStatus.CONFLICT, "this semester is already registered")
    }
    const result = await SemesterRegistration.create(payload)
    return result;
}

const getAllSemesterRegistrationsFromDB = async () => {

}
const getSingleSemesterRegistrationsFromDB = async () => {

}
const updateSemesterRegistrationIntoDB = async () => {

}
const deleteSemesterRegistrationFromDB = async () => {

}


export const SemesterRegistrationService = {
    createSemesterRegistrationIntoDB,
    getAllSemesterRegistrationsFromDB,
    getSingleSemesterRegistrationsFromDB,
    updateSemesterRegistrationIntoDB,
    deleteSemesterRegistrationFromDB
} 