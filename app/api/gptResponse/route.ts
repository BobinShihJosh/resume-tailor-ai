import { NextRequest, NextResponse } from 'next/server'; // To handle the request and response
import { tailorResume } from "@/lib/actions/user.actions";

export async function POST(req: NextRequest) {
    const formData: FormData = await req.formData();
    const uploadedFiles = formData.getAll('filepond');
    const userId = formData.get('userId') as string;
    let fileName = '';
    let parsedText = '';

    if (uploadedFiles && uploadedFiles.length > 0) {
        
    } else {
        console.log('No files found.');
    }


    const response = new NextResponse(parsedText);
    response.headers.set('FileName', fileName);
    return response;
}