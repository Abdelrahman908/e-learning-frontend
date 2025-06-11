import React, { useState, useEffect } from 'react';
import LessonsService from '../../services/lessons';

const ProgressStatusComponent = ({ lessonId, initialProgress }) => {
  const [progress, setProgress] = useState(initialProgress || 0);

  // تحديث التقدم في الباك اند
  const updateProgress = async (newProgress) => {
    try {
      await ProgressService.updateProgress(lessonId, newProgress);
      setProgress(newProgress);
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  return (
    <div style={{ marginTop: '10px' }}>
      <p>نسبة التقدم: {progress.toFixed(1)}%</p>
      {/* لو حبيت تضيف أزرار لتعديل التقدم يدوي */}
      {/* <button onClick={() => updateProgress(progress + 10)}>زيادة 10%</button> */}
    </div>
  );
};

export default ProgressStatusComponent;
