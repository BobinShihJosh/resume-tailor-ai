'use client';
 
import { useCompletion } from 'ai/react';
 
export default function Completion() {
  const {
    completion,
    input,
    stop,
    isLoading,
    handleInputChange,
    handleSubmit,
  } = useCompletion({
    api: '/api/completion',
  });
 
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          placeholder="Enter your prompt..."
          onChange={handleInputChange}
        />
        <p>Completion result: {completion}</p>
        <button type="button" onClick={stop}>
          Stop
        </button>
        <button disabled={isLoading} type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}