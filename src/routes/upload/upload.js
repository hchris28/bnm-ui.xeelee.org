import React from 'react'
import FileUploadUi from '../../components/file-upload-ui/file-upload-ui';
import { Box } from '@chakra-ui/react'

const Upload = () => {
    return (
        <Box marginTop={100} padding={5}>
            <FileUploadUi />
        </Box>
    )
}

export default Upload