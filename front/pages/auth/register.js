import { useState } from 'react'
import {
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    List,
    ListItem,
    UnorderedList,

} from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import Logo from './../../public/sunshelflogo.png'

export default function Register(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);
    }
    
    return (
        <main className="bg-red-100 min-h-screen font-sans flex flex-col justify-center items-center">
            <Link href="/">
                <Image 
                    src={Logo}
                    width={375}
                    height={78}
                    alt="Sunshelf Logo"
                />
            </Link>
            <Box 
                bg='white'
                p={10}
                mt={10}
                borderRadius='md'
            >
                <Heading>Register</Heading>
                <form onSubmit={handleSubmit}>
                    <FormControl isRequired>
                        <FormLabel mt={3}>Email</FormLabel>
                        <Input 
                            type="email" 
                            placeholder="address@email.com"
                            onChange={e => setEmail(e.currentTarget.value)} 
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel mt={3}>Password</FormLabel>
                        <Input 
                            type="password" 
                            placeholder="********" 
                            onChange={e => setPassword(e.currentTarget.value)}    
                        />
                    </FormControl>
                    <div className="mt-3">
                        Password must have
                        <UnorderedList>
                            <ListItem>At least 8 characters</ListItem>
                            <ListItem>Upper & lower case letters</ListItem>
                            <ListItem>Numbers</ListItem>
                            <ListItem>Special characters</ListItem>
                        </UnorderedList>
                    </div>
                    {(isLoading) ? 
                        (<Button 
                            isLoading
                            mt={3}
                            colorScheme='red'
                        />) :
                        (<Button 
                            type="submit"
                            mt={3}
                            colorScheme='red'
                        >
                            Register
                        </Button>)
                    }
                </form>
            </Box>
        </main>
    )
}