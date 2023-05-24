import React from 'react'
import { Card, CardHeader, CardBody, Heading, Box, Text } from '@chakra-ui/react';
import ItemBadges from './item-badges';

const ItemList = ({
    items,
    setSelectedItem = () => {}
}) => {

    console.log(Date.now(), 'item list rendered');

    return (
        <>
            {items.map((item) => {
                return (
                    <Card
                        key={`${item.pallet_id}_${item.id}`}
                        marginTop={3}
                        cursor="pointer"
                        _hover={{ transition: 'all 250ms', bgGradient: 'linear(gray.100, gray.50)' }}
                        onClick={() => setSelectedItem(item.pallet_id)}>
                        <CardHeader paddingBottom={0}>
                            <Heading size='sm'>{item.pallet_id}</Heading>
                        </CardHeader>
                        <CardBody paddingTop={0}>
                            <Box marginTop={1}>
                                <ItemBadges {...item} />
                            </Box>
                            <Text>{item._date}</Text>
                            <Text fontSize='.875rem'>
                                <em>Area:</em> <strong>{item.area}</strong> <em>Module:</em> <strong>{item.module_type}</strong>
                            </Text>
                        </CardBody>
                    </Card>
                );
            })}
        </>
    )
}

export default React.memo(ItemList)