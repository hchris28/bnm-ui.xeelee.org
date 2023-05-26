import React from 'react'
import { Card, CardHeader, CardBody, Heading, Box, Text, Divider } from '@chakra-ui/react';
import Badges from './badges';

const ItemList = ({
    items,
    message,
    setSelectedItem = () => { }
}) => {
    return (
        <>
            {message}
            <Divider />
            {items.map((item) => {
                return (
                    <Card
                        key={`${item.pallet_id}_${item.id}`}
                        marginTop={3}
                        cursor="pointer"
                        _hover={{ transition: 'all 250ms', bgGradient: 'linear(gray.100, gray.50)' }}
                        onClick={() => setSelectedItem(item.id)}>
                        <CardHeader paddingBottom={0}>
                            <Heading size='sm'>{item.pallet_id}</Heading>
                        </CardHeader>
                        <CardBody paddingTop={0}>
                            <Box marginTop={1}>
                                <Badges {...item} />
                            </Box>
                            <Text>{item.time_stamp}</Text>
                            <Text fontSize='.875rem'>
                                <em>Area:</em> <strong>{item.area_label}</strong> <em>Module:</em> <strong>{item.module_type_label}</strong>
                            </Text>
                        </CardBody>
                    </Card>
                );
            })}
        </>
    )
}

export default React.memo(ItemList)