import {
    createCompanyAccount,
    getCompanyProfile,
    loginCompany,
    logoutCompany,
  } from "./firebase-auth-repository.js";
  
  
  const CURRENT_USER_STORAGE_KEY =
    "mutualCreditCurrentUser";
  
  
  export async function registerCompany(
    registrationData,
  ) {
    try {
      const company =
        await createCompanyAccount(
          registrationData,
        );
  

  
      return {
        success: true,
        user: company,
      };
  
    } catch (error) {
      console.error(
        "تعذر إنشاء الحساب:",
        error,
      );
  
      return {
        success: false,
        message:
          getAuthenticationErrorMessage(
            error,
          ),
      };
    }
  }
  
  
  export async function login({
    email,
    password,
  }) {
    try {
      const company =
        await loginCompany(
          email,
          password,
        );

        if (company.accountStatus === "pending") {
          return {
            success: false,
            accountStatus: "pending",
          };
        }
        
        if (company.accountStatus === "rejected") {
          return {
            success: false,
            accountStatus: "rejected",
          };
        }
  
      setCurrentUser(company);
  
      return {
        success: true,
        user: company,
      };
  
    } catch (error) {
      console.error(
        "تعذر تسجيل الدخول:",
        error,
      );
  
      return {
        success: false,
        message:
          getAuthenticationErrorMessage(
            error,
          ),
      };
    }
  }
  
  
  export function setCurrentUser(
    user,
  ) {
    localStorage.setItem(
      CURRENT_USER_STORAGE_KEY,
      JSON.stringify(user),
    );
  }
  
  
  export function getCurrentUser() {
    const storedUser =
      localStorage.getItem(
        CURRENT_USER_STORAGE_KEY,
      );
  
    if (!storedUser) {
      return null;
    }
  
    try {
      return JSON.parse(
        storedUser,
      );
  
    } catch (error) {
      console.error(
        "تعذر قراءة المستخدم الحالي:",
        error,
      );
  
      return null;
    }
  }
  
  
  export async function refreshCurrentUser(
    companyId,
  ) {
    const freshCompany =
      await getCompanyProfile(
        companyId,
      );
  
    setCurrentUser(
      freshCompany,
    );
  
    return freshCompany;
  }
  
  
  export async function logout() {
    try {
      await logoutCompany();
  
    } finally {
      localStorage.removeItem(
        CURRENT_USER_STORAGE_KEY,
      );
    }
  }
  
  
  function getAuthenticationErrorMessage(
    error,
  ) {
    const errorCode =
      error?.code
      ?? error?.message;
  
    const messages = {
      "auth/email-already-in-use":
        "يوجد حساب مسجل بهذا البريد الإلكتروني.",
  
      "auth/invalid-email":
        "صيغة البريد الإلكتروني غير صحيحة.",
  
      "auth/weak-password":
        "كلمة المرور ضعيفة. استخدم 6 أحرف على الأقل.",
  
      "auth/invalid-credential":
        "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
  
      "auth/user-not-found":
        "لا يوجد حساب مسجل بهذا البريد الإلكتروني.",
  
      "auth/wrong-password":
        "كلمة المرور غير صحيحة.",
  
      "auth/network-request-failed":
        "تعذر الاتصال بالخادم. تحقق من اتصال الإنترنت.",
  
      "auth/too-many-requests":
        "تم إجراء محاولات كثيرة. حاول مرة أخرى لاحقًا.",
  
      "company-profile-not-found":
        "تم العثور على الحساب، لكن بيانات الشركة غير موجودة.",
    };
  
    return (
      messages[errorCode]
      ?? "حدث خطأ غير متوقع. حاول مرة أخرى."
    );
  }