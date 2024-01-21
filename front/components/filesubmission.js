import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Input,
    InputGroup,
    InputLeftAddon,
    Flex,
} from '@chakra-ui/react'
import AddIcon from '@mui/icons-material/Add';
import { router } from 'next/router'

export default function FileUploadPage(){
    const [selectedFile, setSelectedFile] = useState();
    const [title, setTitle] = useState("Untitled");
    const [errorMsg, setErrorMsg] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const changeHandler = (event) => {
      setSelectedFile(event.target.files[0]);
    };

    const titleChangeHandler = (event) => {
        setTitle(event.target.value)
    }
  
    const handleSubmission = () => {
        setIsLoading(true);
        const MAX_FILE_SIZE = 5242880

        if (!selectedFile) {
            setErrorMsg("Choose a file.")
            return
        }
        if (selectedFile.size > MAX_FILE_SIZE) {
            setErrorMsg("File size is too big! Max: 5MB")
            return
        }

        setErrorMsg("");

        var formdata = new FormData();
        formdata.append("file", selectedFile);
        formdata.append("title", title)
        
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        fetch("https://sunshelf-back.onrender.com/textupload", requestOptions)
            .then(response => response.json())
            .then(result => router.push('/entries/' + result['_id'] + '?offset=0'))
            .catch(error => console.log('error', error));
    };

    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <Flex>
                <Button 
                    colorScheme='red'
                    variant='solid'
                    leftIcon={<AddIcon />}
                    className='mt-10 ml-10'
                    isActive='true'
                    onClick={onOpen}
                >
                    Upload new file
                </Button>
            </Flex>
            
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Select a file to add</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                    <div className="pl-10">
                        <InputGroup className='mb-5'>
                            <InputLeftAddon children='Title'/>
                            <Input onChange={titleChangeHandler} placeholder='Untitled' />
                        </InputGroup>
                        <input className='mb-5' type="file" name="file" id='upload-text' onChange={changeHandler} />
                        <p className='text-red-500'>{errorMsg}</p>
                    </div>
                    </ModalBody>

                    <ModalFooter>
                        {(isLoading) ?
                            (<Button 
                                isLoading
                                colorScheme='red'
                                variant='outline'>
                                Submitting
                            </Button>
                            ) :
                            (<Button
                                colorScheme='red'
                                variant='outline'
                                onClick = {handleSubmission}>
                                    Submit
                            </Button> )
                        }
                        <Button
                            className='ml-3'
                            colorScheme='red'
                            variant='outline' 
                            onClick = {onClose}>
                                Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}