import { StudentContext } from "../context/StudentContext";
import { useContext } from "react";

export const useStudentContext = () => {
    const context = useContext(StudentContext);

    if (!context) {
        throw Error('useStudentContext must be used inside the Student Context Provider');
    }

    return context;

}