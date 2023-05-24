import React from 'react'
import { Stack, Badge } from '@chakra-ui/react';

const ItemBadges = ({ status, _age, _moves }) => {
    return (
        <Stack direction="row">
            <Badge colorScheme={status === 'active' ? 'green' : 'red'} variant='outline'>
                Status: {status}
            </Badge>
            <Badge colorScheme='green' variant='outline'>
                Age: {_age} day{_age !== 1 ? "s" : ""}
            </Badge>
            {_moves > 0 &&
                <Badge colorScheme='red'>{_moves} move{+_moves !== 1 ? "s" : ""}</Badge>
            }
        </Stack>
    )
}

export default ItemBadges