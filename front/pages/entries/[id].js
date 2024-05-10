import { 
    SimpleGrid, 
    Card, 
    CardBody, 
    CardHeader, 
    Flex, 
    Heading, 
    Text,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    Button,
    IconButton,
    Spacer,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box
} from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { router } from 'next/router';

export default function Post({ data, id, offset }) {
    const [cardQueue, setCardQueue] = useState([]);

    useEffect(() => {
        setCardQueue(JSON.parse(localStorage.getItem('cards')));
        window.addEventListener('storage', () => setCardQueue(JSON.parse(localStorage.getItem('cards'))));
    }, []);
    
    function handleAdd(word) {
        console.log(cardQueue);
        const cards = JSON.parse(localStorage.getItem('cards'));
        if (!cards || cards.length == 0) {
            localStorage.setItem('cards', JSON.stringify([word]));
            window.dispatchEvent(new Event("storage"));
        }
        else if (!cards.some(e => e.id === word['id'])){
            localStorage.setItem('cards', JSON.stringify([...cards, word]));
            window.dispatchEvent(new Event("storage"));
        }
    }

    function handleRemove(word) {
        const cards = JSON.parse(localStorage.getItem('cards'));
        localStorage.setItem('cards', JSON.stringify(cards.filter((card) => {return card['id'] !== word['id']})));
        window.dispatchEvent(new Event("storage"));
    }

    function exportCards() {
        const selectedCards = JSON.parse(localStorage.getItem('cards'));

        const csvHeader = "data:text/csv;charset=utf-8,"
        const csvString = [
            [
                "keb",
                "reb",
                "sense"
            ],
            ...selectedCards.map(card => [
                card.keb.join("/"),
                card.reb.join("/"),
                card.sense.map((sense) => sense.join("/")).join("; ")
            ])
        ].map(e => e.join(","))
        .join("\n");
        const finalCsv = csvHeader + csvString;

        let encodedUri = encodeURI(finalCsv);
        window.open(encodedUri);
    }

    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()

    return (
    <main className='bg-red-100 min-h-auto font-sans m-0 p-0'>
    <Flex justify='space-between'>
        <Flex gap={2}>
            <IconButton 
                onClick={onOpen} 
                colorScheme='red' 
                className='ml-10 mt-10' 
                width={'fit-content'} 
                isActive='true' 
                variant='solid' 
                aria-label='back' 
                icon={<ArrowBackIcon />}
            />
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                    Return to Main Menu
                    </AlertDialogHeader>

                    <AlertDialogBody>
                    Are you done exporting all needed cards? You can't return to this page afterwards.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button colorScheme='red' variant='outline' onClick={() => router.push('/')} ml={3}>
                        Return to Main Menu
                    </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
            <Spacer />
            <Heading className='mt-10'>
                {data['title']}
            </Heading>
        </Flex>
        <Button 
            onClick={exportCards} 
            variant='solid' 
            colorScheme='red' 
            className='mr-10 mt-10'
            isActive='true'
        >
            Export
        </Button>
    </Flex>

    <Accordion allowToggle className='ml-10 mr-10 mt-10'>
    <AccordionItem>
        <h2>
        <AccordionButton>
            <Box as='span' flex='1' textAlign='left'>
                <Text className='font-bold'>Selected Cards</Text>
            </Box>
            <AccordionIcon />
        </AccordionButton>
        </h2>
        <AccordionPanel>
            <SimpleGrid 
                className='m-10'
                spacing={1} 
                templateColumns='repeat(auto-fill, minmax(200px, 1fr))'
            >
                {(cardQueue) ? (cardQueue.map(card => 
                <Card className='p-2 text-center'>
                    <CardHeader>
                        <IconButton size='xs' colorScheme='red' isActive={true} icon={<RemoveIcon />} onClick={() => {handleRemove(card)}} />
                    </CardHeader>
                    <CardBody>
                        <Popover>
                            <PopoverTrigger>
                                <div className='rounded-lg bg-slate-400 hover:bg-opacity-30 bg-opacity-0 p-2'>
                                    <Flex direction='column'>
                                        {(card['keb']) ? 
                                            (<Heading className='text-center'>{card['keb'][0]}</Heading>
                                            ) : (<Heading className='text-center'>{card['reb']}</Heading>)
                                        }
                                        {(card['reb'][1]) ? 
                                            (<Text className='text-center'>{card['reb'].slice(0,-1).map(reb => reb.concat(" / ")).concat(card['reb'].slice(-1))}</Text>
                                            ) : (<Text className='text-center'>{card['reb']}</Text>)
                                        }
                                    </Flex>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent>
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverBody>
                                    {card['sense'].map(sense => <li>{sense.slice(0,-1).map(gloss => gloss.concat("; ")).concat(sense.slice(-1))}</li>)}
                                </PopoverBody>
                            </PopoverContent>
                        </Popover>
                    </CardBody>
                </Card>
                )) : (<div></div>)}
            </SimpleGrid>
        </AccordionPanel>
    </AccordionItem>
    </Accordion>

    <SimpleGrid 
        className='m-10'
        spacing={4}
        columns={4}
    >
        {data['words'].map(word => 
            <Card key={word['id']}>
                <CardHeader>
                    {(word['keb']) ? 
                        (<Flex direction='column' gap='1'>
                            {(word['keb'][1]) ? 
                                (<Popover>
                                    <PopoverTrigger>
                                        <Flex direction='column'><Flex justify='left'><IconButton size='xs' colorScheme='red' isActive={true} icon={<AddIcon />} onClick={() => {handleAdd(word)}} /></Flex><Flex justify='center'><Button width={'fit-content'} variant='solid' isActive={true}><Heading>{word['keb'][0]}</Heading></Button></Flex></Flex>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <PopoverArrow />
                                        <PopoverCloseButton />
                                        <PopoverBody>
                                            <Heading size='md' className='text-center'>{word['keb'].slice(1,-1).map(keb => keb.concat(" / ")).concat(word['keb'].slice(-1))}</Heading>
                                        </PopoverBody>
                                        <PopoverFooter>
                                            <Text className='text-center' fontSize={'xs'}>variants</Text>
                                        </PopoverFooter>
                                    </PopoverContent>
                                </Popover>
                                ) : (<Flex direction='column'><Flex justify='left'><IconButton size='xs' colorScheme='red' isActive={true} icon={<AddIcon />} onClick={() => {handleAdd(word)}} /></Flex><Heading className='text-center'>{word['keb'][0]}</Heading></Flex>)
                            }
                            <Spacer />
                            {word['reb'][1] ? 
                                (<Text className='text-center'>{word['reb'].slice(0,-1).map(reb => reb.concat(" / ")).concat(word['reb'].slice(-1))}</Text>
                                ) : (<Text className='text-center'>{word['reb']}</Text>)
                            }</Flex>): 
                            (<Heading>{word['reb']}</Heading>
                        )} 
                </CardHeader>
                <CardBody>
                    {word['sense'].map(sense => <li>{sense.slice(0,-1).map(gloss => gloss.concat("; ")).concat(sense.slice(-1))}</li>)}
                </CardBody>
            </Card>
        )}
    </SimpleGrid>
    
    <Flex justify='center' gap={1}>
        {(offset == 0) ?
            (<Button
                variant='solid' 
                colorScheme='gray' 
                className='mb-10'
                isActive='true'
            >
                Previous
            </Button>) :
            (<Button
                onClick={() => router.push('/entries/' + id + '?offset=' + (parseInt(offset) - 20).toString())} 
                variant='solid' 
                colorScheme='red' 
                className='mb-10'
                isActive='false'
            >
                Previous
            </Button>)
        }
        {(offset + 20 >= data['words'].length) ?
            (<Button
                onClick={() => router.push('/entries/' + id + '?offset=' + (parseInt(offset) + 20).toString())} 
                variant='solid' 
                colorScheme='red' 
                className='mb-10'
                isActive='false'
            >
                Next
            </Button>) :
            (<Button
                variant='solid' 
                colorScheme='gray' 
                className='mb-10'
                isActive='true'
            >
                Next
            </Button>)
        }
    </Flex>
    </main>
    );
}

export async function getServerSideProps(context) {
    const id = context.query.id
    const offset = context.query.offset
    
    const res = await fetch(`https://sunshelf-back.onrender.com/worddata?_id=${id}&offset=${offset}`)
    const data = await res.json()

    // Pass data to the page via props
    return { props: { data, id, offset } }
}