import React from 'react'
import {
    Box, Wrap, WrapItem,
    Input, Button
} from '@chakra-ui/react';

const defaultQueryState = {
    bill_of_lading: '',
    container_id: '',
    material_receiving_report: ''
};

function queryInputReducer(state, action) {
    switch (action.type) {
        case 'set_bill_of_lading':
            return {
                ...state,
                bill_of_lading: action.value
            };
        case 'set_container_id':
            return {
                ...state,
                container_id: action.value
            };
        case 'set_material_receiving_report':
            return {
                ...state,
                material_receiving_report: action.value
            };
        case 'reset':
            return {
                ...defaultQueryState
            };
        default:
            throw Error('Unknown action.');
    }
}

const QueryForm = ({
    queryInputValues,
    missingRequiredField = false,
    handleInputChange = () => {},
    handleFormSubmit = () => {},
    handleFormReset = () => {},
}) => {
    return (
        <form onSubmit={handleFormSubmit}>
            <Box margin={2}>
                <Input
                    placeholder='Bill of Lading #'
                    borderColor={missingRequiredField ? 'red.300' : 'gray.300'}
                    value={queryInputValues.bill_of_lading}
                    onChange={(e) => handleInputChange({ type: 'set_bill_of_lading', value: e.target.value })}
                />
            </Box>
            <Box margin={2}>
                <Input
                    placeholder='Container ID'
                    borderColor={missingRequiredField ? 'red.300' : 'gray.300'}
                    value={queryInputValues.container_id}
                    onChange={(e) => handleInputChange({ type: 'set_container_id', value: e.target.value })}
                />
            </Box>
            <Box margin={2}>
                <Input
                    placeholder='Material Receiving Report #'
                    borderColor={missingRequiredField ? 'red.300' : 'gray.300'}
                    value={queryInputValues.material_receiving_report}
                    onChange={(e) => handleInputChange({ type: 'set_material_receiving_report', value: e.target.value })}
                />
            </Box>
            <Wrap margin={2} spacing={4} justify="right">
                <WrapItem><Button type="button" colorScheme="gray" onClick={handleFormReset}>Reset</Button></WrapItem>
                <WrapItem><Button type="submit" colorScheme="blue">Submit</Button></WrapItem>
            </Wrap>
        </form>
    )
}

export default QueryForm
export  { defaultQueryState, queryInputReducer }