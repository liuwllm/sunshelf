import {
    Flex,
    Button,
} from '@chakra-ui/react';
import { router } from 'next/router';

export default function Navbuttons(props) {
    return(
        <Flex justify='center' gap={1}>
            {(props.offset == 0) ?
                (<Button
                    variant='solid' 
                    colorScheme='gray' 
                    className='mb-10'
                    isActive='true'
                >
                    Previous
                </Button>) :
                (<Button
                    onClick={() => router.push('/entries/' + props.id + '?offset=' + (parseInt(props.offset) - 20).toString())} 
                    variant='solid' 
                    colorScheme='red' 
                    className='mb-10'
                    isActive='false'
                >
                    Previous
                </Button>)
            }
            {(props.offset + 20 >= props.words.length) ?
                (<Button
                    onClick={() => router.push('/entries/' + props.id + '?offset=' + (parseInt(props.offset) + 20).toString())} 
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
    )
}