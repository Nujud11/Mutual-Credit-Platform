const pageInformation = {
    dashboard: {
      title: "الرئيسية",
      description: "نظرة عامة على نشاط شركتك داخل الشبكة",
    },
  
    marketplace: {
      title: "سوق الخدمات",
      description: "اكتشف الخدمات التي تقدمها الشركات الأخرى",
    },
  
    "my-services": {
      title: "خدماتي",
      description: "إدارة الخدمات التي تقدمها شركتك",
    },
  
    transactions: {
      title: "المعاملات",
      description: "متابعة طلبات الخدمات والمعاملات الائتمانية",
    },
  
    recommendations: {
      title: "الفرص الذكية",
      description: "توصيات ذكية تساعد شركتك على تحسين رصيدها",
    },

    "platform-guide": {
      title: "دليل المنصة",
      description: "تعرف على فكرة مقاصة وآلية عملها ورصيد MQ",
    },

    "admin-registration-requests": {
      title: "طلبات تسجيل المنشآت",
      description:
        "مراجعة طلبات الانضمام واعتماد حسابات المنشآت",
    },


      
  };
  
  export function getPageInformation(pageId) {
    return (
      pageInformation[pageId]
      ?? pageInformation.dashboard
    );
  }