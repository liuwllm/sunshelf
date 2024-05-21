import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure,
    Button,
    IconButton,
} from '@chakra-ui/react';
import { router } from 'next/router';
import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Alert() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()

    return(
        <>
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
        </>
    )
}