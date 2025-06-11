import React from 'react';

const reactions = [
  { type: 'Like', emoji: '👍', label: 'إعجاب' },
  { type: 'Love', emoji: '❤️', label: 'حب' },
  { type: 'Laugh', emoji: '😂', label: 'ضحك' },
  { type: 'Wow', emoji: '😮', label: 'دهشة' },
  { type: 'Sad', emoji: '😢', label: 'حزن' },
  { type: 'Angry', emoji: '😠', label: 'غضب' },
];

const ReactionPicker = ({ onSelect }) => {
  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-white shadow-xl rounded-xl px-4 py-2 flex items-center gap-3 border border-gray-200 transition-all duration-200">
      {reactions.map((reaction) => (
        <button
          key={reaction.type}
          onClick={() => onSelect(reaction.type)}
          className="text-2xl hover:scale-125 active:scale-100 transform transition-transform duration-150 ease-in-out focus:outline-none"
          title={reaction.label}
        >
          {reaction.emoji}
        </button>
      ))}
    </div>
  );
};

export default ReactionPicker;
