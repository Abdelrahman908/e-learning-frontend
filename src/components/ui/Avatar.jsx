import React from 'react';

const Avatar = ({ name = '', size = 'md', className = '' }) => {
  // التحقق من وجود name وتعيين قيمة افتراضية
  const safeName = name || 'Anonymous User';
  
  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg'
  };

  // استخراج الأحرف الأولى مع التحقق من وجودها
  const initials = safeName
    .split(' ')
    .filter(part => part.length > 0) // تجنب أجزاء فارغة
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2); // الحد الأقصى لحرفين

  // ألوان مختلفة بناءً على الأحرف الأولى
  const colors = [
    'bg-blue-100 text-blue-600',
    'bg-green-100 text-green-600',
    'bg-purple-100 text-purple-600',
    'bg-yellow-100 text-yellow-600',
    'bg-red-100 text-red-600'
  ];

  const colorIndex = safeName.charCodeAt(0) % colors.length;
  const colorClass = colors[colorIndex];

  return (
    <div
      className={`rounded-full flex items-center justify-center font-medium ${sizeClasses[size]} ${colorClass} ${className}`}
    >
      {initials || 'AU'}
    </div>
  );
};

export default Avatar;