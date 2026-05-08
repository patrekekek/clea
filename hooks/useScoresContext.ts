import { ScoresContext } from "../context/ScoresContext";
import { useContext } from "react"; 

export const useScoresContext = () => {
    const context = useContext(ScoresContext);

    if (!context) {
        throw Error('useScoresContext must be used inside the ScoreContext Provider');
    }

    return context;

}