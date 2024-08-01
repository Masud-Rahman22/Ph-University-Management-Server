import { TCourse, TCourseFaculty } from "./course.interface";
import { Course, CourseFaculty } from "./course.model"
import QueryBuilder from "../../builder/QueryBuilder";
import { courseSearchableFields } from "./course.constant";
import mongoose from "mongoose";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createCourseIntoDB = async (payload: TCourse) => {
    const result = await Course.create(payload)
    return result;
}

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
    const courseQuery = new QueryBuilder(Course.find().populate('preRequisiteCourses.course'), query)
        .search(courseSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields()
    const result = await courseQuery.modelQuery;
    return result;
}

const getASingleCourseFromDB = async (id: string) => {
    const result = await Course.findById(id).populate('preRequisiteCourses.course')
    return result;
}

const deleteCourseFromDB = async (id: string) => {
    const result = await Course.findByIdAndUpdate(
        id,
        {
            isDeleted: true,
        },
        {
            new: true,
        }
    )
    return result;
}

const assignFacultiesWithCourseIntoDB = async (courseId: string, payload: Partial<TCourseFaculty>) => {
    const result = await CourseFaculty.findByIdAndUpdate(
        courseId,
        {
            course: courseId,
            $addToSet: { faculties: { $each: payload } }
        },
        {
            upsert: true,
            new: true,
        }
    )
    return result;
}

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
    const { preRequisiteCourses, ...courseRemainingData } = payload;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        const updateBasicCourseInfo = await Course.findByIdAndUpdate(
            id,
            courseRemainingData,
            {
                new: true,
                runValidators: true,
                session
            }
        )
        if (!updateBasicCourseInfo) {
            throw new AppError(httpStatus.BAD_REQUEST, 'failed to update course')
        }

        if (preRequisiteCourses && preRequisiteCourses.length > 0) {
            const deletedPreRequisites = preRequisiteCourses.filter(el => el.course && el.isDeleted).map(el => el.course)
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
            const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(id,
                {
                    $pull: { preRequisiteCourses: { course: { $in: deletedPreRequisites } } }
                }, {
                new: true,
                runValidators: true,
                session
            })
            if (!deletedPreRequisiteCourses) {
                throw new AppError(httpStatus.BAD_REQUEST, 'failed to update course')
            }
            const newPreRequisites = preRequisiteCourses.filter(el => el.course && !el.isDeleted)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
            const newPreRequisiteCourses = await Course.findByIdAndUpdate(
                id,
                {
                    $addToSet: { preRequisiteCourses: { $each: { newPreRequisites } } }
                },
                {
                    new: true,
                    runValidators: true,
                    session
                }
            )
            if (!newPreRequisiteCourses) {
                throw new AppError(httpStatus.BAD_REQUEST, 'failed to update course')
            }
            const result = await Course.findById(id).populate('preRequisiteCourses.course')

            return result;
        }

        await session.commitTransaction();
        await session.endSession();

    } catch (err) {
        await session.abortTransaction()
        await session.endSession()
        throw new AppError(httpStatus.BAD_REQUEST, 'failed to update course')
    }
}

export const CourseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    getASingleCourseFromDB,
    deleteCourseFromDB,
    updateCourseIntoDB,
    assignFacultiesWithCourseIntoDB
}