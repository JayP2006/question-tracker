import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

const initialData = [
  {
    id: 'topic-1',
    title: 'Arrays & Hashing',
    type: 'TOPIC',
    children: [
      {
        id: 'sub-1',
        title: 'Basic Arrays',
        type: 'SUBTOPIC',
        children: [
          { id: 'q-1', title: 'Contains Duplicate', url: 'https://leetcode.com/problems/contains-duplicate/', type: 'QUESTION', completed: false },
          { id: 'q-2', title: 'Valid Anagram', url: 'https://leetcode.com/problems/valid-anagram/', type: 'QUESTION', completed: false }
        ]
      }
    ]
  }
];

const useSheetStore = create(
  persist(
    (set) => ({
      data: initialData,

      addTopic: (title) => set((state) => ({
        data: [...state.data, { id: uuidv4(), title, type: 'TOPIC', children: [] }]
      })),

      addSubTopic: (topicId, title) => set((state) => ({
        data: state.data.map((topic) => 
          topic.id === topicId 
            ? { ...topic, children: [...topic.children, { id: uuidv4(), title, type: 'SUBTOPIC', children: [] }] }
            : topic
        )
      })),

      addQuestion: (subTopicId, title, url) => set((state) => {
        const addQ = (nodes) => nodes.map((node) => {
          if (node.id === subTopicId) {
            return { 
              ...node, 
              children: [...node.children, { id: uuidv4(), title, url, type: 'QUESTION', completed: false }] 
            };
          }
          if (node.children) {
            return { ...node, children: addQ(node.children) };
          }
          return node;
        });
        return { data: addQ(state.data) };
      }),

      deleteItem: (id) => set((state) => {
        const remove = (nodes) => nodes
          .filter((node) => node.id !== id)
          .map((node) => ({ ...node, children: node.children ? remove(node.children) : [] }));
        return { data: remove(state.data) };
      }),

      toggleComplete: (id) => set((state) => {
        const toggle = (nodes) => nodes.map((node) => {
          if (node.id === id) return { ...node, completed: !node.completed };
          if (node.children) return { ...node, children: toggle(node.children) };
          return node;
        });
        return { data: toggle(state.data) };
      }),

      reorder: (result) => set((state) => {
        const { source, destination, type } = result;
        if (!destination) return state;

        const newData = [...state.data];

        if (type === 'TOPIC') {
          const [moved] = newData.splice(source.index, 1);
          newData.splice(destination.index, 0, moved);
          return { data: newData };
        }

        const reorderChildren = (nodes, parentType) => {
          return nodes.map((node) => {
            const isParent = (type === 'SUBTOPIC' && node.type === 'TOPIC') || 
                             (type === 'QUESTION' && node.type === 'SUBTOPIC');
            
            if (isParent && node.id === source.droppableId) {
              const newChildren = [...node.children];
              const [movedItem] = newChildren.splice(source.index, 1);
              
              if (source.droppableId === destination.droppableId) {
                newChildren.splice(destination.index, 0, movedItem);
                return { ...node, children: newChildren };
              }
            }
           
             if (isParent && node.id === destination.droppableId && source.droppableId !== destination.droppableId) {
             }

            if (node.children) {
              return { ...node, children: reorderChildren(node.children) };
            }
            return node;
          });
        };
        
        
        const simplifiedReorder = (nodes) => {
             return nodes.map(node => {
                 if(node.id === source.droppableId) {
                     const newChildren = [...node.children];
                     const [moved] = newChildren.splice(source.index, 1);
                     newChildren.splice(destination.index, 0, moved);
                     return { ...node, children: newChildren };
                 }
                 if(node.children) return { ...node, children: simplifiedReorder(node.children)};
                 return node;
             })
        }

        return { data: simplifiedReorder(newData) };
      }),
    }),
    { name: 'codolio-sheet-storage' }
  )
);

export default useSheetStore;