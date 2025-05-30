import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CourseService from '../../services/courses';
import LoadingSpinner from '../ui/LoadingSpinner';
import LessonItem from './LessonItem';
import LessonModal from './LessonModal';

const CourseLessons = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [reorderMode, setReorderMode] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const response = await CourseService.getCourseLessons(id);
        setLessons(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load lessons');
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [id]);

  const handleAddLesson = () => {
    setCurrentLesson(null);
    setShowModal(true);
  };

  const handleEditLesson = (lesson) => {
    setCurrentLesson(lesson);
    setShowModal(true);
  };

  const handleSaveLesson = async (lessonData) => {
    try {
      setLoading(true);
      if (currentLesson) {
        // Update existing lesson
        const response = await CourseService.updateLesson(
          id,
          currentLesson.id,
          lessonData
        );
        setLessons(lessons.map(lesson =>
          lesson.id === currentLesson.id ? response.data : lesson
        ));
      } else {
        // Add new lesson
        const response = await CourseService.addLesson(id, lessonData);
        setLessons([...lessons, response.data]);
      }
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save lesson');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) {
      return;
    }

    try {
      setLoading(true);
      await CourseService.deleteLesson(id, lessonId);
      setLessons(lessons.filter(lesson => lesson.id !== lessonId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete lesson');
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(lessons[index]);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
  };

  const handleDragOver = (index) => {
    if (draggedItem === null) return;

    const draggedOverItem = lessons[index];
    if (draggedItem.id === draggedOverItem.id) return;

    const items = lessons.filter(item => item.id !== draggedItem.id);
    items.splice(index, 0, draggedItem);
    setLessons(items);
  };

  const handleDragEnd = async () => {
    setDraggedItem(null);
    
    try {
      await CourseService.reorderLessons(id, lessons.map(lesson => lesson.id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save lesson order');
    }
  };

  const togglePreview = async (lessonId, isPreview) => {
    try {
      setLoading(true);
      const response = await CourseService.updateLesson(id, lessonId, {
        isPreview: !isPreview
      });
      setLessons(lessons.map(lesson =>
        lesson.id === lessonId ? response.data : lesson
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update lesson');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="message message-error">{error}</div>;

  return (
    <div className="course-lessons-container">
      <div className="lessons-header">
        <h2>Course Lessons</h2>
        <div className="lessons-actions">
          <button
            className="btn btn-primary"
            onClick={handleAddLesson}
          >
            Add Lesson
          </button>
          <button
            className={`btn ${reorderMode ? 'btn-danger' : 'btn-outline'}`}
            onClick={() => setReorderMode(!reorderMode)}
          >
            {reorderMode ? 'Done Reordering' : 'Reorder Lessons'}
          </button>
        </div>
      </div>

      <div className="lessons-list">
        {lessons.length === 0 ? (
          <div className="empty-lessons">
            <p>No lessons added yet</p>
            <button
              className="btn btn-primary"
              onClick={handleAddLesson}
            >
              Add Your First Lesson
            </button>
          </div>
        ) : (
          <ul className={reorderMode ? 'reorder-mode' : ''}>
            {lessons.map((lesson, index) => (
              <li
                key={lesson.id}
                draggable={reorderMode}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={() => reorderMode && handleDragOver(index)}
                onDragEnd={handleDragEnd}
                className={
                  `${lesson.isPreview ? 'preview' : ''} ${
                    draggedItem?.id === lesson.id ? 'dragged' : ''
                  }`
                }
              >
                <LessonItem
                  lesson={lesson}
                  onEdit={() => handleEditLesson(lesson)}
                  onDelete={() => handleDeleteLesson(lesson.id)}
                  onTogglePreview={() =>
                    togglePreview(lesson.id, lesson.isPreview)
                  }
                  reorderMode={reorderMode}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {showModal && (
        <LessonModal
          lesson={currentLesson}
          onSave={handleSaveLesson}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

const LessonItem = ({
  lesson,
  onEdit,
  onDelete,
  onTogglePreview,
  reorderMode
}) => {
  return (
    <div className="lesson-item">
      {reorderMode ? (
        <div className="reorder-handle">☰</div>
      ) : (
        <div className="lesson-number">{lesson.order + 1}</div>
      )}
      
      <div className="lesson-content">
        <div className="lesson-header">
          <h3>{lesson.title}</h3>
          <span className="lesson-duration">{lesson.duration} min</span>
        </div>
        
        <p className="lesson-description">
          {lesson.description || 'No description provided'}
        </p>
        
        <div className="lesson-footer">
          <div className="lesson-type">
            {lesson.type === 'video' && <span>🎥 Video</span>}
            {lesson.type === 'article' && <span>📄 Article</span>}
            {lesson.type === 'quiz' && <span>✏️ Quiz</span>}
            {lesson.isPreview && <span className="preview-badge">Preview</span>}
          </div>
          
          {!reorderMode && (
            <div className="lesson-actions">
              <button onClick={() => onTogglePreview()}>
                {lesson.isPreview ? 'Remove Preview' : 'Make Preview'}
              </button>
              <button onClick={() => onEdit()}>Edit</button>
              <button onClick={() => onDelete()}>Delete</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LessonModal = ({ lesson, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: lesson?.title || '',
    description: lesson?.description || '',
    content: lesson?.content || '',
    duration: lesson?.duration || 0,
    type: lesson?.type || 'video',
    isPreview: lesson?.isPreview || false,
    videoUrl: lesson?.videoUrl || '',
    attachments: lesson?.attachments || []
  });
  const [newAttachment, setNewAttachment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddAttachment = () => {
    if (newAttachment.trim()) {
      setFormData({
        ...formData,
        attachments: [...formData.attachments, newAttachment.trim()]
      });
      setNewAttachment('');
    }
  };

  const handleRemoveAttachment = (index) => {
    setFormData({
      ...formData,
      attachments: formData.attachments.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await onSave(formData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save lesson');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>{lesson ? 'Edit Lesson' : 'Add New Lesson'}</h2>
        
        {error && <div className="message message-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="video">Video</option>
                <option value="article">Article</option>
                <option value="quiz">Quiz</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Duration (minutes) *</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
          </div>
          
          {formData.type === 'video' && (
            <div className="form-group">
              <label>Video URL</label>
              <input
                type="url"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                placeholder="https://youtube.com/embed/..."
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Content *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="6"
              required
              placeholder={
                formData.type === 'quiz' 
                  ? 'Enter quiz questions in JSON format' 
                  : 'Enter lesson content (Markdown supported)'
              }
            />
          </div>
          
          <div className="form-group">
            <label>Attachments</label>
            <div className="attachments-container">
              {formData.attachments.map((attachment, index) => (
                <div key={index} className="attachment-item">
                  <span>{attachment}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
              <div className="attachment-input">
                <input
                  type="text"
                  value={newAttachment}
                  onChange={(e) => setNewAttachment(e.target.value)}
                  placeholder="Add resource URL"
                />
                <button
                  type="button"
                  onClick={handleAddAttachment}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
          
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              name="isPreview"
              id="isPreview"
              checked={formData.isPreview}
              onChange={handleChange}
            />
            <label htmlFor="isPreview">Make this a preview lesson</label>
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Lesson'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseLessons;