// EditableSection.tsx

import React, { useState } from 'react';

interface EditableSectionProps {
  title: string;
  content: string;
  onSave: (editedContent: string) => void;
}

const EditableSection: React.FC<EditableSectionProps> = ({ title, content, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleSave = () => {
    onSave(editedContent);
    setIsEditing(false);
  };

  return (
    <div style={{ marginTop: '20px', textAlign: 'left' }}>
      <h2 style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{title}</h2>
      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          style={{ width: '100%', minHeight: '100px' }}
        />
      ) : (
        <div style={{ marginLeft: '20px' }}>
          {editedContent.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      )}
      {isEditing ? (
        <button onClick={handleSave}>Save</button>
      ) : (
        <button onClick={() => setIsEditing(true)}>Edit</button>
      )}
    </div>
  );
};

export default EditableSection;
