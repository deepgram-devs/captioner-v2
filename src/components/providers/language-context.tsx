import { createContext } from "react";

type LanguageProvider = {
    language: string;
    setLanguage: (index: string) => void;
    };

const LanguageContext = createContext({} as LanguageProvider);

export default LanguageContext;
