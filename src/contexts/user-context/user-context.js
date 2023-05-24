import { useContext, createContext } from "react";
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useToast } from '@chakra-ui/react'

const UserContext = createContext();

const useUserContext = function () {
    return useContext(UserContext);
}

const UserContextProvider = ({ children }) => {

    const toast = useToast();
    const [user, setUser] = useLocalStorage('user', null);

    const login = (user, password) => {
        const userArray = process.env.REACT_APP_USERS.split(' ');
        for (const appUser of userArray){
            const [appUserName, appUserPassword] = appUser.split('.');
            if (user === appUserName && password === appUserPassword) {
                setUser({ name: appUserName });
                return;
            }
        }

        toast({
            title: 'Login Failed.',
            description: "Please check your user name and password and try again.",
            status: 'error',
            duration: 9000,
            isClosable: true
        });
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export { UserContext as default, UserContextProvider, useUserContext };