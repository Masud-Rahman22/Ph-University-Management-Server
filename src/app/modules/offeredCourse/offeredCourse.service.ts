import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { SemesterRegistration } from "../semesterRegistration/semesterRegistration.model";
import { TOfferedCourse } from "./offeredCourse.interface"
import { OfferedCourse } from "./offeredCourse.model"
import { AcademicFaculty } from "../academicFaculty/academicFaculty.model";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { Course } from "../Course/course.model";
import { Faculty } from "../Faculty/faculty.model";

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {

    const {
        semesterRegistration,
        academicFaculty,
        academicDepartment,
        course,
        faculty,
    } = payload;

    const isSemesterRegistrationExist = await SemesterRegistration.findById(semesterRegistration)

    if (!isSemesterRegistrationExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Semester Registration not found")
    }

    const isAcademicFacultyExist = await AcademicFaculty.findById(academicFaculty)

    if (!isAcademicFacultyExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Academic Faculty not found")
    }

    const isAcademicDepartmentExist = await AcademicDepartment.findById(academicDepartment)

    if (!isAcademicDepartmentExist) {
        throw new AppError(httpStatus.NOT_FOUND, "academic department not found")
    }

    const isCourseExist = await Course.findById(course)

    if (!isCourseExist) {
        throw new AppError(httpStatus.NOT_FOUND, "course not found")
    }

    const isFacultyExist = await Faculty.findById(faculty)

    if (!isFacultyExist) {
        throw new AppError(httpStatus.NOT_FOUND, "faculty not found")
    }

    // check if the department belongs to the faculty
    const doesDepartmentBelongToFaculty = await AcademicDepartment.findOne({
        academicDepartment,
        academicFaculty
    })

    if (!doesDepartmentBelongToFaculty) {
        throw new AppError(httpStatus.NOT_FOUND, `${isAcademicDepartmentExist.name} doesn't belong to ${isAcademicFacultyExist.name}`)
    }

    const academicSemester = isSemesterRegistrationExist?.academicSemester;

    const result = await OfferedCourse.create({ ...payload, academicSemester })
    return result;
}

const updateOfferedCourseIntoDB = async () => {

}

export const OfferedCourseServices = {
    createOfferedCourseIntoDB,
    updateOfferedCourseIntoDB
}