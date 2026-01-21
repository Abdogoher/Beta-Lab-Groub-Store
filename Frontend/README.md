# متجر جوهر 💎

متجر إلكتروني متكامل مع backend كامل باستخدام Express.js و SQLite

## المیزات ✨

### Frontend
- 🎨 تصمیم عصري وجذاب مع دعم RTL للعربیة
- 🔐 نظام مصادقة کامل (تسجیل دخول/إنشاء حساب)
- 🛒 سلة تسوق متقدمة مع حفظ المنتجات
- 💝 قائمة مفضلة للمنتجات
- 🔍 بحث وفلترة متقدمة للمنتجات
- 📱 تصمیم متجاوب لجمیع الأجهزة
- 💬 إرسال الطلبات عبر WhatsApp
- ⚡ أداء سریع مع React + Vite

### Backend
-  🚀 Express.js REST API
- 💾 قاعدة بيانات SQLite
- 🔐 JWT Authentication
- 📦 إدارة كاملة للمنتجات والفئات
- 🛒 API للسلة والمفضلة
- 📝 نظام إدارة الطلبات

## التثبیت والتشغیل 🚀

### 1. تثبیت المكتبات

#### Frontend
```bash
npm install
```

#### Backend
```bash
cd server
npm install
```

### 2. إعداد قاعدة البيانات

```bash
cd server
npm run seed
```

سيتم إنشاء قاعدة البيانات وإضافة البيانات الأولية:
- **6 فئات** للمنتجات
- **8 منتجات** نموذجية
- **مستخدم تجريبي** للاختبار

**بيانات الدخول التجريبية:**
- البريد الإلكتروني: `demo@jawhar.com`
- كلمة المرور: `demo123`

### 3. تشغیل المشروع

يجب تشغيل الـ Backend والـ Frontend في نافذتي terminal منفصلتين:

#### تشغيل Backend (Terminal 1)
```bash
cd server
npm run dev
```
سيعمل Backend على: `http://localhost:3000`

#### تشغيل Frontend (Terminal 2)
```bash
npm run dev
```
سيعمل Frontend على: `http://localhost:5173`

### 4. بناء النسخة النهائیة

```bash
npm run build
```

## إعدادات WhatsApp 📱

لتفعیل إرسال الطلبات عبر WhatsApp:

1. افتح الملف: `src/utils/whatsappService.js`
2. قم بتغییر رقم الهاتف:

```javascript
export const STORE_WHATSAPP_NUMBER = '201234567890'; // ضع رقمك هنا
```

**ملاحظة:** یجب إدخال الرقم مع کود الدولة بدون علامة +
- مثال لمصر: `201234567890`
- مثال للسعودیة: `966512345678`

## هیکل المشروع 📁

```
mini-store/
├── server/                    # Backend (Express.js)
│   ├── config/
│   │   ├── database.js       # إعداد SQLite
│   │   └── seed.js           # بيانات أولية
│   ├── controllers/          # معالجات API
│   │   ├── authController.js
│   │   ├── productsController.js
│   │   ├── categoriesController.js
│   │   ├── cartController.js
│   │   ├── wishlistController.js
│   │   └── ordersController.js
│   ├── middleware/
│   │   └── auth.js           # JWT middleware
│   ├── routes/               # مسارات API
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── categories.js
│   │   ├── cart.js
│   │   ├── wishlist.js
│   │   └── orders.js
│   ├── .env                  # متغيرات البيئة
│   ├── server.js             # نقطة دخول Backend
│   └── package.json
│
├── src/                      # Frontend (React)
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── ProductCard.jsx
│   │   ├── HeroSlider.jsx
│   │   └── AuthModal.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Wishlist.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── WishlistContext.jsx
│   ├── services/
│   │   └── api.js            # طبقة خدمة API
│   ├── utils/
│   │   └── whatsappService.js
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
└── vite.config.js
```

## API Endpoints 🔌

### Authentication
- `POST /api/auth/register` - تسجيل مستخدم جديد
- `POST /api/auth/login` - تسجيل الدخول
- `GET /api/auth/me` - الحصول على المستخدم الحالي (protected)
- `PUT /api/auth/profile` - تحديث الملف الشخصي (protected)

