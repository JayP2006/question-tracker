import React, { useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Plus, Layout } from 'lucide-react';
import useSheetStore from './store/useSheetStore';
import TopicItem from './component/TopicItem';

function App() {
  const { data, addTopic, reorder } = useSheetStore();
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const onDragEnd = (result) => {
    reorder(result);
  };

  const handleAddTopic = (e) => {
    e.preventDefault();
    if (newTopicTitle.trim()) {
      addTopic(newTopicTitle);
      setNewTopicTitle('');
      setIsAdding(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Layout className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Codolio Sheet</h1>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
          >
            <Plus size={18} /> New Topic
          </button>
        </div>
      </header>
 
      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {isAdding && (
          <div className="mb-6 p-4 bg-white rounded-xl shadow-lg border border-blue-100 animate-in fade-in slide-in-from-top-4">
            <form onSubmit={handleAddTopic} className="flex gap-3">
              <input
                autoFocus 
                className="flex-1 text-lg p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="What is the new topic name?"
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
              />
              <button type="submit" className="px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
                Create Topic
              </button>
              <button type="button" onClick={() => setIsAdding(false)} className="px-6 text-gray-500 font-medium hover:bg-gray-100 rounded-lg">
                Cancel
              </button>
            </form>
          </div>
        )}

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="root" type="TOPIC">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {data.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">
                    <p>No topics yet. Click "New Topic" to get started.</p>
                  </div>
                ) : (
                  data.map((topic, index) => (
                    <TopicItem key={topic.id} topic={topic} index={index} />
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </main>
    </div>
  );
}

export default App;