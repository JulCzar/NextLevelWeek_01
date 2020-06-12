import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'

import { FiUpload } from 'react-icons/fi'

import './styles.css'

const Dropzone = ({ onUpload }) => {
  const [selectedFileUrl, setSelectedFileUrl] = useState('')
  
  const onDrop = useCallback(acceptedFiles => {
    const [ file ] = acceptedFiles

    const fileUrl = URL.createObjectURL(file)

    setSelectedFileUrl(fileUrl)
    onUpload(file)
  }, [onUpload])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*'
  })

  return (
    <div className='dropzone' {...getRootProps()}>
      <input {...getInputProps()} accept='image/*'/>

      { selectedFileUrl
        ? <img src={selectedFileUrl} alt='Point Thumbnail'></img>
        : (
          <p>
            <FiUpload/>
            Imagem do Estabelecimento
          </p>
      )} 
      
    </div>
  )
}

export default Dropzone