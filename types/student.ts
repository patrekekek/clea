export interface Student {
    id: string,
    firstName: string,
    lastName: string,
    middleName?: string,
    section: string,
    sex: "m" | "f",
    status: string,
    pending?: boolean
}   