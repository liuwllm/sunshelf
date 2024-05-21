import {
    SimpleGrid, 
    Card, 
    CardBody, 
    CardHeader, 
    Heading, 
    Flex,
    Text,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
    IconButton,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import RemoveIcon from '@mui/icons-material/Remove';

export default function Alert() {
    const [cardQueue, setCardQueue] = useState([]);

    useEffect(() => {
        setCardQueue(JSON.parse(localStorage.getItem('cards')));
        window.addEventListener('storage', () => setCardQueue(JSON.parse(localStorage.getItem('cards'))));
    }, []);

    function handleRemove(word) {
        const cards = JSON.parse(localStorage.getItem('cards'));
        localStorage.setItem('cards', JSON.stringify(cards.filter((card) => {return card['id'] !== word['id']})));
        window.dispatchEvent(new Event("storage"));
    }

    return(
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
    )
}