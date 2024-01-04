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
    Checkbox,
    Spacer,
} from '@chakra-ui/react'
import { useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { router } from 'next/router';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function Post({ data }) {
    const [selectedCards, setSelectedCards] = useState([])
    
    function handleCheck(word) {
        if (selectedCards.length < 1) {
            setSelectedCards([word])
        }
        else if (!selectedCards.includes(word)){
            setSelectedCards(selectedCards => [...selectedCards, word])
        }
        else if (selectedCards.includes(word)){
            setSelectedCards(selectedCards.filter((card) => {return card !== word}))
        }
    }

    function exportCards() {
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
                card.sense.map((sense) => sense.join("/")).join("|")
            ])
        ].map(e => e.join(","))
        .join("\n");
        const finalCsv = csvHeader + csvString;

        let encodedUri = encodeURI(finalCsv);
        window.open(encodedUri);
    }

    return (
    <main className='bg-red-100 min-h-screen font-sans'>
    <Flex direction='column'>
    
    <Flex justify='space-between'>
    <Flex gap={2}>
        <IconButton onClick={() => router.push('/')}colorScheme='red' className='ml-10 mt-10' width={'fit-content'} variant='ghost' aria-label='back' icon={<ArrowBackIcon />}/>
        <Spacer />
        <Heading className='mt-10'>
            {data['title']}
        </Heading>
        <Spacer />
        <IconButton colorScheme='red' size='xs' className='mt-12' width={'fit-content'} variant='ghost' aria-label='edit' icon={<EditIcon fontSize='small' />}/>
    </Flex>
    <Button onClick={exportCards} variant='ghost' colorScheme='red' className='mr-10 mt-10'>Export</Button>
    </Flex>
    </Flex>
    <SimpleGrid 
                    className='m-10'
                    spacing={4}
                    columns={4}>
        {data['words'].map(word => 
            <Card>
                <CardHeader>
                    {(word['keb']) ? 
                        (<Flex direction='column' gap='1'>
                            {(word['keb'][1]) ? 
                                (<Popover>
                                    <PopoverTrigger>
                                        <Flex direction='column'><Checkbox onChange={() => {handleCheck(word)}}></Checkbox><Flex justify='center'><Button width={'fit-content'} variant='solid'><Heading>{word['keb'][0]}</Heading></Button></Flex></Flex>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <PopoverArrow />
                                        <PopoverCloseButton />
                                        <PopoverBody>
                                            <Heading size='md' className='text-center'>{word['keb'].slice(1,-1).map(keb => keb.concat(" / ")).concat(word['keb'].slice(-1))}</Heading>
                                            E                    </PopoverBody>
                                        <PopoverFooter>
                                            <Text className='text-center' fontSize={'xs'}>variants</Text>
                                        </PopoverFooter>
                                    </PopoverContent>
                                </Popover>
                                ) : (<Flex direction='column'><Checkbox onChange={() => {handleCheck(word)}}></Checkbox><Heading className='text-center'>{word['keb'][0]}</Heading></Flex>)
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
    </main>
    );
}

export async function getServerSideProps(context) {
    console.log(context.query)

    const id = context.query.id
    const offset = context.query.offset

    const res = await fetch(`http://localhost:5000/worddata?_id=${id}&offset=${offset}`)
    const data = await res.json()
   
    
    console.log(data)


    // Pass data to the page via props
    return { props: { data } }
}