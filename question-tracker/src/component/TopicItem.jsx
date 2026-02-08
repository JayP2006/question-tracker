import React, { useState } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { ChevronDown, ChevronRight, Trash2, GripVertical, Plus } from 'lucide-react';
import useSheetStore from '../store/useSheetStore';
import SubTopicItem from './SubTopicItem';

const TopicItem = ({ topic, index }) => {
  const { deleteItem, addSubTopic } = useSheetStore();
  const [expanded, setExpanded] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newSubTitle, setNewSubTitle] = useState('');

  const handleAddSub = (e) => {
    e.preventDefault();
    if (newSubTitle.trim()) {
      addSubTopic(topic.id, newSubTitle);
      setNewSubTitle('');
      setIsAdding(false);
      setExpanded(true);
    }
  };

  return (
    <Draggable draggableId={topic.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="bg-white mb-6 rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div {...provided.dragHandleProps} className="cursor-grab text-gray-400 hover:text-gray-600">
                <GripVertical size={20} />
              </div>
              <button onClick={() => setExpanded(!expanded)} className="text-gray-600 hover:bg-gray-200 p-1 rounded">
                {expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </button>
              <h2 className="text-lg font-bold text-gray-800">{topic.title}</h2>
            </div>
            
            <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsAdding(true)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Plus size={16} /> Add Subtopic
                </button>
                <button onClick={() => deleteItem(topic.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
            </div>
          </div>

          {expanded && (
            <div className="p-4">
              {isAdding && (
                <form onSubmit={handleAddSub} className="mb-4 flex gap-2">
                  <input 
                    autoFocus
                    className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter subtopic name..."
                    value={newSubTitle}
                    onChange={(e) => setNewSubTitle(e.target.value)}
                  />
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add</button>
                  <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                </form>
              )}

              <Droppable droppableId={topic.id} type="SUBTOPIC">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                    {topic.children.map((sub, i) => (
                      <SubTopicItem key={sub.id} subtopic={sub} index={i} />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default TopicItem;