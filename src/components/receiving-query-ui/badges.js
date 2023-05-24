import React from 'react'
import { Stack, Badge } from '@chakra-ui/react';

const Badges = ({ material_status_id, material_status_label }) => {
    return (
        <Stack direction="row">
            <Badge colorScheme={material_status_id === 2 ? 'green' : 'red'} variant='outline'>
                {material_status_label}
            </Badge>
        </Stack>
    )
}

export default Badges