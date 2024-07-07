import { z } from "zod";

const createAcademicSemesterValidationSchema = z.object({
    body: z.object({
        name: z.enum(['Autumn', 'Summer', 'Fall'])
    })
});

export const academicSemesterValidations = {
    createAcademicSemesterValidationSchema,
}