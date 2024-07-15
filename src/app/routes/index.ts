import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { studentRoutes } from "../modules/student/student.route";
import { academicSemesterRoutes } from "../modules/academicSemester/academicSemester.route";
import { academicFacultyRoutes } from "../modules/academicFaculty/academicFaculty.route";
import { academicDepartmentRoutes } from "../modules/academicDepartment/academicDepartment.route";

const router = Router()

const moduleRoutes = [
    {
        path: '/users',
        route: UserRoutes
    },
    {
        path: '/students',
        route: studentRoutes
    },
    {
        path: '/academic-semesters',
        route: academicSemesterRoutes
    },
    {
        path: '/academic-faculties',
        route: academicFacultyRoutes
    },
    {
        path: '/academic-departments',
        route: academicDepartmentRoutes
    },
]

moduleRoutes.forEach((route) => router.use(route.path, route.route))

export default router;