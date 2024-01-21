import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Flex,
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
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'

export default function Library(){
    const [libraryArray, updateLibraryArray] = useState([]);

    const router = useRouter()

    useEffect(() => {
        var requestOptions = {
            method: 'GET'
        };
          
        fetch("https://sunshelf-back.onrender.com/", requestOptions)
            .then(response => response.json())
            .then(result => updateLibraryArray(result))
            .catch(error => console.log('error', error));
    }, [])

    return (
        <>
            <ul>
                <SimpleGrid 
                    className='m-10'
                    spacing={4} 
                    templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
                        {libraryArray.map(value => 
                        <Card className='p-5 text-center'>
                            <Button onClick={() => router.push('/entries/' + value['_id'] +'?offset=0')}>{value['title']}</Button>
                        </Card>
                        )}
                </SimpleGrid>
            </ul>
        </>
    )
}