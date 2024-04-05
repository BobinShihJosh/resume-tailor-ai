// Import necessary modules and functions
import { NextRequest, NextResponse } from 'next/server';
import { tailorSubSection, getUserById } from "@/lib/actions/user.actions";
import OpenAI from "openai";

// export const runtime = "edge"
const openai = new OpenAI();

// Define the POST function for your API route
export async function POST(req: NextRequest) {
    try {
        // Extract necessary data from the request body
        const { userId, subSection, subName } = await req.json();

        // Call the tailorSubSection function to process the data
        const completeSubsection = await tailorSubSection(userId, subSection, subName);

        // Return the processed data in the response
        return NextResponse.json(completeSubsection); 
    } catch (error) {
        // Handle errors gracefully and return appropriate response
        console.error('Error occurred:', error);
        return NextResponse.error(); 
    }
}
