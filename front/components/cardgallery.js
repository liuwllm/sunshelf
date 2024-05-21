import {
    SimpleGrid, 
    Card, 
    CardBody, 
    CardHeader, 
    Heading, 
    Flex,
    Text,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    IconButton,
    Button,
    Spacer,
} from '@chakra-ui/react';
import AddIcon from '@mui/icons-material/Add';

export default function Alert(props) {
    function handleAdd(word) {
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

    return (
        <SimpleGrid 
            className='m-10'
            spacing={4}
            columns={4}
        >
            {props.words.map(word => 
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
    )
}