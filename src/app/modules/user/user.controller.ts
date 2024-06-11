import { userService } from "./user.service";


const createStudent = async (req: Request, res: Response) => {
    try {
        const { password, student: studentData } = req.body;
        // const zodParseData = studentValidationSchema.parse(studentData)
        const result = await userService.createUserIntoDb(password, studentData);
        // console.log(error, value);
        // if (error) {
        //   res.status(500).json({
        //     success: false,
        //     message: 'Something went wrong',
        //     error: error.details,
        //   });
        // }

        res.status(200).json({
            success: true,
            message: 'Student created successfully',
            data: result,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message || 'Something went wrong',
            error: err,
        });
    }
};