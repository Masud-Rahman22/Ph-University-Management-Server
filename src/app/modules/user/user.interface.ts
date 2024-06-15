export type TUser = {
    id: string;
    // email: string;
    password: string;
    needsPasswordChange: boolean;
    // passwordChangedAt?: Date;
    role: 'superAdmin' | 'admin' | 'student' | 'faculty';
    status: 'in-progress' | 'blocked';
    isDeleted: boolean;
}

export type NewUser = {
    id: string;
    password: string;
    role: string;
}