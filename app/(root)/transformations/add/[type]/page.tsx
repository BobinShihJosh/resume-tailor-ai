import Header from '@/components/shared/Header';
// import TransformationForm from '@/components/shared/TransformationForm';
import { transformationTypes } from '@/constants'
import { getUserById } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { JobDesForm } from '@/components/shared/JobDesForm';
import { ResumeDrop } from '@/components/shared/ResumeDrop';
import { FileUpload } from '@/components/shared/FileUpload'
import ResumeTailor from '@/components/shared/ResumeTailor';

const AddTransformationTypePage = async ({ params: { type } }: SearchParamProps) => {
  const { userId } = auth();
  const transformation = transformationTypes[type];

  if (!userId) redirect('/sign-in')

  const user = await getUserById(userId);

  return (
    <>
       {/* <div style={{ textAlign: 'center', paddingBottom: '20px', paddingLeft: '420px' }}> 
    <Header
      title={transformation.title}
      subtitle={transformation.subTitle}
    />
  </div> */}
      <section >
        <ResumeTailor
          action="Add"
          userId={user._id}
          clerkId={userId}
          type={transformation.type as TransformationTypeKey}
          creditBalance={user.creditBalance}
        />
      </section>
    </>
  )
}

export default AddTransformationTypePage