import { TCourse } from "./course.interface";
import { Course } from "./course.model"
import QueryBuilder from "../../builder/QueryBuilder";
import { courseSearchableFields } from "./course.constant";

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

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
    const { preRequisiteCourses, ...courseRemainingData } = payload;
    const updateBasicCourseInfo = await Course.findByIdAndUpdate(
        id,
        courseRemainingData,
        {
            new: true,
            runValidators: true
        }
    )

    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
        const deletedPreRequisites = preRequisiteCourses.filter(el => el.course && el.isDeleted).map(el => el.course)
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(id, {
            $pull: { preRequisiteCourses: { course: { $in: deletedPreRequisites } } }
        })
        const newPreRequisites = preRequisiteCourses.filter(el => el.course && !el.isDeleted)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
        const newPreRequisiteCourses = await Course.findByIdAndUpdate(
            id,
            {
                $addToSet: { preRequisiteCourses: { $each: { newPreRequisites } } }
            }
        )
    }

    const result = await Course.findById(id).populate('preRequisiteCourses.course')

    return result;
}

export const CourseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    getASingleCourseFromDB,
    deleteCourseFromDB,
    updateCourseIntoDB
}