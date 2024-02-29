import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import Header from "@/components/shared/Header";
import { JobDesForm } from "@/components/shared/JobDesForm";
import { transformationTypes } from "@/constants";
import { getUserById } from "@/lib/actions/user.actions";

const Page = async ({ params: { id } }: SearchParamProps) => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  // const user = await getUserById(userId);
  // const image = await getImageById(id 
  return (
    <> 
      <section className="mt-10">
        {/* <JobDesForm  /> */}
      </section>
    </>
  );
};

export default Page;