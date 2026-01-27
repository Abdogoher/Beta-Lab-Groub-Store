import React, { useState, useEffect } from "react";
import { offersAPI } from "../../services/api";
import {
  FiTrash2,
  FiPlus,
  FiX,
  FiCalendar,
  FiUpload,
  FiDollarSign,
} from "react-icons/fi";

const OffersSetting = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image_url: null,
    original_price: "",
    discounted_price: "",
    start_date: "",
    end_date: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await offersAPI.getAll();
      setOffers(res.data || []);
    } catch (err) {
      console.error("Failed to load data", err);
      setError("فشل في تحميل العروض");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      if (file) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("original_price", formData.original_price);
      data.append("discounted_price", formData.discounted_price);
      data.append("start_date", formData.start_date);
      data.append("end_date", formData.end_date);

      if (imageFile) {
        data.append("image", imageFile);
      }

      await offersAPI.create(data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess("تم إضافة العرض بنجاح");
      setShowForm(false);
      resetForm();
      loadData();
    } catch (err) {
      console.error("Operation failed", err);
      setError("حدث خطأ أثناء تنفيذ العملية. تأكد من صحة البيانات.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا العرض؟")) {
      try {
        await offersAPI.delete(id);
        setSuccess("تم حذف العرض بنجاح");
        loadData();
      } catch (err) {
        console.error("Delete failed", err);
        setError("فشل حذف العرض");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      image_url: null,
      original_price: "",
      discounted_price: "",
      start_date: "",
      end_date: "",
    });
    setImagePreview(null);
    setImageFile(null);
  };

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          إدارة العروض
        </h1>
        <button
          className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
            showForm
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
          onClick={() => {
            if (showForm) {
              setShowForm(false);
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
        >
          {showForm ? (
            <>
              <FiX /> إغلاق
            </>
          ) : (
            <>
              <FiPlus /> إضافة عرض جديد
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 relative text-right">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 relative text-right">
          {success}
        </div>
      )}

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
            إضافة عرض جديد
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  اسم العرض
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="مثلاً: عرض الشتاء المميز"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <FiUpload className="text-gray-600 dark:text-gray-300" />
                  <span className="text-gray-700 dark:text-gray-300">
                    اختر صورة
                  </span>
                  <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-16 w-16 object-cover rounded-lg border border-gray-200"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  السعر الأصلي
                </label>
                <div className="flex gap-2">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm">
                    <FiDollarSign />
                  </span>
                  <input
                    type="number"
                    name="original_price"
                    value={formData.original_price}
                    onChange={handleChange}
                    required
                    step="0.01"
                    className="w-full px-4 py-2 border rounded-l-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  السعر بعد الخصم
                </label>
                <div className="flex gap-2">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm">
                    <FiDollarSign />
                  </span>
                  <input
                    type="number"
                    name="discounted_price"
                    value={formData.discounted_price}
                    onChange={handleChange}
                    required
                    step="0.01"
                    className="w-full px-4 py-2 border rounded-l-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  تاريخ البدء
                </label>
                <div className="flex gap-2">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm">
                    <FiCalendar />
                  </span>
                  <input
                    type="datetime-local"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-l-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  تاريخ الانتهاء
                </label>
                <div className="flex gap-2">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm">
                    <FiCalendar />
                  </span>
                  <input
                    type="datetime-local"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-l-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                حفظ العرض
              </button>
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700 p-6">
        <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
          قائمة العروض الحالية ({offers.length})
        </h3>
        {loading ? (
          <div className="text-center py-8 text-gray-500">جاري التحميل...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-3 text-gray-500 font-medium text-center">
                    الصورة
                  </th>
                  <th className="pb-3 text-gray-500 font-medium">الاسم</th>
                  <th className="pb-3 text-gray-500 font-medium">
                    السعر الأصلي
                  </th>
                  <th className="pb-3 text-gray-500 font-medium">سعر العرض</th>
                  <th className="pb-3 text-gray-500 font-medium">الخصم</th>
                  <th className="pb-3 text-gray-500 font-medium">الفترة</th>
                  <th className="pb-3 text-gray-500 font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {offers.map((offer) => {
                  const imgUrl = offer.image_url?.startsWith("http")
                    ? offer.image_url
                    : `http://localhost:3000${offer.image_url}`;
                  return (
                    <tr
                      key={offer.id}
                      className="group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="py-3 text-center">
                        <img
                          src={imgUrl}
                          alt={offer.name}
                          className="h-12 w-20 object-cover rounded-lg mx-auto shadow-sm"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/150?text=No+Image";
                          }}
                        />
                      </td>
                      <td className="py-3">
                        <div className="text-gray-800 dark:text-gray-200 font-medium">
                          {offer.name}
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="line-through text-gray-400">
                          {offer.original_price} $
                        </span>
                      </td>
                      <td className="py-3 text-red-600 font-bold">
                        {offer.discounted_price} $
                      </td>
                      <td className="py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {offer.discount_percentage}%
                        </span>
                      </td>
                      <td className="py-3 text-gray-500 text-sm">
                        <div>
                          من:{" "}
                          {new Date(offer.start_date).toLocaleDateString(
                            "ar-EG",
                          )}
                        </div>
                        <div>
                          إلى:{" "}
                          {new Date(offer.end_date).toLocaleDateString("ar-EG")}
                        </div>
                      </td>
                      <td className="py-3 flex gap-2">
                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          onClick={() => handleDelete(offer.id)}
                          title="حذف"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {offers.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-500">
                      لا يوجد عروض حالياً
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OffersSetting;
