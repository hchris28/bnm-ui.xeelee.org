import React, { useState, useReducer } from 'react'
import {
    Grid, GridItem, Box, Spinner, VStack, Text
} from '@chakra-ui/react';
import QueryForm, { defaultQueryState, queryInputReducer } from './query-form';
import MapContainer from '../map-container/map-container';
import QueryInstructions from '../query-instructions/query-instructions';
import QueryResults from './query-results';
import Detail from './detail';
import { postData } from '../../utility/post-data';

const ReceivingQueryUi = () => {

    const [queryInputState, queryInputDispatch] = useReducer(queryInputReducer, defaultQueryState);

    const [queryResult, setQueryResult] = useState({
        status: "",
        message: "",
        data: [],
        totalRecords: 0
    });

    const [selectedItem, setSelectedItem] = useState(null);

    const [isloading, setIsLoading] = useState(false);

    const onItemDetailClose = () => {
        setSelectedItem(null);
    }

    const doQuery = async (page) => {
        const queryResponse = await postData(
            '/receiving_log/list',
            {
                "bill_of_lading": queryInputState.bill_of_lading,
                "container_id": queryInputState.container_id,
                "material_receiving_report": queryInputState.material_receiving_report
            }
        );
        return queryResponse;
    };

    const handleQuerySubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        (async () => {
            try {
                const queryResponse = await doQuery();
                setQueryResult({
                    status: queryResponse.status,
                    message: queryResponse.message,
                    data: queryResponse.query_result.map(row => {
                        return {
                            ...row,
                            key: `${row.id}`,
                            name: row.material_receiving_report,
                        };
                    }),
                    totalRecords: queryResponse.total_records
                });
            } catch (error) {
                console.dir(error);
            } finally {
                // indicate query is complete
                setIsLoading(false);
            }
        })();
    };

    const handleFormReset = () => {
        setQueryResult({
            status: "",
            message: "",
            data: [],
            totalRecords: 0
        });
        queryInputDispatch({ type: 'reset' });
    };

    return (
        <>
            <Grid gridTemplateColumns="1fr 1fr 2fr" height="100%">
                <GridItem bgColor="#eee" height="calc(100vh - 85px)" overflowY="scroll">
                    <Box margin={25}>
                        <QueryForm
                            queryInputValues={queryInputState}
                            missingRequiredField={queryResult.status === 'missing-fields'}
                            handleInputChange={queryInputDispatch}
                            handleFormSubmit={handleQuerySubmit}
                            handleFormReset={handleFormReset}
                        />
                    </Box>
                </GridItem>


                <GridItem bgColor="#fff " height="calc(100vh - 85px)" overflowY="scroll">
                    <Box margin={25}>
                        {isloading
                            ? (
                                <VStack>
                                    <Spinner size='xl' />
                                    <Text>Searching...</Text>
                                </VStack>
                            )
                            : (queryResult.totalRecords === 0
                                ? (
                                    <QueryInstructions />
                                ) : (
                                    <QueryResults
                                        items={queryResult.data}
                                        message={queryResult.message}
                                        setSelectedItem={setSelectedItem}
                                    />
                                )
                            )
                        }
                    </Box>
                </GridItem>


                <GridItem bgColor="#ddd">
                    <Box width="100%" height="100%">
                        <MapContainer
                            markers={queryResult.data}
                            setSelectedItem={setSelectedItem}
                        />
                    </Box>
                </GridItem>
            </Grid>
            {selectedItem &&
                <Detail
                    receivingLogId={selectedItem}
                    onClose={onItemDetailClose}
                />
            }
        </>
    )
}

export default ReceivingQueryUi