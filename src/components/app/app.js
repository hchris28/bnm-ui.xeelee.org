import { Outlet } from "react-router-dom";
import SiteHeader from "../site-header/site-header";
import { UserContextProvider } from '../../contexts/user-context/user-context';
import { Flex, Box } from '@chakra-ui/react';
// import styles from './app.module.css';

function App() {
    return (
        <UserContextProvider>
            <Flex direction="column" height="100vh">
                <Box bgColor="#000" color="#fff">
                    <SiteHeader />
                </Box>
                <Box flex="1">
                    <Outlet />
                </Box>
            </Flex>
        </UserContextProvider>
    );
}

export default App;
