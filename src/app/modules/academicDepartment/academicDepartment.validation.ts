import { z } from "zod";

const createAcademicDepartmentValidationSchema = z.object({
    body: z.object({
        name: z
            .string({
                invalid_type_error: 'Academic Department name must be string',
                required_error: 'name is required'
            }),
        academicFaculty: z.string({
            invalid_type_error: 'Academic Faculty must be string',
            required_error: 'faculty is required'
        })
    })
});
const updateAcademicDepartmentValidationSchema = z.object({
    body: z.object({
        name: z
            .string({
                invalid_type_error: 'Academic Department name must be string',
                required_error: 'name is required'
            }).optional(),
        academicFaculty: z.string({
            invalid_type_error: 'Academic Faculty must be string',
            required_error: 'faculty is required'
        }).optional()
    })
});

export const academicDepartmentValidation = {
    createAcademicDepartmentValidationSchema,
    updateAcademicDepartmentValidationSchema,
}