import React, { useState } from 'react';
import LessonsService from '../../services/lessons';

const LessonMaterialsComponent = ({ lesson, onMaterialsUpdate }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      await LessonsService.uploadMaterial(lesson.id, file);
      onMaterialsUpdate(); // حدث القائمة بعد الرفع
    } catch (error) {
      console.error('Error uploading material:', error);
      alert('فشل رفع المادة');
    } finally {
      setUploading(false);
      e.target.value = ''; // إعادة تعيين الملف للرفع مرة أخرى
    }
  };

  const handleDelete = async (materialId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه المادة؟')) return;
    try {
      await LessonsService.deleteMaterial(lesson.id, materialId);
      onMaterialsUpdate(); // تحديث القائمة بعد الحذف
    } catch (error) {
      console.error('Error deleting material:', error);
      alert('فشل حذف المادة');
    }
  };

  return (
    <div>
      <h3>مواد الدرس</h3>
      <input type="file" onChange={handleFileUpload} disabled={uploading} />
      <ul>
        {lesson.materials && lesson.materials.length > 0 ? (
          lesson.materials.map((mat) => (
            <li key={mat.id}>
              <a href={mat.url} target="_blank" rel="noreferrer">{mat.name}</a>
              <button onClick={() => handleDelete(mat.id)} style={{ marginLeft: 10 }}>
                حذف
              </button>
            </li>
          ))
        ) : (
          <p>لا توجد مواد لهذا الدرس</p>
        )}
      </ul>
    </div>
  );
};

export default LessonMaterialsComponent;
