import React, { useState } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Trash2, GripVertical, Plus } from 'lucide-react';
import useSheetStore from '../store/useSheetStore';
import QuestionItem from './QuestionItem';

const SubTopicItem = ({ subtopic, index }) => {
  const { deleteItem, addQuestion } = useSheetStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newQTitle, setNewQTitle] = useState('');
  const [newQUrl, setNewQUrl] = useState('');

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (newQTitle.trim()) {
      addQuestion(subtopic.id, newQTitle, newQUrl || '#');
      setNewQTitle('');
      setNewQUrl('');
      setIsAdding(false);
    }
  };

  return (
    <Draggable draggableId={subtopic.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="ml-6 mt-4 border-l-2 border-gray-200 pl-4"
        >
          <div className="flex items-center justify-between group mb-2">
            <div className="flex items-center gap-2">
              <div {...provided.dragHandleProps} className="cursor-grab text-gray-400">
                <GripVertical size={18} />
              </div>
              <h3 className="text-md font-semibold text-gray-700">{subtopic.title}</h3>
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                {subtopic.children.length} Qs
              </span>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={() => setIsAdding(!isAdding)} className="p-1 hover:bg-gray-200 rounded text-blue-600">
                  <Plus size={16} />
               </button>
               <button onClick={() => deleteItem(subtopic.id)} className="p-1 hover:bg-gray-200 rounded text-red-500">
                  <Trash2 size={16} />
               </button>
            </div>
          </div>

          {isAdding && (
            <form onSubmit={handleAddQuestion} className="mb-3 p-3 bg-gray-50 rounded border border-blue-100">
              <input 
                autoFocus
                className="w-full mb-2 p-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Question Title"
                value={newQTitle}
                onChange={(e) => setNewQTitle(e.target.value)}
              />
              <input 
                className="w-full mb-2 p-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="URL (Optional)"
                value={newQUrl}
                onChange={(e) => setNewQUrl(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsAdding(false)} className="text-xs px-3 py-1 text-gray-500">Cancel</button>
                <button type="submit" className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Add</button>
              </div>
            </form>
          )}

          <Droppable droppableId={subtopic.id} type="QUESTION">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="min-h-[10px]">
                {subtopic.children.map((q, i) => (
                  <QuestionItem key={q.id} question={q} index={i} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default SubTopicItem;