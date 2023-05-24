import React from 'react'
import {
    Box, Wrap, WrapItem, Flex,
    Input, Select, Checkbox, Button
} from '@chakra-ui/react';

const defaultQueryState = {
    pallet_id: '',
    area: '',
    module_type: '',
    osd_only: false,
    moved_only: false
};

function queryInputReducer(state, action) {
    switch (action.type) {
        case 'set_pallet_id':
            return {
                ...state,
                pallet_id: action.value
            };
        case 'set_area':
            return {
                ...state,
                area: action.value
            };
        case 'set_module_type':
            return {
                ...state,
                module_type: action.value
            };
        case 'set_osd_only':
            return {
                ...state,
                osd_only: action.value
            };
        case 'set_moved_only':
            return {
                ...state,
                moved_only: action.value
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
    areaOptions = [],
    moduleTypeOptions = [],
    missingRequiredField = false,
    handleInputChange = () => {},
    handleFormSubmit = () => {},
    handleFormReset = () => {},
}) => {
    return (
        <form onSubmit={handleFormSubmit}>
            <Box margin={2}>
                <Input
                    placeholder='Pallet ID'
                    borderColor={missingRequiredField ? 'red.300' : 'gray.300'}
                    value={queryInputValues.pallet_id}
                    onChange={(e) => handleInputChange({ type: 'set_pallet_id', value: e.target.value })}
                />
            </Box>
            <Box margin={2}>
                <Select
                    placeholder='Select an Area'
                    borderColor={missingRequiredField ? 'red.300' : 'gray.300'}
                    value={queryInputValues.area}
                    onChange={(e) => handleInputChange({ type: 'set_area', value: e.target.value })}
                >
                    {areaOptions.map((areaOption, i) => {
                        return (
                            <option key={i} value={areaOption}>{areaOption}</option>
                        );
                    })}
                </Select>
            </Box>
            <Box margin={2}>
                <Select
                    placeholder='Select a Module Type'
                    borderColor={missingRequiredField ? 'red.300' : 'gray.300'}
                    value={queryInputValues.module_type}
                    onChange={(e) => handleInputChange({ type: 'set_module_type', value: e.target.value })}
                >
                    {moduleTypeOptions.map((moduleTypeOption, i) => {
                        return (
                            <option key={i} value={moduleTypeOption}>{moduleTypeOption}</option>
                        );
                    })}
                </Select>
            </Box>
            <Flex margin={2} paddingLeft={4}>
                <Checkbox
                    colorScheme='red'
                    borderColor='gray.300'
                    isChecked={queryInputValues.osd_only}
                    onChange={(e) => handleInputChange({ type: 'set_osd_only', value: e.target.checked })}
                >
                    OSD Only
                </Checkbox>
                <Checkbox
                    colorScheme='red'
                    borderColor='gray.300'
                    marginLeft={4}
                    isChecked={queryInputValues.moved_only}
                    onChange={(e) => handleInputChange({ type: 'set_moved_only', value: e.target.checked })}
                >
                    Moved
                </Checkbox>
            </Flex>
            <Wrap margin={2} spacing={4} justify="right">
                <WrapItem><Button type="button" colorScheme="gray" onClick={handleFormReset}>Reset</Button></WrapItem>
                <WrapItem><Button type="submit" colorScheme="blue">Submit</Button></WrapItem>
            </Wrap>
        </form>
    )
}

export default QueryForm
export  { defaultQueryState, queryInputReducer }