import httpStatus from "http-status"
import AppError from "../../errors/AppError"
import { AcademicSemester } from "../academicSemester/academicSemester.model"
import { TSemesterRegistration } from "./semesterRegistration.interface"
import { SemesterRegistration } from "./semesterRegistration.model"
import QueryBuilder from "../../builder/QueryBuilder"
import { RegistrationStatus } from "./semesterRegistration.constant"

const createSemesterRegistrationIntoDB = async (payload: TSemesterRegistration) => {
    // if a registered semester is ONGOING or UPCOMING then we will use a validation that we can not create a registered semester it has to be ENDED
    const isThereAnyUpcomingOrOngoingRegisteredSemester = await SemesterRegistration.findOne({
        $or: [{ status: RegistrationStatus.ONGOING }, { status: RegistrationStatus.UPCOMING }]
    })
    if (isThereAnyUpcomingOrOngoingRegisteredSemester) {
        throw new AppError(httpStatus.BAD_REQUEST, `There is already a ${isThereAnyUpcomingOrOngoingRegisteredSemester.status} registered semester`)
    }
    // creating
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

const getAllSemesterRegistrationsFromDB = async (query: Record<string, unknown>) => {
    const semesterRegistrationQuery = new QueryBuilder(SemesterRegistration.find().populate('academicSemester'), query).filter().sort().paginate().fields()
    const result = await semesterRegistrationQuery.modelQuery;
    return result;
}
const getSingleSemesterRegistrationsFromDB = async (id: string) => {
    const result = await SemesterRegistration.findById(id).populate('academicSemester')
    return result;
}
const updateSemesterRegistrationIntoDB = async (id: string, payload: Partial<TSemesterRegistration>) => {
    const isSemesterRegistrationExists = await SemesterRegistration.findById(id)
    if (!isSemesterRegistrationExists) {
        throw new AppError(httpStatus.BAD_REQUEST, `This semester could not be found`)
    }
    const currentSemesterStatus = isSemesterRegistrationExists?.status
    const requestedStatus = payload?.status
    if (currentSemesterStatus === RegistrationStatus.ENDED) {
        throw new AppError(httpStatus.BAD_REQUEST, `This semester is already ${currentSemesterStatus}`)
    }
    // UPCOMING -> ONGOING -> ENDED
    if (currentSemesterStatus === RegistrationStatus.UPCOMING && requestedStatus === RegistrationStatus.ENDED) {
        throw new AppError(httpStatus.BAD_REQUEST, `you can't directly change from ${currentSemesterStatus} to ${requestedStatus}`)
    }
    if (currentSemesterStatus === RegistrationStatus.ONGOING && requestedStatus === RegistrationStatus.UPCOMING) {
        throw new AppError(httpStatus.BAD_REQUEST, `you can't directly change from ${currentSemesterStatus} to ${requestedStatus}`)
    }
    const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true
    })
    return result;
}
const deleteSemesterRegistrationFromDB = async (id: string) => {
    
}


export const SemesterRegistrationService = {
    createSemesterRegistrationIntoDB,
    getAllSemesterRegistrationsFromDB,
    getSingleSemesterRegistrationsFromDB,
    updateSemesterRegistrationIntoDB,
    deleteSemesterRegistrationFromDB
} 