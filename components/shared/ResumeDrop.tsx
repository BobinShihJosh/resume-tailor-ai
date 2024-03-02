'use client'

import { useEffect, useState, useTransition } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
// import { PDFExtract, PDFExtractOptions } from 'pdf.js-extract';

export function ResumeDrop({ action, data = null, userId, type, creditBalance, config = null }: TransformationFormProps) {
    const [file, setFile] = useState<File | undefined>();
    const [isPending, startTransition] = useTransition()
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'pdf': ['.pdf'],
        },
        onDrop: (acceptedFiles) => {
            if (acceptedFiles && acceptedFiles.length > 0) {
                setFile(acceptedFiles[0]);
            }
        },
    });

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) return;

        try {
            // const data = new FormData();
            // data.set('file', file);

            // const pdfExtract = new PDFExtract();
            // const options: PDFExtractOptions = {}; /* see below */
            // pdfExtract.extract('test.pdf', options)
            //     .then(data => console.log(data))
            //     .catch(err => console.log(err));

            // startTransition(async () => {
            //     await uploadResumeText(userId, "")
            //   })
        } catch (e: any) {
            // Handle errors here
            console.error(e);
        }
    };


    // Helper function to parse PDF data to text using pdf2json


    return (

        <form onSubmit={onSubmit}>
            <p style={{ fontSize: '18px', marginBottom: "30px" }}>
                <span style={{ fontSize: '34px', fontWeight: 'bold' }}>2. </span> Upload your resume in PDF format:
            </p>
            <div {...getRootProps()} style={{ marginBottom: '33px', border: '2px dashed #ccc', padding: '20px', borderRadius: '4px', textAlign: 'center', cursor: 'pointer', height: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <input {...getInputProps()} />
                <p style={{ margin: 0 }}>Drag and drop a PDF file here, or click to select one</p>
            </div>
            <Button type="submit" style={{ width: '100%' }}>Submit</Button>
        </form>
    );
}
