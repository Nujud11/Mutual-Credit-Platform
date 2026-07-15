# منصة مقاصة

بروتوتايب لمنصة الائتمان المتبادل والمقاصة بين المنشآت، مبني بـ HTML/CSS/JavaScript مع Firebase Authentication وCloud Firestore، وخادم Node.js صغير لحماية مفتاح Gemini.

## التشغيل محليًا

1. ثبّت Node.js 20 أو أحدث.
2. نفّذ:

```bash
npm install
```

3. أنشئ ملف `.env` للاستخدام المحلي أو مرّر المتغيرات من الطرفية:

```bash
export GEMINI_API_KEY="YOUR_NEW_KEY"
export GEMINI_MODEL="gemini-3.1-flash-lite"
npm start
```

4. افتح `http://localhost:3000`.

## النشر على Render

- أنشئ Web Service من مستودع GitHub.
- Runtime: Node.
- Build Command: `npm install`.
- Start Command: `npm start`.
- أضف `GEMINI_API_KEY` في Environment Variables.
- لا تضع مفتاح Gemini داخل ملفات JavaScript.

> مهم: المفتاح الذي كان موجودًا سابقًا داخل `assets/js/services/gemini-service.js` أصبح مكشوفًا ويجب إلغاؤه وإنشاء مفتاح جديد قبل النشر.
