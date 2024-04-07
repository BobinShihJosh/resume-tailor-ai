"use client"
import { redirect } from 'next/dist/server/api-utils';
import React from 'react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '../ui/button'
const Main: React.FC = () => {
    const title = "Resume Tailor";
    const videoUrl = "/assets/videos/resumeaidemo.mov";
    const description = "Welcome to Resume Tailor! This application helps you create and tailor your resumes for job applications.";


    const handleGetStarted = () => {
    };

    return (
        <div style={{ textAlign: 'center', }}>
            <h1 style={{ fontSize: '2em', marginBottom: '20px', color: 'black' }}>{title}</h1>
            <div style={{ marginBottom: '40px', maxWidth: '1100px', margin: '0 auto' }}>
                <video
                    src={videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ width: '100%', borderRadius: '8px' }}
                ></video>

            </div>
            <p style={{ fontSize: '1.2em', marginBottom: '40px' }}>{description}</p>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                 
                    <SignedOut>
                        <Button className='btn-55' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30%',  }}>
                            <Link href="/sign-in" style={{ textDecoration: 'none', color: 'inherit', width: '100%', textAlign: 'center' }}>
                                Get started
                            </Link>
                        </Button>
                    </SignedOut> 
            </div>

        </div>
    );
};

export default Main;
