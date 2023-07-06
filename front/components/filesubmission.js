import { Flex, Spacer } from '@chakra-ui/react'
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
    IconButton,
    Button,
} from '@chakra-ui/react'
import AddIcon from '@mui/icons-material/Add';

export default function FileUploadPage(){
    const [selectedFile, setSelectedFile] = useState();
    const [isSelected, setIsSelected] = useState(false);
  
    const changeHandler = (event) => {
      setSelectedFile(event.target.files[0]);
      setIsSelected(true);
    };
  
    const handleSubmission = () => {
      var formdata = new FormData();
      formdata.append("file", selectedFile);
      
      var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
      };
      
      fetch("http://localhost:5000/textupload", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    
      onClose();
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
                        <input type="file" name="file" id='upload-text' onChange={changeHandler} />
                    </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme='red'
                            variant='outline'
                            onClick = {handleSubmission}>
                                Submit
                        </Button>    
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