import React, { useEffect, useState } from 'react'
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
    Box, Flex, Stack, StackDivider, Badge, Wrap, WrapItem,
    Tabs, TabList, TabPanels, Tab, TabPanel,
    Text, Textarea, Button,
    Spinner, Image, Link,
    useToast
} from '@chakra-ui/react'
import Badges from './badges';
import { postData } from '../../utility/post-data';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useUserContext } from '../../contexts/user-context/user-context'

const MAP_MARKER = 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z';

const Detail = ({
    receivingLogId = null,
    onClose = () => { }
}) => {

    const toast = useToast();
    const { user } = useUserContext();

    const { isLoaded: isMapsApiLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        //libraries: ['geometry', 'drawing'],
    });

    const [receivingLogData, setReceivingLogData] = useState(null);
    const [newNote, setNewNote] = useState('');

    useEffect(() => {
        (async () => {
            const queryResponse = await postData(
                '/receiving_log',
                {
                    "id": receivingLogId
                }
            );
            setReceivingLogData(queryResponse.query_result);
        })();
    }, [receivingLogId]);

    const addNote = (e) => {
        (async () => {
            const queryResponse = await postData(
                '/receiving_log/add_note',
                {
                    "material_receiving_log_id": receivingLogId,
                    "content": newNote,
                    "author": user.name
                }
            );
            if (queryResponse.status === 'ok') {
                setReceivingLogData({
                    ...receivingLogData,
                    "notes": [
                        ...receivingLogData.notes,
                        {
                            id: queryResponse.id,
                            content: newNote,
                            date: "just now",
                            author: user.name,
                        }
                    ]
                });
            } else {
                toast({
                    title: 'Add Note',
                    description: "An error occurred while adding the note: " + queryResponse.message,
                    status: 'error',
                    duration: 9000,
                    isClosable: true
                });
            }
        })();

    };

    const isReady = receivingLogData != null && isMapsApiLoaded;

    return (
        <Modal isOpen={true} onClose={onClose} size="xl">
            <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(5px)' />
            <ModalContent>
                <ModalHeader>{isReady ? receivingLogData.material_receiving_report : "Retrieving data..."}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {!isReady
                        ? (<Spinner size='xl' />)
                        : (
                            <>
                                <Badges {...receivingLogData} />
                                <Stack
                                    divider={<StackDivider borderColor='gray.200' />}
                                    spacing={4}>
                                    <Text>{receivingLogData.time_stamp}</Text>
                                    <Text>
                                        <em>Container ID:</em> <strong>{receivingLogData.container_id}</strong>
                                        <br />
                                        <em>Bill of Lading:</em> <strong>{receivingLogData.bill_of_lading}</strong>
                                    </Text>
                                    <Text>
                                        <em>Material Type:</em>
                                        <br />
                                        {receivingLogData.material_type}
                                    </Text>
                                    <Box>
                                        <Flex>
                                            <Box flex='1'><em>Pallets:</em> <strong>{receivingLogData.pallet_quantity}</strong></Box>
                                            <Box flex='1'><em>Units:</em> <strong>{receivingLogData.unit_quantity}</strong></Box>
                                        </Flex>
                                        <Stack direction="row" pt="2">
                                            {receivingLogData.pallet_ids.map((pallet_id) => {
                                                return (
                                                    <Badge key={pallet_id} p="1">
                                                        {pallet_id}
                                                    </Badge>
                                                )
                                            })}
                                        </Stack>
                                    </Box>

                                    <Tabs variant="enclosed-colored">
                                        <TabList>
                                            <Tab>Map</Tab>
                                            <Tab>Notes</Tab>
                                            <Tab>Photos</Tab>
                                            <Tab>Signature</Tab>
                                        </TabList>
                                        <TabPanels>
                                            <TabPanel>
                                                <GoogleMap
                                                    mapContainerStyle={{ height: "400px", width: "100%" }}
                                                    zoom={15}
                                                    center={receivingLogData.location}
                                                    mapTypeId="hybrid"
                                                    labels={true}
                                                >
                                                    <Marker
                                                        key={receivingLogData.id}
                                                        position={receivingLogData.location}
                                                        icon={{
                                                            path: MAP_MARKER,
                                                            fillColor: "red",
                                                            fillOpacity: 0.5,
                                                            strokeWeight: 1,
                                                            strokeColor: "black",
                                                            rotation: 0,
                                                            scale: 1.2,
                                                            anchor: new window.google.maps.Point(0, 20),
                                                        }}
                                                    />
                                                </GoogleMap>
                                            </TabPanel>
                                            <TabPanel>
                                                <Stack divider={<StackDivider borderColor='gray.200' />}>
                                                    {receivingLogData.notes.map((note) => {
                                                        return (
                                                            <Box key={note.id}>
                                                                <Text fontWeight={700}>{note.content}</Text>
                                                                <Text fontSize='.875rem' color='gray.400'>{note.author} @ {note.date}</Text>
                                                            </Box>
                                                        )
                                                    })}
                                                    <Box>
                                                        <Textarea
                                                            placeholder='Add a note...'
                                                            value={newNote}
                                                            onChange={(e) => setNewNote(e.currentTarget.value)}>
                                                        </Textarea>
                                                        <Flex justify='right' marginTop={2}>
                                                            <Button type="button" onClick={addNote}>
                                                                Save
                                                            </Button>
                                                        </Flex>
                                                    </Box>
                                                </Stack>
                                            </TabPanel>
                                            <TabPanel>
                                                <Wrap spacing={6}>
                                                    {receivingLogData.inspection_images.map((img_src, idx) => {
                                                        return (
                                                            <WrapItem key={idx}>
                                                                <Link href={img_src} m={0} isExternal>
                                                                    <Image
                                                                        boxSize='100px'
                                                                        objectFit='cover'
                                                                        src={img_src}
                                                                        alt='Inspection photo'
                                                                    />
                                                                </Link>
                                                            </WrapItem>
                                                        )
                                                    })}
                                                </Wrap>
                                            </TabPanel>
                                            <TabPanel>
                                                <Image
                                                    objectFit='cover'
                                                    src={receivingLogData.signature}
                                                    alt='Signauture'
                                                />
                                            </TabPanel>
                                        </TabPanels>
                                    </Tabs>
                                </Stack>
                            </>
                        )
                    }
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='blue' onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default Detail