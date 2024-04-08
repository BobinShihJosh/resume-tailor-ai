"use client"
import { redirect } from 'next/dist/server/api-utils';
import React from 'react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '../ui/button'
import StatsSection from '../ui/statssection';

const Main: React.FC = () => {
    const title = " ";
    const videoUrl = "/assets/videos/resumeaidemo.mp4";
    const description = " ";


    return (
        <div style={{ textAlign: 'center' }}>
            {/* <h1 style={{ fontSize: '2em', marginBottom: '20px', color: 'black' }}>{title}</h1> */}
            <div style={{ marginBottom: '10px', maxWidth: '1100px', margin: '0 auto', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <video
                    src={videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ width: '100%', borderRadius: '8px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}
                ></video>
            </div>
            <p style={{ fontSize: '1.2em', marginBottom: '25px' }}>{description}</p>
            {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}> */}

            <StatsSection />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <SignedOut>
                    <Link href="/sign-in" passHref>
                        <Button
                            className='btn-55'
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                textDecoration: 'none', // Ensure no underline on Button
                                color: "white"
                            }}

                        >
                            Get Started For Free
                        </Button>
                    </Link>
                </SignedOut>
                <SignedIn>

                    <Link href="/transformations/add/fill" >
                        <Button className='btn-55' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',  fontWeight: 'bold', fontSize: '24px', color: 'white', }}>
                            Start Tailoring!
                        </Button>

                    </Link>

                    {/* <Button className='btn-55' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30%', height: '70%' }}>
                        <Link href="/transformations/add/fill" style={{ textDecoration: 'none', fontWeight: 'bold', fontSize: '34px', color: 'white', width: '100%', textAlign: 'center' }}>
                            Start Tailoring!
                        </Link>
                    </Button> */}
                </SignedIn> 
            </div>
 
        </div>
    );

};

export default Main;
