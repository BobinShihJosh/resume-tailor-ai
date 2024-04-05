"use client"

import React, { FC, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { CookieIcon } from '@radix-ui/react-icons'
import { useTransition } from "react"
import { tailorResume, tailorSubSection } from "@/lib/actions/user.actions"
// import { jelly, helix } from 'ldrs' 
// import EditableSection from './editableSection';

// jelly.register()
if (typeof window !== 'undefined') {
    import('ldrs').then(({ jelly }) => {
        jelly.register();
    }).catch(error => {
        console.error('Failed to import ldrs:', error);
    });
}

interface ShowResultProps {
    UserId: string;
    clerkID: string | null;
    tmpResumeSections: {
        skills: string;
        workExperience: string[];
        projectExperience: string[];
    } | null;
}

const ShowResult: FC<ShowResultProps> = ({ UserId, clerkID, tmpResumeSections }) => {

    const [isPending, startTransition] = useTransition()
    const [loading, setLoading] = useState(false); 
    const [resumeSections, setResumeSections] = useState<{
        skills: string;
        workExperience: string[];
        projectExperience: string[];
    } | null>(null);

    const [subSecLoading, setSubSecLoading] = useState<{
        skills: boolean;
        workExperience: boolean[];
        projectExperience: boolean[];
    }>({
        skills: false,
        workExperience: [], // Initialize with an empty array of boolean values
        projectExperience: [] // Initialize with an empty array of boolean values
    });

    const [editMode, setEditMode] = useState<{
        skills: boolean;
        workExperience: boolean[];
        projectExperience: boolean[];
    }>({
        skills: false,
        workExperience: [],
        projectExperience: []
    });

    // update current resumeSections with the one passed in.
    useEffect(() => {
        if (tmpResumeSections !== null) {
            setResumeSections(tmpResumeSections);
        }
    }, [tmpResumeSections]);

    const toggleEditMode = (section: keyof typeof editMode, index?: number) => {
        if (index !== undefined) {
            setEditMode(prevState => {
                const newEditMode = [...(prevState[section] as boolean[])];
                newEditMode[index] = !newEditMode[index];
                return {
                    ...prevState,
                    [section]: newEditMode
                };
            });
        } else {
            setEditMode(prevState => ({
                ...prevState,
                [section]: !prevState[section]
            }));
        }
    };
    type ResumeSectionKeys = keyof typeof resumeSections;

    const toggleSkillsEditMode = (section: keyof typeof editMode) => {
        setEditMode(prevState => ({
            ...prevState,
            [section]: !prevState[section]
        }));
    };

    const handleSectionChange = (section: keyof typeof resumeSections, value: string, index: number) => {
        setResumeSections(prevState => {
            if (prevState && Array.isArray(prevState[section])) {
                const newSections = [...(prevState[section] as string[])];
                newSections[index] = value;
                return {
                    ...prevState,
                    [section]: newSections
                };
            }
            console.log('No update performed');

            return prevState;
        });
    };

    const handleSkillsSectionChange = (section: keyof typeof resumeSections, value: string) => {
        setResumeSections(prevState => {
            if (prevState) {
                return {
                    ...prevState,
                    [section]: value
                };
            }
            console.log('No update performed');
            return prevState;
        });
    };

    const handleLoading = (section: keyof typeof resumeSections, secName: string, isLoading: boolean, index?: number,) => {
        if (secName === 'work experience' && index !== undefined) {
            setSubSecLoading(prevState => ({
                ...(prevState as { skills: boolean; workExperience: boolean[]; projectExperience: boolean[] }),
                workExperience: prevState ? prevState.workExperience.map((value, i) => (i === index ? isLoading : value)) : [],
            }));
        } else if (secName === 'project experience') {
            setSubSecLoading(prevState => ({
                ...(prevState as { skills: boolean; workExperience: boolean[]; projectExperience: boolean[] }),
                projectExperience: prevState ? prevState.projectExperience.map((value, i) => (i === index ? isLoading : value)) : [],
            }));
        } else {
            setSubSecLoading(prevState => ({
                ...(prevState as { skills: boolean; workExperience: boolean[]; projectExperience: boolean[] }),
                skills: isLoading,
            }));
        }
    };

    useEffect(() => {
        if (resumeSections) {
            setSubSecLoading(prevState => {
                if (prevState && prevState.workExperience.length === resumeSections.workExperience.length && prevState.projectExperience.length === resumeSections.projectExperience.length) {
                    // If subSecLoading already exists and has the same number of elements as resumeSections, keep the existing loading states
                    return prevState;
                } else {
                    // Otherwise, initialize subSecLoading with new loading states
                    return {
                        skills: false,
                        workExperience: Array(resumeSections.workExperience.length).fill(false),
                        projectExperience: Array(resumeSections.projectExperience.length).fill(false),
                    };
                }
            });
        }
    }, [resumeSections]);

    async function fetchAndProcessSubsection(clerkID: string, subsectionToProcess: string, secName: string): Promise<any> {
        try {
            // Make a POST request to your API route
            const response = await fetch('/api/gptResponse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: clerkID,
                    subSection: subsectionToProcess,
                    subName: secName,
                }),
            });

            // Check if the request was successful
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            // Parse the response JSON
            const data = await response.json();

            // Process the response data as needed
            console.log('Processed Subsection:', data);
            // You can use the processed subsection data here

            // Return the processed data if needed
            return data;
        } catch (error) {
            console.error('Error occurred while fetching and processing subsection:', error);
            // Handle errors gracefully
            throw error; // You might want to throw the error for the caller to handle
        }
    }

    const handleSectionFeedback = async (section: ResumeSectionKeys, secName: string, index?: number) => {
        // Asynchronous operation (e.g., API call, fetching data, etc.)

        if (resumeSections) {
            const subsection = resumeSections[section];
            let subsectionToProcess = null;
            if (subsection) {
                if (index !== undefined && Array.isArray(subsection)) {
                    const processedSection = [...subsection];
                    subsectionToProcess = processedSection[index]
                } else {
                    subsectionToProcess = subsection
                }
            }
            // call api after getting subsection
            if (subsectionToProcess !== null && clerkID !== null) {
                try {
                    if (clerkID !== null) {
                        // setLoading(true);
                        handleLoading(section, secName, true, index);

                        console.log("handleloading")
                        // const completeSubsection = await tailorSubSection(clerkID, subsectionToProcess, secName);
                        fetchAndProcessSubsection(clerkID, subsectionToProcess, secName)
                            .then(async (processedData) => {
                                if (processedData !== null) {
                                    // const parsedResume = JSON.parse(completeResume);
                                    // setResumeSections(completeResume || null);

                                    if (secName !== 'skills' && index !== undefined) {
                                        handleSectionChange(section, processedData.subSection, index);
                                    } else {
                                        handleSkillsSectionChange(section, processedData.subSection);
                                    }
                                    handleLoading(section, secName, false, index);
                                }
                            })
                            .catch((error) => {
                                // Handle errors gracefully
                            });



                    } else {
                        console.log("user id is null (clerl)")
                    }
                } catch (error) {
                    console.error('Error during async operation:', error);
                }
            } else {
                alert("no text or not signed in")
            }
        }
    }


    interface ResumeSectionProps {
        resumeSection: string;
        index: number;
    }

    const parseProjectExperience: React.FC<ResumeSectionProps> = ({ resumeSection, index }) => {
        const lines = resumeSection.split('\n');
        let currentProject = '';

        return (
            <div key={index}>
                {editMode.projectExperience[index] ? (
                    <textarea
                        value={resumeSection}
                        onChange={e => handleSectionChange('projectExperience' as keyof typeof resumeSections, e.target.value, index)}
                        rows={5}
                        cols={100}
                    />
                ) : null}
                {subSecLoading?.projectExperience[index] ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '15vh' }}>
                        <l-jelly
                            size="52"
                            speed="1.6"
                            color="black"
                        ></l-jelly>
                    </div>
                ) : (
                    <>
                        {!editMode.projectExperience[index] && lines.map((line, idx) => {
                            if (line.startsWith('Project:')) {
                                currentProject = line.replace('Project:', '').trim();
                                return <h3 key={idx} style={{ fontWeight: 'bold', marginTop: 10 }}>Project: {currentProject}</h3>;
                            } else {
                                const boldFormattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

                                // Use dangerouslySetInnerHTML to render HTML with bold styling
                                return (
                                    <p key={idx} dangerouslySetInnerHTML={{ __html: boldFormattedLine }}></p>
                                );
                            }
                        })}
                        <Button style={{ marginTop: '10px', marginBottom: '10px' }} onClick={() => toggleEditMode('projectExperience', index)}>
                            {editMode.projectExperience[index] ? 'Save' : 'Edit'}
                        </Button>
                        <Button style={{ marginTop: '10px', marginLeft: '10px' }} onClick={() => handleSectionFeedback('projectExperience' as ResumeSectionKeys, 'project experience', index)}>
                            Re-Tailor
                        </Button>
                    </>
                )}
            </div>

        );
    };

    const parseWorkExperience: React.FC<ResumeSectionProps> = ({ resumeSection, index }) => {
        const lines = resumeSection.split('\n');
        let currentCompany = '';

        return (
            <div key={index}>
                {editMode.workExperience[index] ? (
                    <textarea
                        value={resumeSection}
                        onChange={e => handleSectionChange('workExperience' as keyof typeof resumeSections, e.target.value, index)}
                        rows={10}
                        cols={100}
                    />
                ) : null}

                {subSecLoading?.workExperience[index] ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20vh' }}>
                        <l-jelly
                            size="52"
                            speed="1.6"
                            color="black"
                        ></l-jelly>
                    </div>
                ) : (
                    <>

                        {!editMode.workExperience[index] && lines.map((line, idx) => {
                            if (line.startsWith('Company:')) {
                                currentCompany = line.replace('Company:', '').trim();
                                return <h3 key={idx} style={{ fontWeight: 'bold', marginTop: 10 }}>Company: {currentCompany}</h3>;
                            } else if (line.startsWith('Role:') || line.startsWith('Date:') || line.startsWith('Location:')) {
                                return <p key={idx} style={{ fontWeight: 'bold' }}>{line}</p>;
                            } else if (line.startsWith('Description:')) {
                                return <p key={idx}>{line.replace('Description:', '').trim()}</p>;
                            } else {
                                const boldFormattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

                                // Use dangerouslySetInnerHTML to render HTML with bold styling
                                return (
                                    <p key={idx} dangerouslySetInnerHTML={{ __html: boldFormattedLine }}></p>
                                );
                            }
                        })}
                        <Button style={{ marginTop: '10px', marginBottom: '10px' }} onClick={() => toggleEditMode('workExperience', index)}>
                            {editMode.workExperience[index] ? 'Save' : 'Edit'}
                        </Button>
                        <Button style={{ marginTop: '10px', marginLeft: '10px' }} onClick={() => handleSectionFeedback('workExperience' as ResumeSectionKeys, 'work experience', index)}>
                            Re-Tailor
                        </Button>
                    </>
                )}
            </div>
        );
    };



    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <l-jelly
                size="135"
                speed="1.6"
                color="black"
            ></l-jelly>
        </div>
    } else {
        return (
            <div style={{ margin: '0 auto', textAlign: 'center' }}> 
                {!resumeSections ? (
                    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', textAlign: 'center', fontSize: '16px' }}>
                        <img src="/assets/images/cat.svg" alt="cat" style={{ width: '550px', height: '550px' }} />
                        <div style={{ position: 'absolute', bottom: '620px', fontSize: '24px' }}>
                            Upload a job description and your resume to get started!
                        </div>
                    </div>

                ) : (
                    (
                        <div style={{ marginTop: '20px', textAlign: 'left' }}>

                            {/* Render Skills Section */}
                            <h2 style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Skills:</h2>


                            <div>
                                {subSecLoading?.skills ? (
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '15vh' }}>
                                        <l-jelly
                                            size="52"
                                            speed="1.6"
                                            color="black"
                                        ></l-jelly>
                                    </div>
                                ) : (
                                    <>
                                        {editMode.skills ? (
                                            <textarea
                                                value={resumeSections.skills}
                                                onChange={e => handleSkillsSectionChange('skills' as ResumeSectionKeys, e.target.value)}
                                                rows={10}
                                                cols={100}
                                            />
                                        ) : (
                                            resumeSections.skills.split(/(\*\*.+?\*\*)/).map((part, index) => {
                                                if (part.startsWith('**') && part.endsWith('**')) {
                                                    return <strong key={index}>{part.slice(2, -2)}</strong>;
                                                } else {
                                                    return part.split('\n').map((line, i) => (
                                                        <span key={i}>
                                                            {line}
                                                            {i < part.split('\n').length - 2 && <br />}
                                                        </span>
                                                    ));
                                                }
                                            })
                                        )}
                                        <div style={{ marginTop: '10px' }}>
                                            <Button style={{ marginBottom: '10px' }} onClick={() => toggleSkillsEditMode('skills')}>
                                                {editMode.skills ? 'Save' : 'Edit'}
                                            </Button>
                                            <Button style={{ marginLeft: '10px' }} onClick={() => handleSectionFeedback('skills' as ResumeSectionKeys, 'skills')}>
                                                Re-Tailor
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>



                            {/* Render Work Experience Section */}
                            <h2 style={{ marginTop: '20px', fontWeight: 'bold', fontSize: '1.5rem' }}>Work Experience:</h2>
                            {resumeSections.workExperience.map((workExperience, index) => (
                                parseWorkExperience({ resumeSection: workExperience, index })
                            ))}

                            {/* Render Project Experience Section */}
                            <h2 style={{ marginTop: '20px', fontWeight: 'bold', fontSize: '1.5rem' }}>Project Experience:</h2>

                            {resumeSections.projectExperience.map((projectExperience, index) => (
                                parseProjectExperience({ resumeSection: projectExperience, index })
                            ))}
                        </div>
                    ))}
            </div>
        )
    }
}

export default ShowResult; 