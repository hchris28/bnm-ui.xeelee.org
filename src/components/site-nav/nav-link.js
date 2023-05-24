import React from 'react'
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Link } from '@chakra-ui/react'

const NavLink = ({ to, children }) => {

    const location = useLocation();
    const active = location.pathname === to;

    return (
        <Link
            as={RouterLink}
            to={to}
            margin={1}
            padding={3}
            textTransform="uppercase"
            fontWeight={600}
            borderRadius='md'
            _hover={{ textDecoration: 'none', backgroundColor: 'rgba(255, 255, 255, .2)' }}
            style={active ? { backgroundColor: 'rgba(255, 255, 255, .4)' } : {}}>
            {children}
        </Link>
    )
}

export default NavLink