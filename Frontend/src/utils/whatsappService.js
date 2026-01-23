/**
 * WhatsApp Service - إرسال الطلبات عبر واتساب
 * يقوم بتنسيق بيانات الطلب وإنشاء رسالة واتساب
 */

export const formatOrderMessage = (cart, customerInfo, total) => {
    const { fullName, phone, address } = customerInfo;

    let message = `🛍️ *طلب جديد من متجر Beta Medical*\n\n`;
    message += `👤 *العميل:* ${fullName}\n`;
    message += `📱 *الهاتف:* ${phone}\n`;
    message += `📍 *العنوان:* ${address}\n\n`;
    message += `📦 *المنتجات:*\n`;
    message += `━━━━━━━━━━━━━━━\n`;

    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name}\n`;
        message += `   العدد: ${item.quantity} × ${item.price} ج.م\n`;
        message += `   المجموع: ${item.quantity * item.price} ج.م\n\n`;
    });

    message += `━━━━━━━━━━━━━━━\n`;
    message += `💰 *الإجمالي الكلي:* ${total} ج.م\n\n`;
    message += `✨ شكراً لتسوقك من Beta Medical`;

    return message;
};

export const sendWhatsAppOrder = (cart, customerInfo, total, phoneNumber) => {
    // phoneNumber should be in format: 201234567890 (country code + number without +)
    const message = formatOrderMessage(cart, customerInfo, total);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // فتح واتساب في نافذة جديدة
    window.open(whatsappUrl, '_blank');

    return true;
};

// رقم واتساب افتراضي - يمكن تغييره
export const STORE_WHATSAPP_NUMBER = '201093177862'; // غير هذا الرقم لرقمك الفعلي
