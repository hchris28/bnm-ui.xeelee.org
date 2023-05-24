import React from 'react'
import {
    Box, Wrap, WrapItem, VStack,
    Input, Button, CheckboxGroup, Checkbox,
    Text
} from '@chakra-ui/react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const defaultQueryState = {
    pallet_id: '',
    field_scan_type_id: [],
    area_id: [],
    module_type_id: [],
    time_stamp: ['', ''],
};

function queryInputReducer(state, action) {
    switch (action.type) {
        case 'set_pallet_id':
            return {
                ...state,
                pallet_id: action.value
            };
        case 'set_field_scan_type_id':
            return {
                ...state,
                field_scan_type_id: action.value
            };
        case 'set_area_id':
            return {
                ...state,
                area_id: action.value
            };
        case 'set_module_type_id':
            return {
                ...state,
                module_type_id: action.value
            };
        case 'set_start_date':
            return {
                ...state,
                time_stamp: [
                    action.value,
                    state.time_stamp[1]
                ]
            };
        case 'set_end_date':
            return {
                ...state,
                time_stamp: [
                    state.time_stamp[0],
                    action.value
                ]
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
    fieldScanTypeOptions = [],
    areaOptions = [],
    moduleTypeOptions = [],
    missingRequiredField = false,
    handleInputChange = () => { },
    handleFormSubmit = () => { },
    handleFormReset = () => { },
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
            <Box
                margin={2}
                padding={4}
                borderColor='gray.300'
                borderWidth={1}
                borderRadius='md'
            >
                <Text mb={3} fontSize='md' color='gray.400'>Scan Type</Text>
                <CheckboxGroup
                    name='field_scan_type_id'
                    colorScheme='green'
                    value={queryInputValues.field_scan_type_id}
                    onChange={(e) => handleInputChange({ type: 'set_field_scan_type_id', value: e })}
                >
                    <Wrap>
                        {fieldScanTypeOptions.map((fieldScanTypeOption) => {
                            return (
                                <WrapItem key={`area_id_${fieldScanTypeOption['id']}`}>
                                    <Checkbox
                                        pr={5}
                                        value={fieldScanTypeOption['id']}>
                                        {fieldScanTypeOption['label']}
                                    </Checkbox>
                                </WrapItem>
                            );
                        })}
                    </Wrap>
                </CheckboxGroup>
            </Box>
            <Box
                margin={2}
                padding={4}
                borderColor='gray.300'
                borderWidth={1}
                borderRadius='md'
            >
                <Text mb={3} fontSize='md' color='gray.400'>Areas</Text>
                <CheckboxGroup
                    name='area_id'
                    colorScheme='green'
                    value={queryInputValues.area_id}
                    onChange={(e) => handleInputChange({ type: 'set_area_id', value: e })}
                >
                    <Wrap>
                        {areaOptions.map((areaOption) => {
                            return (
                                <WrapItem key={`area_id_${areaOption['id']}`}>
                                    <Checkbox
                                        pr={5}
                                        value={areaOption['id']}>
                                        {areaOption['label']}
                                    </Checkbox>
                                </WrapItem>
                            );
                        })}
                    </Wrap>
                </CheckboxGroup>
            </Box>
            <Box
                margin={2}
                padding={4}
                borderColor='gray.300'
                borderWidth={1}
                borderRadius='md'
            >
                <Text mb={3} fontSize='md' color='gray.400'>Module Types</Text>
                <CheckboxGroup
                    name='module_type_id'
                    colorScheme='green'
                    value={queryInputValues.module_type_id}
                    onChange={(e) => handleInputChange({ type: 'set_module_type_id', value: e })}
                >
                    <Wrap>
                        {moduleTypeOptions.map((moduleTypeOption) => {
                            return (
                                <WrapItem key={`module_type_${moduleTypeOption['id']}`}>
                                    <Checkbox
                                        pr={5}
                                        value={moduleTypeOption['id']}>
                                        {moduleTypeOption['label']}
                                    </Checkbox>
                                </WrapItem>
                            );
                        })}
                    </Wrap>
                </CheckboxGroup>
            </Box>
            <Box margin={2}>
                <VStack>
                    <DatePicker
                        selected={queryInputValues.time_stamp[0]}
                        onChange={(date) => handleInputChange({ type: 'set_start_date', value: date })}
                        showTimeSelect
                        dateFormat="yyyy-MM-dd H:mm"
                        placeholderText='Start Date'
                        customInput={<Input />}
                    />
                    <DatePicker
                        selected={queryInputValues.time_stamp[1]}
                        onChange={(date) => handleInputChange({ type: 'set_end_date', value: date })}
                        showTimeSelect
                        dateFormat="Pp"
                        placeholderText='End Date'
                        customInput={<Input />}
                    />
                </VStack>
            </Box>
            <Wrap margin={2} spacing={4} justify="right">
                <WrapItem><Button type="button" colorScheme="gray" onClick={handleFormReset}>Reset</Button></WrapItem>
                <WrapItem><Button type="submit" colorScheme="blue">Submit</Button></WrapItem>
            </Wrap>
        </form>
    )
}

export default QueryForm
export { defaultQueryState, queryInputReducer }