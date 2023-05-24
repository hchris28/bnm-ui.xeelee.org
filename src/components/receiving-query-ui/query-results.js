import React from 'react'
import { Card, CardHeader, CardBody, Heading, Box, Text } from '@chakra-ui/react';
import Badges from './badges';

const QueryResults = ({
    items,
    setSelectedItem = () => {}
}) => {

    console.log(Date.now(), 'query results rendered');

    return (
        <>
            {items.map((item) => {
                return (
                    <Card
                        key={`${item.pallet_id}_${item.id}`}
                        marginTop={3}
                        cursor="pointer"
                        _hover={{ transition: 'all 250ms', bgGradient: 'linear(gray.100, gray.50)' }}
                        onClick={() => setSelectedItem(item.id)}>
                        <CardHeader paddingBottom={0}>
                            <Heading size='sm'>{item.material_receiving_report}</Heading>
                        </CardHeader>
                        <CardBody paddingTop={0}>
                            <Box marginTop={1}>
                                <Badges {...item} />
                            </Box>
                            <Text>{item._date}</Text>
                            <Text fontSize='.875rem'>
                                <em>Container ID:</em> <strong>{item.container_id}</strong> 
                                <br />
                                <em>Bill of Lading:</em> <strong>{item.bill_of_lading}</strong>
                            </Text>
                        </CardBody>
                    </Card>
                );
            })}
        </>
    )
}

export default React.memo(QueryResults)