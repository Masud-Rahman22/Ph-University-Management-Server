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
        section,
        days,
        startTime,
        endTime
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
        _id: academicDepartment,
        academicFaculty
    })

    if (!doesDepartmentBelongToFaculty) {
        throw new AppError(httpStatus.BAD_REQUEST, `${isAcademicDepartmentExist.name} doesn't belong to ${isAcademicFacultyExist.name}`)
    }

    const offeredCourseWithSameRegisteredSemesterAndSection = await OfferedCourse.findOne({
        semesterRegistration,
        course,
        section
    })

    if (offeredCourseWithSameRegisteredSemesterAndSection) {
        throw new AppError(httpStatus.BAD_REQUEST, `Offered Course with same section exists`)
    }

    // get the schedules of the faculty
    const assignedSchedules = await OfferedCourse.find({
        semesterRegistration,
        faculty,
        days: { $in: days }
    }).select('days startTime endTime')

    const newSchedule = {
        days,
        startTime,
        endTime
    }

    assignedSchedules.forEach((schedule) => {
        const existingStartTime = new Date(`2000-01-01T${schedule.startTime}:00`)
        const existingEndTime = new Date(`2000-01-01T${schedule.endTime}:00`)
        const newStartTime = new Date(`2000-01-01T${newSchedule.startTime}:00`)
        const newEndTime = new Date(`2000-01-01T${newSchedule.endTime}:00`)
        if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
            throw new AppError(httpStatus.CONFLICT, `this faculty is not available at that time, please choose another time or date`)
        }
    })

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