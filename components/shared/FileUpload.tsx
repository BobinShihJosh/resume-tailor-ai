'use client';
// Import necessary modules and components
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import { useState, useRef } from 'react';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import { Button } from "@/components/ui/button";

// Register the necessary plugins (e.g., FilePondPluginFileEncode)
// Make sure to install the required plugins using npm or yarn
registerPlugin(FilePondPluginFileValidateType); 

export function FileUpload({ action, data = null, userId, type, creditBalance, config = null }: TransformationFormProps) {
  const filePondRef = useRef(null);

  const handleFileUpload = async () => {
    // Get the current FilePond instance
    const filePondInstance = filePondRef.current;
    if (filePondInstance) {
      // Get the list of files currently added to FilePond
      const files = filePondInstance.getFiles();
      // Manually process and upload files using the FilePond server
      try {
        const response = await filePondInstance.processFiles(files);
        console.log("upload success")
      } catch (error) {
        console.error('Error uploading files:', error);
      }
    }
  };
  

  return (
    <div >
      <p style={{ fontSize: '18px', marginBottom: "30px" }}>
                <span style={{ fontSize: '34px', fontWeight: 'bold' }}>2. </span> Upload your resume in PDF format:
            </p>
      <FilePond
        ref={filePondRef}
        server={{
          process: {
            url: '/api/upload',
            method: 'POST',
            withCredentials: false,
            ondata: (formData) => {
              // Append additional data to the FormData object
              formData.append('userId', userId);
              console.log("Data", userId)
              // Return the modified FormData object
              return formData;
            },
          },
        }}
        maxFiles={1}
        instantUpload={false}
        acceptedFileTypes={['application/pdf']}
        labelIdle='Drag & Drop your Resume or <span class="filepond--label-action">Browse</span>'
        onprocessfiles={() => {
          // Handle files when they are processed/uploaded
          console.log('Files processed/uploaded');
        }}
      /> 
      <Button type="submit" style={{ width: '100%', marginTop:'18px' }} onClick={handleFileUpload}>Submit</Button>

    </div>
  );
}
