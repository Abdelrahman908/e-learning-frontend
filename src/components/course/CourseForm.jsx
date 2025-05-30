import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import CourseService from '../../services/courses';
import LoadingSpinner from '../ui/LoadingSpinner';
import FileUpload from '../ui/FileUpload';

const CourseForm = ({ isEdit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories, loading: categoriesLoading } = useCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    if (isEdit && id) {
      const fetchCourse = async () => {
        try {
          const response = await CourseService.getCourseById(id);
          const course = response.data;
          
          reset({
            name: course.name,
            description: course.description,
            price: course.price,
            isActive: course.isActive,
            categoryId: course.categoryId
          });
          
          if (course.imageUrl) {
            setPreviewImage(course.imageUrl);
          }
        } catch (err) {
          setError(err.response?.data?.message || 'فشل في تحميل بيانات الدورة');
        }
      };
      
      fetchCourse();
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = {
        ...data,
        price: parseFloat(data.price),
        isActive: data.isActive === 'true',
        categoryId: parseInt(data.categoryId),
        image: data.image?.[0] || null
      };

      let response;
      if (isEdit) {
        response = await CourseService.updateCourse(id, formData);
      } else {
        response = await CourseService.createCourse(formData);
      }

      navigate(isEdit 
        ? `/instructor/courses/${id}`
        : `/instructor/courses/${response.data.id}`
      );
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ أثناء حفظ الدورة');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('image', [file]);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  if (categoriesLoading) return <LoadingSpinner />;

  return (
    <div className="course-form-container">
      <h2>{isEdit ? 'تعديل الدورة' : 'إنشاء دورة جديدة'}</h2>
      
      {error && <div className="message message-error">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="name">اسم الدورة *</label>
          <input
            id="name"
            type="text"
            {...register('name', { required: 'اسم الدورة مطلوب' })}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && (
            <span className="error-message">{errors.name.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description">وصف الدورة *</label>
          <textarea
            id="description"
            rows="5"
            {...register('description', { required: 'وصف الدورة مطلوب' })}
            className={errors.description ? 'error' : ''}
          />
          {errors.description && (
            <span className="error-message">{errors.description.message}</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">السعر (ج.م) *</label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              {...register('price', { 
                required: 'السعر مطلوب',
                min: { value: 0, message: 'يجب أن يكون السعر رقم موجب' }
              })}
              className={errors.price ? 'error' : ''}
            />
            {errors.price && (
              <span className="error-message">{errors.price.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="categoryId">التصنيف *</label>
            <select
              id="categoryId"
              {...register('categoryId', { required: 'التصنيف مطلوب' })}
              className={errors.categoryId ? 'error' : ''}
            >
              <option value="">اختر تصنيفاً</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <span className="error-message">{errors.categoryId.message}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="isActive">حالة الدورة</label>
            <select
              id="isActive"
              {...register('isActive')}
            >
              <option value="true">نشطة</option>
              <option value="false">غير نشطة</option>
            </select>
          </div>

          <div className="form-group">
            <label>صورة الدورة</label>
            <FileUpload
              accept="image/*"
              onChange={handleImageChange}
              preview={previewImage}
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="small" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <span>{isEdit ? 'حفظ التعديلات' : 'إنشاء الدورة'}</span>
            )}
          </button>
          
          <button 
            type="button" 
            className="btn btn-outline"
            onClick={() => navigate(-1)}
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;