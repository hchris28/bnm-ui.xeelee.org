import React from 'react'
import { Text } from '@chakra-ui/react';

const QueryInstructions = () => {
    return (
        <>
            <Text>
                Use the search form to the left to to search the database.
            </Text>
            <Text mt={4}>
                Leave the form blank and click Submit to see recent activity.
            </Text>
        </>
    )
}

export default QueryInstructions