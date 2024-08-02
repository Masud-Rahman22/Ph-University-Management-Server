import { TOfferedCourse } from "./offeredCourse.interface"
import { OfferedCourse } from "./offeredCourse.model"

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
    const result = await OfferedCourse.create(payload)
    return result;
}

const updateOfferedCourseIntoDB = async () => {

}

export const OfferedCourseServices = {
    createOfferedCourseIntoDB,
    updateOfferedCourseIntoDB
}