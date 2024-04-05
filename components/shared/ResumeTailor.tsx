"use client"

import { useState, useEffect } from 'react';

import { JobDesForm } from '@/components/shared/JobDesForm';
import { FileUpload } from '@/components/shared/FileUpload';
import { Button } from "@/components/ui/button"
import { CookieIcon } from '@radix-ui/react-icons'
import { getUserById, tailorResume, splitSections } from "@/lib/actions/user.actions"
import ShowResult from './ShowResult';
import TestAI from './TestAI';
import { useChat } from 'ai/react';

import Completion from './Completion';
// import { jellyTriangle } from 'ldrs';
// jellyTriangle.register()
if (typeof window !== 'undefined') {
  import('ldrs').then(({ jellyTriangle }) => {
    jellyTriangle.register();
  }).catch(error => {
    console.error('Failed to import ldrs:', error);
  });
}

interface ResumeSections {
  skills: string;
  workExperience: string[];
  projectExperience: string[];
}
const ResumeTailor = ({ action, data = null, userId, clerkId, type, creditBalance, config = null }: TransformationFormProps) => {

  const [jobDesFormCompleted, setJobDesFormCompleted] = useState(false);
  const [fileUploadCompleted, setFileUploadCompleted] = useState(false);
  const [jobDesForm, setJobDesForm] = useState("");
  const [fileUpload, setFileUpload] = useState("");
  const { messages, input, append, handleInputChange, handleSubmit } = useChat();
  const [showOriginal, setShowOriginal] = useState(true);
  const [newestMessage, setNewestMessage] = useState<any>(null); // Update with the correct type for newestMessage

  const [resumeSections, setResumeSections] = useState<{
    skills: string;
    workExperience: string[];
    projectExperience: string[];
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const handleJobDesFormCompletion = () => {
    setJobDesFormCompleted(true);
  };

  const handleFileUploadCompletion = () => {
    setFileUploadCompleted(true);
  };
  const canParse = (jobDesFormCompleted && fileUploadCompleted);

  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [prevLoadingTextIndex, setPrevLoadingTextIndex] = useState(-1); // Initialize with an invalid index

  const loadingTexts = [
    "Did you know? Around 75% of resume gets filtered out from ATS keyword filtering.",
    "Ensure your resume gets past ATS filters and into the hands of recruiters with our assistance.",
    "Beat ATS and land interviews with our optimized resume crafting service.",
    "You've prepared too hard for interviews for your resume to get filtered out by a bot.",
    "Tailoring each resume manually is too much work, let AI do it for you."
  ];
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeOut(true);
      setTimeout(() => {
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * loadingTexts.length);
        } while (newIndex === prevLoadingTextIndex); // Ensure the new index is different from the previous one
        setLoadingTextIndex(newIndex);
        setPrevLoadingTextIndex(newIndex);
        setFadeOut(false);
      }, 500); // Delay text change for 0.5 seconds (500 milliseconds)
    }, 5000); // Change text every 5 seconds (5000 milliseconds)

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [prevLoadingTextIndex]);

  const handleButtonClick = async () => {
    // const completeResume = {
    //   skills: '**Programming Languages**: C/C++, Python, Javascript, Java, SQL, SystemVerilog, HTML/CSS\n' +
    //     '\n' + '**Libraries/Frameworks**: React.js, node.js, npm, Express, django, PostgreSQL, AWS, Docker, PyTorch\n' +
    //     '\n' + '**Tools/Protocols**: TCP/IP, Routing(BGP, OSPF), Arduino, Git, CI/CD, CUDA, RTOS, JIRA\n' +
    //     '\n' + 'These skills cover a range of programming languages, frameworks, libraries, and tools commonly used in software engineering and development roles.',
    //   workExperience:
    //     ['Company: Arista Networks Inc.\n' +
    //       'Role: Software Engineer Intern\n' +
    //       'Date: 06/2023 - 09/2023\n' +
    //       'Location: Santa Clara, CA\n' +
    //       'Description: ' +
    //       '•Implemented and shipped a production feature that enables customers to hide their network traﬀic(bridged) within segments(Subnets/Vlans/Ips) decreasing the risk of data ex-filtration and eavesdropping.(C++, GDB)\n' +
    //       '•Enhanced network diagnostic capabilities for customers by developing a dynamic database that maintains a network logical port ID to interface ID mapping, improving interface ID lookup time by 10x.\n' +
    //       '\n',
    //     'Company: Garmin Ltd.\n' +
    //     'Role: Software Engineer\n' +
    //     'Date: 01/2021 - 08/2022\n' +
    //     'Location: Remote\n' +
    //     'Description: ' +
    //     '•Led the development of 2 features: Voice Assistant and Bluetooth-Calling on Smartwatch (APAC version), allowing customers to voice-command basic actions and answer phone calls on their watches.(C++)\n' +
    //     '•Enhance the eﬀiciency of the on-device voice assistant by decreasing its activation latency by 130% through a redesign of task scheduler.(C/C++)\n' +
    //     '•Expanded market access to users of HuaWei, Oppo, and Vivo phone users by creating a wrapper around android’s bluetooth manager to detect and correct BT signals allowing on-device Bluetooth Voice-Assistant to work on these phones.(C++)\n' +
    //     '\n',
    //     'Company: Peel Solutions Inc.\n' +
    //     'Role: Co-Founder & CTO\n' +
    //     'Date: 10/2022 - Present\n' +
    //     'Location: Seattle, WA\n' +
    //     'Description: •Co-founded a social media wellness company that provides a platform for extroverts to offer conversation as a service to introverts where they can access on-demand personalized conversations through conversation topics and styles.(50+ Users)\n' +
    //     '•Built a full-stack mobile private chat app (React, Node.js, Firebase) featuring a pay-to-chat model using Stripe API, user recommendation, and user authentication systems.(Javascript/Typescript)'],
    //   projectExperience: ['Project: Natural Language 2 Bash (Demo, Code) - 03/2023\n' +
    //     '  - Trained a model that generates Linux bash commands from English text input by finetuning large language models (BERT, GPT, T5) using custom data-set generated from GPT-3.5-Turbo. Technologies used include PyTorch, Pandas.\n' +
    //     '\n',
    //   'Project: GPT Voice Assistant (Demo, Code) - 03/2023\n' +
    //   '  - Built a mobile chatbot powered by GPT3.5Turbo API and text2Speech function using phone speakers. Technologies used include React Native, Node.js, Firebase.\n' +
    //   '\n',
    //   'Project: Smart Image Captioner - 11/2022\n' +
    //   '  - Created an end-to-end image captioning system by training an Encoder-Decoder model on the MS COCO dataset. Technologies used include CUDA, PyTorch.\n' +
    //   '\n',
    //   'Project: Data Hiding in Robot Cars (Demo, Code) - 01/2020\n' +
    //   '  - Designed and prototyped a secure wireless communication method for autonomous robot cars using steganographic methods in an adaptive cruise control scenario in simulation. Technologies used include Python, OOP.']
    // }
    // setResumeSections(completeResume || null);
    if (canParse) {
      // Asynchronous operation (e.g., API call, fetching data, etc.)
      // setLoading(true);
      try {
        if (clerkId !== null) {
          // const completeResume = await tailorResume(clerkId);
          // const completeResume = null;
          try {
            const user = await getUserById(clerkId);
            const jobD = user.jobDescription;
            const res = user.completeResume;
            setShowOriginal(true);
            // setJobDesForm(user.jobDescription);
            // setFileUpload(" give me a insipirational quotes");
            const initialMessage = `Job Description: ${user.jobDescription}\nResume:" give me a insipirational quotes"`;

            const skillsText = `Here's the resume \n${res}. Leave the content exactly as it is, but extract the skills section. For skills, $ Your response only contains original information from the given resume. don't include titles or headings such as "skills" just go straight to the content.also extract the work experience section. For work experience, $Divide work experience section into subsections prefixed by "Company: ", "Role: ", "Date: ", "Description: " make them bold.  If you can't find any related info leave it blank.  Your response only contains the prefixes and original information from the given resume also extract the project experience section. For project experience section Divide section into subsections prefixed by "Project: ", "Description: " If you can't find any related info leave it blank. Your response only contains the prefixes and original information from the given resume. use bold headings for each section and usbsection. 
            
            After that, tailor each section of the resume to this job description ${jobD}. 
            for the skills section
            find all the frameworks/libraries/programing languages/databases/technologies needed and add that to the skills section that already exists. don't include titles or headings such as "tailored/additional skills" just go straight to the content.
            
            Now for the work experience and project experience based on the job description tailor each subection work/project experience's bullet point to reflect the job description. Take what the existing accomplishments in each bullet point and re-phrase it in a way that uses the relevent technologies in the job description(the skills you extracted from the skills section). Based on given bullet points, rephrase to use the tools, skills and technologies mentioned in job description. Don't delete the existing bullet points or sentences, only improve it and add new bullet points and sentences by giving example of an accomplishment. Use this sentence structure(with different words): Implemented... by utilizing...(technology)...achieved...(results, include a made up metric/stat). bold the skills extracted from the job description. Be sure to add heading for skills, work experience and project experience.`


            append({ role: 'user', content: skillsText });
            console.log("called append")

          } catch (e) {
            console.log("error:", e);
          }
          // if (completeResume != null) {
          //   // const parsedResume = JSON.parse(completeResume);
          //   // setResumeSections(completeResume || null);
          //   const workExperienceArray = completeResume.workExperience.split(/(?=Company: )/).filter(Boolean);
          //   const projectExperienceArray = completeResume.projectExperience.split(/(?=Project: )/).filter(Boolean);

          //   const updatedResumeSections = {
          //     ...completeResume,
          //     workExperience: workExperienceArray,
          //     projectExperience: projectExperienceArray
          //   };
          //   console.log("updatedResumeSections: ", updatedResumeSections)
          //   setResumeSections(updatedResumeSections);
          // }

          ////*********************** */
          // const formattedResume = await splitSections(jobD, res);
          // if (formattedResume != null) {
          //   const workExperienceArray = formattedResume.workExperience.split(/(?=Company: )/).filter(Boolean);
          //   const projectExperienceArray = formattedResume.projectExperience.split(/(?=Project: )/).filter(Boolean);
          //   const updatedResumeSections = {
          //         ...formattedResume,
          //         workExperience: workExperienceArray,
          //         projectExperience: projectExperienceArray
          //   };
          //   setResumeSections(updatedResumeSections);
          //   console.log("updatedResumeSections: ", updatedResumeSections)
          // }

        } else {
          // Handle the case when userId is null (e.g., display an error message)
          console.error('User ID is null');
        }
      } catch (error) {
        console.error('Error during async operation:', error);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Make sure you uploaded a job description and your resume!")
    }
  };

  // Update newestMessage whenever messages change
  useEffect(() => {
    console.log("useeffect")
    const filteredMessages = messages.filter(m => m.role !== 'user');
    if (filteredMessages.length > 0) {
      const latestMessageContent = filteredMessages[filteredMessages.length - 1].content;
      setNewestMessage(latestMessageContent);
    }
  }, [messages]);

  const parseResume = (resume: string): ResumeSections => {
    const sections: ResumeSections = {
      skills: '',
      workExperience: [],
      projectExperience: [],
    };

    // Split the resume into sections using regex
    // Extract Skills section
    const skillsMatch = resume.match(/Skills:\s*([\s\S]*?)(?=Work Experience:|Project Experience:|$)/i);
    if (skillsMatch) {
      let rawSkills = skillsMatch[1].trim(); // Trim leading and trailing whitespace

      // Remove leading `**` if present at the beginning of the skills content
      rawSkills = rawSkills.replace(/^\*\*/, '');

      // Remove trailing `**` if present at the end of the skills content
      rawSkills = rawSkills.replace(/\*\*$/, '');

      sections.skills = rawSkills;
    }
    console.log(sections.skills)
    // Extract Work Experience section
    const workExpSection = resume.match(/Work Experience:\s*([\s\S]*?)(?=Project Experience:|$)/i);
    if (workExpSection) {
      const workExpEntries = workExpSection[1]
        .trim()
        .split(/\n\s*\n/)
        .map(entry => entry.trim().replace(/^\*\*/, '')) // Remove leading `**` if present
        .filter(entry => entry !== '' && entry !== '**'); // Filter out empty entries and '**'
      sections.workExperience = workExpEntries;
    }

    // Extract Project Experience section
    const projExpSection = resume.match(/Project Experience:\s*([\s\S]*?)(?=$)/i);
    if (projExpSection) {
      const projExpEntries = projExpSection[1]
        .trim()
        .split(/\n\s*\n/)
        .map(entry => entry.trim().replace(/^\*\*/, '')) // Remove leading `**` if present
        .filter(entry => entry !== '' && entry !== '**'); // Filter out empty entries and '**'
      sections.projectExperience = projExpEntries;
    }
    console.log(sections)
    return sections;
  };


  const handleEditSection = () => {
    console.log(newestMessage)
    const parsedSections = parseResume(newestMessage);
    setResumeSections(parsedSections);
    setShowOriginal(false);
  };

  const renderFormattedText = (text: string) => {
    // Replace **text** with <strong>text</strong>
    const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Render the HTML string using dangerouslySetInnerHTML
    return (
      <div
        className="whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: formattedText }}
      />
    );
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: '1', maxWidth: '35%', overflowY: 'auto', marginRight: 'auto', marginLeft: '0', marginTop: '50px' }}>
        <section style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: '93%', maxWidth: '400px', marginBottom: '60px', marginLeft: '10px' }}>
            <JobDesForm
              action="Add"
              userId={userId}
              clerkId={clerkId}
              type={type}
              creditBalance={creditBalance}
              onCompletion={handleJobDesFormCompletion}
            />
          </div>
          <div className="mt-10" style={{ width: '93%', maxWidth: '400px', marginLeft: '10px' }}>
            <FileUpload
              action="Add"
              userId={userId}
              clerkId={clerkId}
              type={type}
              creditBalance={creditBalance}
              onCompletion={handleFileUploadCompletion}
            />
            <div style={{ marginTop: '50px' }}>
              {/* <Button style={{ height: '45px', width: '100%', fontSize: '1.5rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={handleButtonClick}>
                <CookieIcon className="mr-2 h-6 w-6" /> Tailor Resume
              </Button> */}
              <button className='btn-55 ' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }} onClick={handleButtonClick}>
                <span> Tailor Resume</span>
                {/* Any SVG or other content goes here */}
              </button>
              <button className='btn-55 ' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: '24px' }} onClick={handleEditSection}>
                <span> Edit Subsections</span>
                {/* Any SVG or other content goes here */}
              </button>
            </div>
          </div>

        </section>
      </div>
      <div style={{ flex: '1', maxWidth: '100%' }}>
        <section className="main" style={{ width: '100%', overflowY: 'auto', height: '90vh' }}>
          {loading ? (<div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', height: '80vh' }}>

            <l-jelly-triangle
              size="105"
              speed="2.9"
              color="#1b2234"
            ></l-jelly-triangle>
            <p style={{
              fontSize: '21px', marginTop: '40px', textAlign: 'center', opacity: fadeOut ? 0 : 1, transition: 'opacity 0.5s ease-in-out', lineHeight: '1.4', position: 'absolute',
              transform: 'translateY(130%)',
              // Adjust line height for better readability
              maxWidth: '350px',
            }}>
              {loadingTexts[loadingTextIndex]}
            </p>

          </div>) :

            showOriginal ? (
              // Display newestMessage when showOriginal is true
              <div className="flex flex-col w-full py-24 mx-auto stretch">
                {/* Render formatted newestMessage */}
                {newestMessage && renderFormattedText(newestMessage)}
              </div>
            ) : (
              // Render ShowResult component when showOriginal is false
              <ShowResult
                UserId={userId}
                clerkID={clerkId}
                tmpResumeSections={resumeSections}
              />
            )
          }

        </section>
      </div>
    </div>

  );
}

export default ResumeTailor;
