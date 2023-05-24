import React, { useEffect, useState } from 'react'
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
    Menu, MenuButton, MenuList, MenuItem,
    Box, Flex, Stack, StackDivider,
    Tabs, TabList, TabPanels, Tab, TabPanel,
    Text, Textarea, Button,
    Spinner,
    useToast
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { postData } from '../../utility/post-data';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import PalletMarkerList from './pallet_marker_list';
import ItemBadges from './item-badges';
import { useUserContext } from '../../contexts/user-context/user-context'

const ItemDetail = ({ palletId, onClose = () => { } }) => {

    const toast = useToast();
    const { user } = useUserContext();

    const { isLoaded: isMapsApiLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        //libraries: ['geometry', 'drawing'],
    });

    const [palletData, setPalletData] = useState(null);
    const [newNote, setNewNote] = useState('');

    useEffect(() => {
        (async () => {
            const queryResponse = await postData(
                '/pallet',
                {
                    "pallet_id": palletId
                }
            );
            setPalletData(queryResponse.query_result);
        })();
    }, [palletId]);

    const setStatus = (newStatus) => {
        (async () => {
            const queryResponse = await postData(
                '/pallet/set_status',
                {
                    "pallet_id": palletId,
                    "status": newStatus
                }
            );
            if (queryResponse.status === 'ok') {
                setPalletData({
                    ...palletData,
                    "status": queryResponse.input.status
                });
            } else {
                toast({
                    title: 'Update Status',
                    description: "An error occurred while updating the status: " + queryResponse.message,
                    status: 'error',
                    duration: 9000,
                    isClosable: true
                });
            }
        })();

    };

    const addNote = (e) => {
        (async () => {
            const queryResponse = await postData(
                '/pallet/add_note',
                {
                    "pallet_id": palletId,
                    "note": newNote,
                    "author": user.name
                }
            );
            if (queryResponse.status === 'ok') {
                setPalletData({
                    ...palletData,
                    "notes": [
                        ...palletData.notes,
                        {
                            id: queryResponse.id,
                            content: newNote,
                            date: "just now",
                            author: user.name,
                            pallet_id: palletId
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

    const isReady = palletData != null && isMapsApiLoaded;

    return (
        <Modal isOpen={true} onClose={onClose} size="xl">
            <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(5px)' />
            <ModalContent>
                <ModalHeader>Pallet ID: {palletId}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {!isReady
                        ? (<Spinner size='xl' />)
                        : (
                            <>
                                <ItemBadges {...palletData} />
                                <Flex justify="right">
                                    <Menu>
                                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                            Change Status
                                        </MenuButton>
                                        <MenuList>
                                            <MenuItem onClick={() => { setStatus('active') }}>Active</MenuItem>
                                            <MenuItem onClick={() => { setStatus('damaged') }}>Damaged</MenuItem>
                                            <MenuItem onClick={() => { setStatus('over') }}>Over</MenuItem>
                                            <MenuItem onClick={() => { setStatus('short') }}>Short</MenuItem>
                                        </MenuList>
                                    </Menu>
                                </Flex>
                                <Stack
                                    divider={<StackDivider borderColor='gray.200' />}
                                    spacing={4}>
                                    {palletData.history.map(item => (
                                        <Box key={`${item.pallet_id}_${item.id}`}>
                                            <Text>{item._date}</Text>
                                            <Text fontSize='.875rem'>
                                                <em>Area:</em> <strong>{item.area}</strong> <em>Module:</em> <strong>{item.module_type}</strong>
                                            </Text>
                                            {item.notes &&
                                                <>
                                                    <Text>Field Notes:</Text>
                                                    <Text fontSize='.875rem'>
                                                        {item.notes}
                                                    </Text>
                                                </>
                                            }
                                        </Box>
                                    ))}
                                    <Tabs variant="enclosed-colored">
                                        <TabList>
                                            <Tab>Map</Tab>
                                            <Tab>Notes</Tab>
                                            <Tab>Photos</Tab>
                                        </TabList>
                                        <TabPanels>
                                            <TabPanel>
                                                <GoogleMap
                                                    mapContainerStyle={{ height: "400px", width: "100%" }}
                                                    zoom={15}
                                                    center={palletData.location}
                                                    mapTypeId="hybrid"
                                                    labels={true}
                                                >
                                                    <PalletMarkerList
                                                        markers={palletData.history.map(item => {
                                                            return {
                                                                ...item,
                                                                key: `${item.pallet_id}_${item.id}`,
                                                                name: item.pallet_id,
                                                                location: {
                                                                    lat: Number(item._lat.trim()),
                                                                    lng: Number(item._lng.trim())
                                                                }
                                                            };
                                                        })}
                                                    />
                                                </GoogleMap>
                                            </TabPanel>
                                            <TabPanel>
                                                <Stack divider={<StackDivider borderColor='gray.200' />}>
                                                    {palletData.notes.map((note) => {
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
                                                <p>Photos!</p>
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

export default ItemDetail