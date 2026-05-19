export type UserRole =
    | "teacher"
    | "admin"
    | "parent";


export interface User {
    id: string,

    firstName: string,
    lastName: string,
    middleName?: string,

    
    email: string,
    role: UserRole,
    subject?: string,
    createdAt: string,
}