import React, { useState, useEffect, useReducer } from 'react'
import {
    Grid, GridItem, Box, Divider
} from '@chakra-ui/react';
import MapContainer from './map-container';
import { postData } from '../../utility/post-data';
import ItemList from './item-list';
import ItemDetail from './item-detail';
import QueryForm, { defaultQueryState, queryInputReducer } from './query-form';

const QueryUI = () => {

    const [queryInputState, queryInputDispatch] = useReducer(queryInputReducer, defaultQueryState);
    const [areaOptions, setAreaOptions] = useState([]);
    const [moduleTypeOptions, setModuleTypeOptions] = useState([]);

    const [queryResult, setQueryResult] = useState({
        status: "",
        message: '',
        data: [],
        totalRecords: 0
    });

    const [selectedItem, setSelectedItem] = useState(null);

    const onItemDetailClose = () => {
        setSelectedItem(null);
    }

    const doQuery = async (page) => {
        if (!queryInputState.pallet_id && !queryInputState.area && !queryInputState.module_type) {
            return {
                status: "missing-fields",
                message: "Please select at least one of the required fields.",
                query_result: [],
                total_records: 0
            };
        } else {
            const queryResponse = await postData(
                '/query',
                {
                    "pallet_id": queryInputState.pallet_id,
                    "area": queryInputState.area,
                    "module_type": queryInputState.module_type,
                    "osd_only": queryInputState.osd_only,
                    "moved_only": queryInputState.moved_only
                }
            );
            return queryResponse;
        }
    };

    useEffect(() => {
        (async () => {

            const areaResponse = await postData('/area/list');
            setAreaOptions(areaResponse.query_result);

            const moduleTypeResponse = await postData('/module_type/list');
            setModuleTypeOptions(moduleTypeResponse.query_result);

        })();
    }, []);

    const handleQuerySubmit = (e) => {
        e.preventDefault();
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
                            location: {
                                lat: Number(row._lat.trim()),
                                lng: Number(row._lng.trim())
                            }
                        };
                    }),
                    totalRecords: queryResponse.total_records
                });
            } catch (error) {
                console.dir(error);
            } finally {
                // indicate query is complete
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
            <Grid gridTemplateColumns="450px auto" height="100%">
                <GridItem bgColor="#eee" height="calc(100vh - 85px)" overflowY="scroll">
                    <Box margin={25}>
                        <QueryForm
                            queryInputValues={queryInputState}
                            areaOptions={areaOptions}
                            moduleTypeOptions={moduleTypeOptions}
                            missingRequiredField={queryResult.status === 'missing-fields'}
                            handleInputChange={queryInputDispatch}
                            handleFormSubmit={handleQuerySubmit}
                            handleFormReset={handleFormReset}
                        />
                    </Box>
                    <Box margin={25}>
                        <Divider />
                        {queryResult.message}
                        <Divider />
                        <ItemList 
                            items={queryResult.data}
                            setSelectedItem={setSelectedItem} />
                    </Box>
                </GridItem>
                <GridItem bgColor="#ddd">
                    <Box width="100%" height="100%">
                        <MapContainer 
                            markers={queryResult.data}
                            setSelectedItem={setSelectedItem} />
                    </Box>
                </GridItem>
            </Grid>
            {selectedItem &&
                <ItemDetail
                    palletId={selectedItem}
                    onClose={onItemDetailClose}
                />
            }
        </>
    )
}

export default QueryUI