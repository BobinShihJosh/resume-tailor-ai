import Header from '@/components/shared/Header';
// import TransformationForm from '@/components/shared/TransformationForm';
import { transformationTypes } from '@/constants'
import { getUserById } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
// import { JobDesForm } from '@/components/shared/JobDesForm';
import { ResumeDrop } from '@/components/shared/ResumeDrop';
import { FileUpload } from '@/components/shared/FileUpload'

const AddTransformationTypePage = async ({ params: { type } }: SearchParamProps) => {
  const { userId } = auth();
  const transformation = transformationTypes[type];

  if (!userId) redirect('/sign-in')

  const user = await getUserById(userId);

  return (
    <>
      <Header
        title={transformation.title}
        subtitle={transformation.subTitle}
      />
      <div style={{ display: 'flex', flexDirection: 'row',  width: '100%'  }}>
        <section className="mt-10 mr-10" style={{ width: '50%' }}>
          {/* <JobDesForm
            action="Add"
            userId={user._id}
            type={transformation.type as TransformationTypeKey}
            creditBalance={user.creditBalance}
          /> */}
          <FileUpload></FileUpload>
        </section>
        <section className="mt-10 ml-10 " style={{ width: '50%' }}>
          <ResumeDrop 
            action="Add"
            userId={user._id}
            type={transformation.type as TransformationTypeKey}
            creditBalance={user.creditBalance}/>
        </section>
      </div>
    </>
  )
}

export default AddTransformationTypePage