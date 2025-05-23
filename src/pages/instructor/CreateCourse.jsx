import React, { useEffect, useState } from "react";
import CourseService from "../services/courses";
import CategoryService from "../services/categories";
import { useNavigate } from "react-router-dom";

const CreateCourse = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    isActive: true,
    categoryId: "",
  });
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await CategoryService.getAll();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? +value : value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("isActive", form.isActive);
      formData.append("categoryId", form.categoryId);
      if (image) formData.append("image", image);

      await CourseService.createCourse(formData);
      setMessage({ type: "success", text: "✅ تم إنشاء الكورس بنجاح!" });

      // بعد ثوانٍ ننتقل إلى صفحة الكورسات
      setTimeout(() => navigate("/courses"), 2000);
    } catch (err) {
      setMessage({ type: "error", text: "❌ حدث خطأ أثناء إنشاء الكورس." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold text-center mb-6">📘 إنشاء كورس جديد</h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded text-center ${
            message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <div>
          <label className="block mb-1 font-medium">اسم الكورس</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2"
            placeholder="مثال: مقدمة في البرمجة"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">الوصف</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full border border-gray-300 rounded p-2"
            placeholder="ما الذي سيتعلمه الطالب؟"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">السعر (بالجنيه)</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2"
            min="0"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">التصنيف</label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          >
            <option value="">اختر التصنيف</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">صورة الكورس</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
            className="accent-blue-600"
          />
          <label htmlFor="isActive" className="font-medium">مفعل</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "جاري الإنشاء..." : "إنشاء الكورس"}
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
