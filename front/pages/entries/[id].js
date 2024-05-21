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
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box
} from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Navbar from '@/components/navbar';
import Navbuttons from '@/components/navbuttons';

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

    return (
    <main className='bg-red-100 min-h-auto font-sans m-0 p-0'>
    <Navbar title={data['title']} />

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
    <Navbuttons words={data['words']} id={id} offset={offset} />
    </main>
    );
}

export async function getServerSideProps(context) {
    const id = context.query.id
    const offset = context.query.offset
    
    const res = await fetch(`http://localhost:5000/worddata?_id=${id}&offset=${offset}`)
    const data = await res.json()

    // Pass data to the page via props
    return { props: { data, id, offset } }
}