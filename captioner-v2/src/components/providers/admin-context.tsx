import { createContext } from 'react';

const AdminContext = createContext({
    isAdmin: false,
    setIsAdmin: (index: boolean) => {},
} as AdminContext);


type AdminContext = {
    isAdmin: boolean;
    setIsAdmin: (index: boolean) => void;
  };

export default AdminContext;