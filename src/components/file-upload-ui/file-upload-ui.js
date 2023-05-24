import React, { useState } from 'react';
import { Box, VStack, Container, Flex, Input, Button, Select, Text } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';

import formsArchive from '../../assets/scan-it-to-office-forms.zip';

const FileUploadUi = () => {

    const [fileDataFormat, setFileDataFormat] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const toast = useToast();

    const fileIsValid = (uploadedFile) => {
        // TODO: add better validation once out of demo mode (type checking, etc)
        if (!uploadedFile)
            return false;

        return uploadedFile.name.endsWith('.xlsx');
    };

    const fileFormatIsValid = () => {
        const fileDataFormats = [
            'field_scan', 'material_receiving'
        ];
        return fileDataFormats.includes(fileDataFormat);
    };

    const showErrorToast = (message) => {
        if (message.constructor === Array) {
            message = message.join(' ');
        }
        toast({
            title: 'Data Upload.',
            description: message,
            status: 'error',
            duration: 9000,
            isClosable: true
        });
    };

    const handleFileChange = (e) => {
        let uploadedFile = e.target.files[0];

        if (!fileIsValid(uploadedFile)) {
            showErrorToast("Files must be in Excel format.");
            setSelectedFile(null);
        } else {
            setSelectedFile(uploadedFile);
        }
    };

    const handleFileDataChange = (e) => {
        let selectedFormat = e.target.value;
        if (selectedFormat === '') {
            showErrorToast("Data Format is required.")
        }
        setFileDataFormat(selectedFormat);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let errors = [];
        if (!fileFormatIsValid(fileDataFormat)) {
            errors.push("A valid Data Format is required.");
        }
        if (!fileIsValid(selectedFile)) {
            errors.push("A valid file is required.");
        }

        if (errors.length > 0) {
            showErrorToast(errors);
            return;
        }

        const formData = new FormData();
        formData.append('format', fileDataFormat);
        formData.append('file', selectedFile);

        fetch(
            process.env.REACT_APP_DATA_UPLOAD_URL,
            {
                method: 'POST',
                body: formData,
            }
        )
            .then((response) => response.json())
            .then((result) => {
                setSelectedFile(null);
                setFileDataFormat('');
                toast({
                    title: 'Data Upload.',
                    description: "File successfully uploaded. Import will begin soon.",
                    status: 'success',
                    duration: 9000,
                    isClosable: true
                });
            })
            .catch((error) => {
                showErrorToast(error.message);
                console.error('Error:', error);
            });
    };

    const handleFormReset = (e) => {
        setSelectedFile(null);
    };

    return (
        <Container>
            <form onSubmit={handleSubmit}>
                <VStack align='stretch'>
                    <Box>
                        <Select placeholder='Data Format' onChange={handleFileDataChange}>
                            <option value='material_receiving'>Receiving</option>
                            <option value='field_scan'>Field Scan</option>
                        </Select>
                    </Box>
                    <Box>
                        <Box as="label"
                            padding={4}
                            borderColor='gray.300'
                            borderWidth={1}
                            borderRadius='md'
                            display='block'
                            cursor='pointer'
                        >
                            <Input
                                display='none'
                                onChange={handleFileChange}
                                type='file'
                            />
                            <Box>
                                {selectedFile ? (
                                    <div>
                                        <Text>Filename: {selectedFile.name}</Text>
                                        <Text>Filetype: {selectedFile.type}</Text>
                                        <Text>Size in bytes: {selectedFile.size}</Text>
                                        <Text>
                                            lastModifiedDate:{' '}
                                            {new Date(selectedFile.lastModified).toLocaleDateString()}
                                        </Text>
                                    </div>
                                ) : (
                                    <Text>Click to select a file...</Text>
                                )}
                            </Box>
                        </Box>
                    </Box>
                    <Flex justify="flex-end" gap={3}>
                        <Button type="reset" onClick={handleFormReset}>Reset</Button>
                        <Button type="submit" colorScheme="blue">Upload</Button>
                    </Flex>
                </VStack>
            </form>
            <Box mt={25}>
                <a href={formsArchive} target="_blank" rel="noreferrer">
                    <strong>Download .sto files for Scan-IT to Office</strong>
                </a>
            </Box>
        </Container>
    )
}

export default FileUploadUi