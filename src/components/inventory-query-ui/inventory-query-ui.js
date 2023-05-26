import React, { useState, useEffect, useReducer } from 'react'
import {
    Grid, GridItem, Box, Text, Button,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
    VStack, Spinner
} from '@chakra-ui/react';
import MapContainer from '../map-container/map-container';
import QueryInstructions from '../query-instructions/query-instructions';
import QueryResults from './query-results';
import Detail from './detail';
import QueryForm, { defaultQueryState, queryInputReducer } from './query-form';
import { postData } from '../../utility/post-data';

const formatDate = (input) => {
    const yr = input.getFullYear();
    const mn = (input.getMonth() + 1).toString().padStart(2, '0');
    const dt = input.getDate().toString().padStart(2, '0');
    const hr = input.getHours().toString().padStart(2, '0');
    const mi = input.getMinutes().toString().padStart(2, '0');

    // 2023-03-21 17:39:00
    return `${yr}-${mn}-${dt} ${hr}:${mi}`;
};

const formatTimestampParameter = (time_stamp_param) => {
    let formatted_param = ['', ''];
    if (time_stamp_param[0] instanceof Date) {
        formatted_param[0] = formatDate(time_stamp_param[0]);
    }
    if (time_stamp_param[1] instanceof Date) {
        formatted_param[1] = formatDate(time_stamp_param[1]);
    }

    return formatted_param;
}

const InventoryQueryUI = () => {

    const [queryInputState, queryInputDispatch] = useReducer(queryInputReducer, defaultQueryState);
    const [areaOptions, setAreaOptions] = useState([]);
    const [fieldScanTypeOptions, setFieldScanTypeOptions] = useState([]);
    const [moduleTypeOptions, setModuleTypeOptions] = useState([]);

    const [queryResult, setQueryResult] = useState({
        status: "",
        message: '',
        data: [],
        totalRecords: 0
    });

    const [selectedItem, setSelectedItem] = useState(null);
    const onItemDetailClose = () => { setSelectedItem(null); }

    const [selectedCluster, setSelectedCluster] = useState(null);
    const onClusterDetailClose = () => { setSelectedCluster(null); }

    const [isloading, setIsLoading] = useState(false);

    const doQuery = async () => {
        const queryResponse = await postData(
            '/field_scan/list',
            {
                "pallet_id": queryInputState.pallet_id,
                "field_scan_type_id": queryInputState.field_scan_type_id,
                "area_id": queryInputState.area_id,
                "module_type_id": queryInputState.module_type_id,
                "time_stamp": formatTimestampParameter(queryInputState.time_stamp),
            }
        );
        return queryResponse;
    };

    useEffect(() => {
        (async () => {

            const areaResponse = await postData('/area/list');
            setAreaOptions(areaResponse.query_result);

            const moduleTypeResponse = await postData('/module_type/list');
            setModuleTypeOptions(moduleTypeResponse.query_result);

            const fieldScanTypeResponse = await postData('/field_scan_type/list');
            setFieldScanTypeOptions(fieldScanTypeResponse.query_result);

        })();
    }, []);

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
                            key: `${row.pallet_id}_${row.id}`,
                            name: row.pallet_id,
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
                            fieldScanTypeOptions={fieldScanTypeOptions}
                            areaOptions={areaOptions}
                            moduleTypeOptions={moduleTypeOptions}
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
                            setSelectedCluster={setSelectedCluster} />
                    </Box>
                </GridItem>
            </Grid>
            {selectedItem &&
                <Detail
                    fieldScanId={selectedItem}
                    onClose={onItemDetailClose}
                />
            }
            <Modal isOpen={selectedCluster} onClose={onClusterDetailClose} size="sm">
                <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(5px)' />
                <ModalContent>
                    <ModalHeader>Select...</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Hi
                        {/* {selectedCluster && selectedCluster.map((id) => {
                            return (
                                <>
                                    <Text key={id}>{id}</Text>
                                </>
                            );
                        })} */}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' onClick={onClusterDetailClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default InventoryQueryUI