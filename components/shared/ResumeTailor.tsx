"use client"

import { useState, useEffect } from 'react';

import { JobDesForm } from '@/components/shared/JobDesForm';
import { FileUpload } from '@/components/shared/FileUpload';
import { Button } from "@/components/ui/button"
import { CookieIcon } from '@radix-ui/react-icons'
import { tailorResume } from "@/lib/actions/user.actions"
import ShowResult from './ShowResult';
// import { jellyTriangle } from 'ldrs';
// jellyTriangle.register()
if (typeof window !== 'undefined') {
  import('ldrs').then(({ jellyTriangle }) => {
    jellyTriangle.register();
  }).catch(error => {
      console.error('Failed to import ldrs:', error);
  });
}
const ResumeTailor = ({ action, data = null, userId, clerkId, type, creditBalance, config = null }: TransformationFormProps) => {

  const [jobDesFormCompleted, setJobDesFormCompleted] = useState(false);
  const [fileUploadCompleted, setFileUploadCompleted] = useState(false);
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
      setLoading(true);
      try {
        if (clerkId !== null) {
          const completeResume = await tailorResume(clerkId);
          if (completeResume != null) {
            // const parsedResume = JSON.parse(completeResume);
            // setResumeSections(completeResume || null);
            const workExperienceArray = completeResume.workExperience.split(/(?=Company: )/).filter(Boolean);
            const projectExperienceArray = completeResume.projectExperience.split(/(?=Project: )/).filter(Boolean);

            const updatedResumeSections = {
              ...completeResume,
              workExperience: workExperienceArray,
              projectExperience: projectExperienceArray
            };
            console.log("updatedResumeSections: ", updatedResumeSections)
            setResumeSections(updatedResumeSections);
          }

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

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: '1', maxWidth: '35%', overflowY: 'auto', marginRight: 'auto', marginLeft: '0', marginTop: '20px' }}>
        <section style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: '93%', maxWidth: '400px', marginBottom: '20px', marginLeft: '10px' }}>
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
              <Button style={{ height: '65px', width: '100%', fontSize: '1.5rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={handleButtonClick}>
                <CookieIcon className="mr-2 h-6 w-6" /> Tailor Resume
              </Button>
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
            <p style={{ fontSize: '21px', marginTop: '40px', textAlign: 'center', opacity: fadeOut ? 0 : 1, transition: 'opacity 0.5s ease-in-out', lineHeight: '1.4',   position: 'absolute', 
  transform: 'translateY(130%)',
// Adjust line height for better readability
  maxWidth: '350px',}}>
              {loadingTexts[loadingTextIndex]}
            </p>

          </div>) :
            (<ShowResult
              UserId={userId}
              clerkID={clerkId}
              tmpResumeSections={resumeSections}
            />)}
        </section>
      </div>
    </div>

  );
}

export default ResumeTailor;
