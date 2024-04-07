
import React from 'react'
import Header from '@/components/shared/Header';
// import TransformationForm from '@/components/shared/TransformationForm';
import { transformationTypes } from '@/constants'
import { getUserById } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { JobDesForm } from '@/components/shared/JobDesForm';
import { ResumeDrop } from '@/components/shared/ResumeDrop';
import { FileUpload } from '@/components/shared/FileUpload'
import Main from '@/components/shared/Main';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import ResumeTailor from '@/components/shared/ResumeTailor';
import dynamic from 'next/dynamic'; 

const Home = async () => { 
  // const { userId } = auth(); 

  // if (!userId) {
  //   return (
  //     <Main
  //       />
  //   )
  // }

  // const user = await getUserById(userId);
  return (
    <div>
      {/* <p>Home</p>
      <UserButton afterSignOutUrl='/'/> */}
      <section >
        {/* <SignedOut><Main
        /></SignedOut> */}
        <Main 
        />
        {/* <SignedIn><ResumeTailor
          action="Add"
          userId={user?._id}
          clerkId={userId}
          type={'restore' as TransformationTypeKey}
          creditBalance={user?.creditBalance}
        /></SignedIn>  */}

      </section>
    </div>
  )
}

export default Home