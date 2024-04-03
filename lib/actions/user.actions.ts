"use server";

import { revalidatePath } from "next/cache";

import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import OpenAI from "openai";
import { string } from "zod";

// CREATE
export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase();

    const newUser = await User.create(user);

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
}

// READ
export async function getUserById(userId: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId: userId });
    // console.log("getUserById: ", userId )
    // console.log(" actual user: ", user)
    if (!user) throw new Error("User not found");

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error("User update failed");

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
  }
}

// USE CREDITS
export async function updateCredits(userId: string, creditFee: number) {
  try {
    await connectToDatabase();

    const updatedUserCredits = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { creditBalance: creditFee } },
      { new: true }
    )

    if (!updatedUserCredits) throw new Error("User credits update failed");

    return JSON.parse(JSON.stringify(updatedUserCredits));
  } catch (error) {
    handleError(error);
  }
}

// ADD Job Description
export async function updateJobDescription(userId: string, jobDes: string) {
  try {
    await connectToDatabase();

    const updatedJobDes = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { jobDescription: jobDes } },
      { new: true }
    )

    if (!updatedJobDes) throw new Error("User job description update failed");

    return JSON.parse(JSON.stringify(updatedJobDes));
  } catch (error) {
    handleError(error);
  }
}

export async function uploadResume(userId: string, resume: string) {
  try {
    await connectToDatabase();
    console.log("uploading resume", userId)
    const updatedResume = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { completeResume: resume } },
      { new: true }
    )

    if (!updatedResume) throw new Error("User resume update failed");

    return JSON.parse(JSON.stringify(updatedResume));

  } catch (error) {
    handleError(error);
  }
}

const openai = new OpenAI();

export async function tailorSubSection(userId: string, subSection: string, subName: string) {

  const user = await getUserById(userId);

  const jobDesText = user.jobDescription
 
  const rephrasedSection = await openai.chat.completions.create({
    messages: [
      { "role": "system", "content": `You are an assistant that will tailor a resume ${subName} description to the given job description.` },
      { "role": "user", "content": `Here's the description from resume ${subName} ${subSection}. Rephrase the description(Keep the same format, i.e bullet point) to fit the job description given here ${jobDesText}.  remember this is for a resume so concise and to the point. Don't hallunicate, based on given bullet points, rephrase to use the tools, skills and technologies mentioned in job description. Don't delete the given bullet points, only improve it and add new ones by giving example of an accomplishment. Use this sentence structure(with different words): Implemented... by utilizing...(technology)...achieved...(results, include a made up metric/stat). Keep the headings, i.e Company, role, date, project, if they exist intact.`},
    ],
    model: "gpt-3.5-turbo",
  });

  const rephrasedSkills = await openai.chat.completions.create({
    messages: [
      { "role": "system", "content": `You are an assistant that will tailor a resume ${subName} description to the given job description.` },
      { "role": "user", "content": `Here's the description from resume ${subName} ${subSection}. Keeping the same format, add to the list by finding all relevent skills/technologies/frameworks/libraries in job description ${jobDesText}.`},
    ],
    model: "gpt-3.5-turbo",
  });

  const reSubsection = subName == 'skills' ? rephrasedSkills.choices[0]?.message.content || "" : rephrasedSection.choices[0]?.message.content || ""; 
  const tailoredSection = {
    subSection: reSubsection,
  };
  return tailoredSection
}

