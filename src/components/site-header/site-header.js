import React from 'react';
import { Box } from '@chakra-ui/react'
import SiteNav from '../site-nav/site-nav'

const SiteHeader = () => {
    return (
        <Box height="85px">
            <SiteNav />
        </Box>
    )
}

export default SiteHeader