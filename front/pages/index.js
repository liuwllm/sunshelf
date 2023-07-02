import React, { useState } from 'react'
import { Inter } from 'next/font/google'
import axios from 'axios'

const inter = Inter({ subsets: ['latin'] })

export default function FileUploadPage(){
  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState(false);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    console.log(event.target.files)
    setIsSelected(true);
  };

  const handleSubmission = () => {

    const formData = new FormData();

    formData.append('file', selectedFile);

    axios.post('http://localhost:5000/textupload', formData, {
      timeout: 5000,
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    .then((response) => response.json())
    .then((result) => {
      console.log('Success:', result);
    })
    .catch((error) => {
      console.log("Hi");
    });
  };

  return (
    <div>
      <input type="file" name="file" onChange={changeHandler} />
      {isSelected ? (
        <div>
          <p>Filename: {selectedFile.name} </p>
          <p>File type: {selectedFile.type} </p>
          <p>Size in bytes: {selectedFile.size} </p>
          <p>
            lastModifiedDate: {' '}
            {selectedFile.lastModifiedDate.toLocaleDateString()}
          </p>
        </div>
      ) : (
        <p>Select a file to show details</p>
      )}
      <div>
        <button onClick={handleSubmission}>Submit</button>
      </div>
    </div>
  )
}
