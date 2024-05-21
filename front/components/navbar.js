import {
    Flex,
    Spacer,
    Heading,
    Button,
} from '@chakra-ui/react';
import Alert from '@/components/alert';

export default function Navbar(props) {
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
                card['keb'].join("/"),
                card['reb'].join("/"),
                card['sense'].map((sense) => sense.join("/")).join("; ")
            ])
        ].map(e => e.join(","))
        .join("\n");
        const finalCsv = csvHeader + csvString;

        let encodedUri = encodeURI(finalCsv);
        window.open(encodedUri);
    }

    return(
        <Flex justify='space-between'>
            <Flex gap={2}>
                <Alert />
                <Spacer />
                <Heading className='mt-10'>
                    {props.title}
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
    )
}