### Products
- `GET /api/products` - جميع المنتجات (مع فلترة وترتيب)
- `GET /api/products/featured` - المنتجات المميزة
- `GET /api/products/:id` - منتج محدد
- `GET /api/products/category/:categoryId` - منتجات حسب الفئة

### Categories
- `GET /api/categories` - جميع الفئات
- `GET /api/categories/:id` - فئة محددة

### Cart (Protected)
- `GET /api/cart` - جلب السلة
- `POST /api/cart` - إضافة منتج للسلة
- `PUT /api/cart/:productId` - تحديث الكمية
- `DELETE /api/cart/:productId` - حذف من السلة
- `DELETE /api/cart` - تفريغ السلة

### Wishlist (Protected)
- `GET /api/wishlist` - جلب المفضلة
- `POST /api/wishlist` - إضافة للمفضلة
- `DELETE /api/wishlist/:productId` - حذف من المفضلة

### Orders (Protected)
- `POST /api/orders` - إنشاء طلب جديد
- `GET /api/orders` - جلب طلبات المستخدم
- `GET /api/orders/:id` - جلب طلب محدد

## قاعدة البيانات 💾

### الجداول

#### Users
- id, email, password, name, phone, created_at

#### Categories
- id, name, name_ar, description

#### Products
- id, name, name_ar, description, description_ar, price, discount_price, category_id, image, stock_quantity, is_featured, created_at

#### Cart
- id, user_id, product_id, quantity, created_at

#### Wishlist
- id, user_id, product_id, created_at

#### Orders
- id, user_id, total_amount, status, customer_name, customer_phone, customer_address, notes, created_at

#### Order_Items
- id, order_id, product_id, quantity, price_at_purchase

## متغيرات البيئة 🔐

في ملف `server/.env`:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d
DB_PATH=./database.sqlite
FRONTEND_URL=http://localhost:5173
```

## کیف یعمل نظام الطلبات؟ 🔄

1. المستخدم يجب أن يسجل دخول أولاً
2. يضیف المنتجات إلى السلة
3. يملأ نموذج الطلب (الاسم، الهاتف، العنوان)
4. عند الضغط على "تأکید الطلب":
   - يتم حفظ الطلب في قاعدة البيانات
   - يتم تفريغ السلة
   - يُفتح WhatsApp مع رسالة جاهزة
   - المستخدم يرسل الرسالة لرقم المتجر

## التقنیات المستخدمة 🛠️

### Frontend
- **React 18** - مکتبة واجهات المستخدم
- **Vite** - أداة البناء السریعة
- **React Router** - التنقل بین الصفحات
- **Axios** - HTTP Client
- **Swiper** - السلایدر المتقدم
- **React Icons** - الأیقونات
- **CSS3** - التصمیم

### Backend
- **Express.js** - إطار عمل Node.js
- **SQLite3** - قاعدة البيانات
- **bcryptjs** - تشفير كلمات المرور
- **jsonwebtoken** - JWT Authentication
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - إدارة متغيرات البيئة

## استكشاف الأخطاء 🔧

### خطأ في الاتصال بالـ Backend

تأكد من:
1. Backend يعمل على المنفذ 3000
2. Frontend يبحث عن API على `http://localhost:3000`
3. لا يوجد برنامج آخر يستخدم المنفذ 3000

### خطأ في المصادقة

- تأكد من صحة JWT_SECRET في ملف `.env`
- تحقق من أن التوكن موجود في localStorage

### السلة فارغة بعد تسجيل الدخول

- هذا طبيعي - السلة مرتبطة بالمستخدم
- سجل دخولك أولاً ثم أضف المنتجات

## المیزات المخططة 🎯

- [ ] صفحة تفاصیل المنتج
- [ ] صفحة من نحن
- [ ] صفحة اتصل بنا
- [ ] تقییمات المنتجات
- [ ] کوبونات الخصم
- [ ] لوحة تحكم للمدير

## الترخیص 📄

هذا المشروع مفتوح المصدر ومتاح للاستخدام الشخصي والتجاري.

---

صُنع بـ ❤️ لمتجر **جوهر**
