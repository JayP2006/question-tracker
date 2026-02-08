import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Trash2, GripVertical, CheckCircle2, Circle } from 'lucide-react';
import useSheetStore from '../store/useSheetStore';

const QuestionItem = ({ question, index }) => {
  const { deleteItem, toggleComplete } = useSheetStore();

  return (
    <Draggable draggableId={question.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="flex items-center gap-3 p-3 mb-2 bg-white rounded border border-gray-100 shadow-sm hover:shadow-md transition-all group"
        >
          <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600 cursor-grab">
            <GripVertical size={16} />
          </div>

          <button onClick={() => toggleComplete(question.id)} className="text-gray-400 hover:text-green-500 transition-colors">
            {question.completed ? <CheckCircle2 className="text-green-500" size={20} /> : <Circle size={20} />}
          </button>

          <a 
            href={question.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`flex-1 font-medium text-sm ${question.completed ? 'text-gray-400 line-through' : 'text-gray-700 hover:text-blue-600'}`}
          >
            {question.title}
          </a>

          <button 
            onClick={() => deleteItem(question.id)}
            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </Draggable>
  );
};

export default QuestionItem;