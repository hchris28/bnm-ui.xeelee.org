import React from 'react'
import { Link as RouterLink } from "react-router-dom";
import { Link as ChakraLink } from '@chakra-ui/react'

const Link = ({ to, children }) => {
    return (
        <ChakraLink
            as={RouterLink}
            to={to}>
            {children}
        </ChakraLink>
    )
}

export default Link