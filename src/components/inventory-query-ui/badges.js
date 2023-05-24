import React from 'react'
import { Stack, Badge } from '@chakra-ui/react';

const Badges = ({
    field_scan_type_id,
    field_scan_type_label,
    age
}) => {

    const typeColors = new Map([
        [1, 'blue'],
        [2, 'red'],
        [3, 'purple']
    ]);

    return (
        <Stack direction="row">
            <Badge colorScheme={typeColors.get(field_scan_type_id)} variant='solid'>
                {field_scan_type_label}
            </Badge>
            <Badge colorScheme='green' variant='outline'>
                {age} day{age !== 1 ? "s" : ""} ago
            </Badge>
        </Stack>
    )
}

export default Badges