export async function tailorResume(userId: string) {
  try {

    // Get resume and job description
    const user = await getUserById(userId);

    const resumeText = user.completeResume
    const jobDesText = user.jobDescription

    const getSection = async (sectionPrompt: string, sectionAction: string) => {
      const sectionResponse = await openai.chat.completions.create({
        messages: [
          { "role": "system", "content": `You are an assistant that given a resume will extract ${sectionPrompt} info` },
          { "role": "user", "content": `Here's the resume \n${resumeText}. Leave the content exactly as it is, but extract the ${sectionPrompt} section. For ${sectionPrompt}, ${sectionAction}.` },
        ],
        model: "gpt-3.5-turbo",
      });

      return sectionResponse.choices[0]?.message.content || "";
    };

    const skillsText = await getSection("skills", ` Your response only contains original information from the given resume. don't include titles or headings such as "skills" just go straight to the content.`);
    const workExpText = await getSection("work experience", `Divide work experience section into subsections prefixed by "Company: ", "Role: ", "Date: ", "Description: ".  If you can't find any related info leave it blank.  Your response only contains the prefixes and original information from the given resume.`);
    const projectExperienceText = await getSection("project experience", `Divide project experience section into subsections prefixed by "Project: ", "Description: " If you can't find any related info leave it blank. Your response only contains the prefixes and original information from the given resume. `);

    // Create a JSON object with the gathered information
    const resumeSections = {
      skills: skillsText,
      workExperience: workExpText,
      projectExperience: projectExperienceText,
    };

    console.log(resumeSections);
    // const workExperienceText: string = workExperience.choices[0]?.message.content || "";

    const tailorSection = async (sectionName: string, sectionData: string, sectionFormat: string) => {
      const sectionResponse = await openai.chat.completions.create({
        messages: [
          { "role": "system", "content": `You are an assistant that tailors given resume ${sectionName} section based on a given job description.` },
          { "role": "user", "content": `Here's the ${sectionName} section of the resume \n${sectionData}. Here's the job description \n${jobDesText}. Now based on the job description tailor the description part of the ${sectionName}(should be prefixed by "description: " and each subection work experience's bullet point to reflect the job description. Take what the existing accomplishments in each bullet point and re-phrase it in a way that uses the relevent technologies in the job description. Each work experience subsection output should look like this example ${sectionFormat}, with only the "description: " part being changed. for descriptions only be concise and to the point. Based on given bullet points, rephrase to use the tools, skills and technologies mentioned in job description. Don't delete the given bullet points, only improve it and add new ones by giving example of an accomplishment. Use this sentence structure(with different words): Implemented... by utilizing...(technology)...achieved...(results, include a made up metric/stat) ` },
        ],
        model: "gpt-3.5-turbo",
      });

      return sectionResponse.choices[0]?.message.content || "";
    };

    const tailorSkills = async (sectionName: string, sectionData: string) => {
      const sectionResponse = await openai.chat.completions.create({
          messages: [
              {"role": "system", "content": `You are an assistant that tailors given resume skills section based on a given job description. `},
              {"role": "user", "content": `Here's the skills section of the resume \n${sectionData}. Here's the job description \n${jobDesText}. Now based on the job description find all the frameworks/libraries/programing languages/databases/technologies needed and add that to the skills section that already exists. don't include titles or headings such as "tailored/additional skills" just go straight to the content. `},
          ],
          model: "gpt-3.5-turbo",
      });

      return sectionResponse.choices[0]?.message.content || "";
  };

    const tailSkills = await tailorSkills("skills",  resumeSections.skills);
    const tailWork = await tailorSection("work experience", resumeSections.workExperience, 'Company: example company Inc.\n' + 'Role: example role\n' + 'Date: 06/2023 - 09/2023\n' + 'Description:\n' + '- example work exp bullet point 1 \n' + '- example work exp bullet point 2 \n' + '- example work exp bullet point 3 \n');
    
    const tailProject = await tailorSection("project experience",  resumeSections.projectExperience, 'Project: example project\n' + 'Description: \n' + '- example project bullet point 1 \n' + '- example project bullet point 2 \n' + '- example project bullet point 3 \n');

    // Create a JSON object with the tailored resume information
    const tailoredResumeSections = {
      skills: tailSkills,
      workExperience: tailWork,
      projectExperience: tailProject,
    };

    console.log("==============================\n")
    console.log(tailoredResumeSections)

    return tailoredResumeSections
  } catch (error) {
    handleError(error);
  }
}