import { useState, useEffect } from 'react';
import { useChat } from 'ai/react';
interface TestAIProps {
  jobDescription: string;
  resume: string;
}
// Custom hook for handling chat functionality
export function useChatInterface() {
  const { messages, input, append, handleInputChange, handleSubmit } = useChat();

  return {
    messages,
    input,
    append,
    handleInputChange,
    handleSubmit
  };
}

// Chat component that uses the custom hook
export default function TestAI({ jobDescription, resume }: TestAIProps) {
  const { messages, input, append, handleInputChange, handleSubmit } = useChatInterface();
  
  const initialMessage = `Job Description: ${jobDescription}\nResume: ${resume}`;
  // State to track if the form has been submitted
  const [formSubmitted, setFormSubmitted] = useState(false);
   
  // Simulate form submission
  useEffect(() => {
    // Check if job description and resume are not empty strings
    if (jobDescription.trim() !== '' && resume.trim() !== '' && !formSubmitted) {
      // Create a mock event object
      console.log("jobdes and res", jobDescription, resume)
       
      append({ role: 'user', content: initialMessage });

      // Mark form as submitted
      setFormSubmitted(true);
    }
  }, [jobDescription, resume, append]);

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(m => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
        </div>
      ))}

       
    </div>
  );
}
