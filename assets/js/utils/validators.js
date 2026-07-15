export function isValidEmail(email) {
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    return emailPattern.test(email);
  }
  
  
  export function isValidPassword(password) {
    return password.length >= 6;
  }
  
  
  export function isRequired(value) {
    return String(value).trim().length > 0;
  }
  
  
  export function validateLoginData({
    email,
    password,
  }) {
    if (!isRequired(email)) {
      return "يرجى إدخال البريد الإلكتروني.";
    }
  
    if (!isValidEmail(email)) {
      return "صيغة البريد الإلكتروني غير صحيحة.";
    }
  
    if (!isRequired(password)) {
      return "يرجى إدخال كلمة المرور.";
    }
  
    if (!isValidPassword(password)) {
      return "يجب ألا تقل كلمة المرور عن 6 أحرف.";
    }
  
    return null;
  }
  
  
  export function validateRegistrationData(data) {
    if (!isRequired(data.companyName)) {
      return "يرجى إدخال اسم المنشأة.";
    }
  
    if (!isRequired(data.businessType)) {
      return "يرجى اختيار نوع النشاط.";
    }
  
    if (!isRequired(data.city)) {
      return "يرجى إدخال المدينة.";
    }
  
    if (!isValidEmail(data.email)) {
      return "صيغة البريد الإلكتروني غير صحيحة.";
    }
  
    if (!isValidPassword(data.password)) {
      return "يجب ألا تقل كلمة المرور عن 6 أحرف.";
    }
  
    if (data.password !== data.confirmPassword) {
      return "كلمتا المرور غير متطابقتين.";
    }
  
    return null;
  }