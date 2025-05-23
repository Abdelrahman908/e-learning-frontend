import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CourseService from "../../services/courses.js";


const UpdateCourseWithImage = ({ courseId, token }) => {
  const [form, setForm] = useState({
    Name: "",
    Title: "",
    Description: "",
    Price: "",
    IsActive: false,
    CategoryId: "",
    InstructorId: "",
    ImageFile: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // جلب بيانات الكورس الحالي للعرض في الفورم
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/Course/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("فشل في جلب بيانات الكورس");

        const data = await res.json();
        setForm({
          Name: data.name || "",
          Title: data.title || "",
          Description: data.description || "",
          Price: data.price || "",
          IsActive: data.isActive || false,
          CategoryId: data.categoryId || "",
          InstructorId: data.instructorId || "",
          ImageFile: null,
        });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCourse();
  }, [courseId, token]);

  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;

    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("Name", form.Name);
      formData.append("Title", form.Title);
      formData.append("Description", form.Description);
      formData.append("Price", form.Price);
      formData.append("IsActive", form.IsActive);
      formData.append("CategoryId", form.CategoryId);
      formData.append("InstructorId", form.InstructorId);
      if (form.ImageFile) {
        formData.append("ImageFile", form.ImageFile);
      }

      const res = await fetch(`/api/Course/update-with-image/${courseId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // ملاحظة: لا تضف Content-Type عند استخدام formData لأن المتصفح يتعامل معه تلقائياً
        },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "خطأ في تحديث الكورس");
      }

      const data = await res.json();
      setSuccessMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">تحديث الكورس مع صورة</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {successMessage && <p className="text-green-600 mb-2">{successMessage}</p>}

      <label>اسم الكورس</label>
      <input
        type="text"
        name="Name"
        value={form.Name}
        onChange={handleChange}
        required
        className="border p-2 mb-2 w-full"
      />

      <label>العنوان</label>
      <input
        type="text"
        name="Title"
        value={form.Title}
        onChange={handleChange}
        className="border p-2 mb-2 w-full"
      />

      <label>الوصف</label>
      <textarea
        name="Description"
        value={form.Description}
        onChange={handleChange}
        required
        className="border p-2 mb-2 w-full"
      />

      <label>السعر</label>
      <input
        type="number"
        name="Price"
        value={form.Price}
        onChange={handleChange}
        required
        className="border p-2 mb-2 w-full"
      />

      <label>
        <input
          type="checkbox"
          name="IsActive"
          checked={form.IsActive}
          onChange={handleChange}
          className="mr-2"
        />
        مفعل
      </label>

      <label>معرف التصنيف</label>
      <input
        type="number"
        name="CategoryId"
        value={form.CategoryId}
        onChange={handleChange}
        required
        className="border p-2 mb-2 w-full"
      />

      <label>معرف المدرس</label>
      <input
        type="number"
        name="InstructorId"
        value={form.InstructorId}
        onChange={handleChange}
        required
        className="border p-2 mb-2 w-full"
      />

      <label>الصورة</label>
      <input type="file" name="ImageFile" onChange={handleChange} />

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
      >
        {loading ? "جارٍ التحديث..." : "تحديث"}
      </button>
    </form>
  );
};

export default UpdateCourseWithImage;
