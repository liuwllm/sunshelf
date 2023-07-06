import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    IconButton,
    Button,
    Card, 
    CardHeader, 
    CardBody, 
    CardFooter,
    SimpleGrid,
    Tabs, 
    TabList, 
    TabPanels, 
    Tab, 
    TabPanel,
    Heading
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'

export default function Library(){
    const [libraryArray, updateLibraryArray] = useState([]);

    useEffect(function effectFunction() {
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };
              
            fetch("http://localhost:5000/", requestOptions)
                .then(response => response.json())
                .then(result => {
                    updateLibraryArray(result)
                })
                .catch(error => console.log('error', error));
    }, [libraryArray])

    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <ul>
                <SimpleGrid 
                    className='m-10'
                    spacing={4} 
                    templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
                        {libraryArray.map(value => 
                        <Card className='p-5 text-center'>
                            <Button onClick={onOpen}>{value['title']}</Button>
                            
                            <Modal size={'full'} isOpen={isOpen} onClose={onClose}>
                                <ModalOverlay>
                                    <ModalContent>
                                        <ModalHeader>{value['title']}</ModalHeader>
                                        <ModalCloseButton />
                                        <ModalBody>
                                            <Tabs>
                                                <TabList>
                                                    <Tab>Words</Tab>
                                                </TabList>
                                                <TabPanels>
                                                    <TabPanel>
                                                        <SimpleGrid
                                                            className='m-10'
                                                            spacing={4}
                                                            templateColumns='repeat(auto-fill, minmax(200px, 1fr)'>
                                                            {value.words.map(word =>
                                                                <Card className='p-5 text-center'>
                                                                    <CardHeader>
                                                                        <Heading size='xl'>
                                                                            {word['keb'] ? word['keb'] : word['reb']}
                                                                        </Heading>
                                                                    </CardHeader>
                                                                    <CardBody>
                                                                        {word['gloss']}
                                                                    </CardBody>
                                                                </Card>
                                                            )}
                                                        </SimpleGrid>
                                                    </TabPanel>
                                                </TabPanels>
                                            </Tabs>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button colorScheme='red' mr={3} onClick={onClose}>
                                                Close
                                            </Button>
                                        </ModalFooter>
                                    </ModalContent>
                                </ModalOverlay>
                            </Modal>
                        </Card>
                        )}
                </SimpleGrid>
            </ul>
        </>
    )
}