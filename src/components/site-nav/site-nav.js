import React from 'react'
import { Flex, Button } from '@chakra-ui/react'
import NavLink from './nav-link';
import { useUserContext } from '../../contexts/user-context/user-context';

const SiteNav = () => {

    const { user, logout } = useUserContext();

    return (
        <Flex as="nav" padding={5} height="100%" align="center">
            {user
                ? (
                    <>
                        <NavLink to="/receiving">Receiving</NavLink>
                        <NavLink to="/inventory">Inventory</NavLink>
                        <NavLink to="/reports">Reports</NavLink>
                        <NavLink to="/upload">Upload</NavLink>
                        <NavLink to="/settings">Settings</NavLink>
                        <Button
                            ml='auto'
                            colorScheme='blue'
                            onClick={logout}>
                            Log Out
                        </Button>
                    </>
                ) : (
                    <>
                        <NavLink to="/home">Home</NavLink>
                        <NavLink to="/login">Login</NavLink>
                    </>
                )
            }
        </Flex>
    )
}

export default SiteNav