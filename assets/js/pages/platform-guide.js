export function renderPlatformGuidePage() {
    return `
      <div class="platform-guide-page">
  
        <section class="guide-hero">
  
          <div class="guide-hero-content">
  
            <span class="guide-eyebrow">
              دليل منصة مقاصة
            </span>
  
            <h2>
              تبادل الخدمات بين المنشآت
              بطريقة أكثر مرونة وذكاءً
            </h2>
  
            <p>
              مقاصة هي شبكة ائتمان متبادل
              تساعد المنشآت على الحصول على الخدمات
              وتقديمها باستخدام رصيد رقمي داخلي،
              دون الحاجة إلى الدفع النقدي الفوري
              لكل معاملة.
            </p>
  
            <div class="guide-hero-tags">
  
              <span>
                ائتمان متبادل
              </span>
  
              <span>
                ذكاء اصطناعي
              </span>
  
              <span>
                خدمات بين المنشآت
              </span>
  
              <span>
                رصيد MQ
              </span>
  
            </div>
  
          </div>
  
          <div class="guide-hero-visual">
  
            <div class="guide-hero-logo">
              م
            </div>
  
            <strong>
              مقاصة
            </strong>
  
            <span>
              شبكة الائتمان المتبادل
            </span>
  
          </div>
  
        </section>
  
  
        <section class="guide-overview-grid">
  
          ${renderOverviewCard({
            icon: "◇",
            title: "للمنشآت",
            description:
              "منصة مصممة لدعم تبادل الخدمات بين المنشآت الأعضاء.",
          })}
  
          ${renderOverviewCard({
            icon: "⇄",
            title: "ائتمان متبادل",
            description:
              "الحصول على الخدمات مقابل رصيد داخلي بدل الدفع الفوري.",
          })}
  
          ${renderOverviewCard({
            icon: "MQ",
            title: "رصيد رقمي",
            description:
              "رصيد داخلي يعكس قيمة الخدمات المتبادلة داخل الشبكة.",
          })}
  
          ${renderOverviewCard({
            icon: "✦",
            title: "ذكاء اصطناعي",
            description:
              "تقييم المخاطر واقتراح الفرص المناسبة لكل منشأة.",
          })}
  
        </section>
  
  
        <section class="guide-section guide-introduction-section">
  
          <div class="guide-section-heading">
  
            <span class="guide-section-number">
              01
            </span>
  
            <div>
              <span class="guide-section-label">
                عن المنصة
              </span>
  
              <h3>
                ما هي مقاصة؟
              </h3>
            </div>
  
          </div>
  
          <div class="guide-introduction-grid">
  
            <div class="guide-introduction-content">
  
              <p>
                <strong>مقاصة</strong>
                هي منصة رقمية للائتمان المتبادل
                تربط المنشآت التي تحتاج إلى خدمات
                بمنشآت أخرى تستطيع تقديمها.
              </p>
  
              <p>
                بدل أن تدفع المنشأة قيمة كل خدمة
                نقدًا وبشكل فوري، تستطيع تنفيذ
                المعاملة باستخدام رصيد
                <strong>MQ</strong>
                داخل الشبكة، ثم تعويض الرصيد لاحقًا
                من خلال تقديم خدمات لمنشآت أخرى.
              </p>
  
              <p>
                تعتمد المنصة على سجل المعاملات
                وبيانات المنشأة للمساعدة في تقييم
                مستوى الثقة والمخاطر والحد الائتماني،
                بالإضافة إلى اقتراح فرص تبادل مناسبة.
              </p>
  
            </div>
  
            <div class="guide-definition-card">
  
              <span>
                رؤية مقاصة
              </span>
  
              <strong>
                تحويل الخدمات والموارد المتاحة
                لدى المنشآت إلى فرص تعاون متبادلة،
                بما يعزز الاستفادة منها
                ويرفع كفاءة الأعمال داخل الشبكة.
              </strong>

  
            </div>
  
          </div>
  
        </section>
  
  
        <section class="guide-section">
  
          <div class="guide-section-heading">
  
            <span class="guide-section-number">
              02
            </span>
  
            <div>
              <span class="guide-section-label">
                المشكلة والحل
              </span>
  
              <h3>
                لماذا نحتاج إلى مقاصة؟
              </h3>
            </div>
  
          </div>
  
          <div class="problem-solution-grid">
  
            <article class="guide-comparison-card guide-problem-card">
  
              <div class="guide-comparison-heading">
                <span class="guide-comparison-icon">
                  !
                </span>
  
                <h4>
                  التحديات الحالية
                </h4>
              </div>
  
              <ul>
                <li>
                  حاجة بعض المنشآت إلى الحفاظ
                  على السيولة النقدية.
                </li>
  
                <li>
                  وجود خدمات وموارد غير مستغلة
                  لدى منشآت أخرى.
                </li>
  
                <li>
                  صعوبة العثور على شركاء أعمال
                  موثوقين لتبادل الخدمات.
                </li>
  
                <li>
                  عدم وجود تقييم واضح للمخاطر
                  والثقة بين الأطراف.
                </li>
              </ul>
  
            </article>
  
  
            <article class="guide-comparison-card guide-solution-card">
  
              <div class="guide-comparison-heading">
                <span class="guide-comparison-icon">
                  ✓
                </span>
  
                <h4>
                  حل مقاصة
                </h4>
              </div>
  
              <ul>
                <li>
                  سوق موحد لعرض الخدمات
                  واكتشافها.
                </li>
  
                <li>
                  استخدام رصيد MQ بدل الدفع
                  النقدي الفوري.
                </li>
  
                <li>
                  سجل معاملات يساعد على بناء
                  الثقة داخل الشبكة.
                </li>
  
                <li>
                  تحليل ذكي للفرص والمخاطر
                  والحدود الائتمانية.
                </li>
              </ul>
  
            </article>
  
          </div>
  
        </section>
  
  
        <section class="guide-section guide-workflow-section">
  
          <div class="guide-section-heading">
  
            <span class="guide-section-number">
              03
            </span>
  
            <div>
              <span class="guide-section-label">
                رحلة المستخدم
              </span>
  
              <h3>
                كيف تعمل المنصة؟
              </h3>
            </div>
  
          </div>
  
          <div class="guide-workflow">
  
            ${renderWorkflowStep({
              number: "1",
              title: "تسجيل المنشأة",
              description:
                "تضيف المنشأة بياناتها الأساسية ونوع نشاطها ومعلوماتها التجارية.",
            })}
  
            ${renderWorkflowStep({
              number: "2",
              title: "تحليل البيانات",
              description:
                "يحلل النظام بيانات المنشأة لتقدير مستوى الثقة والمخاطر.",
            })}
  
            ${renderWorkflowStep({
              number: "3",
              title: "تحديد الحد الائتماني",
              description:
                "يتم منح المنشأة حدًا ائتمانيًا مناسبًا لاستخدامه داخل الشبكة.",
            })}
  
            ${renderWorkflowStep({
              number: "4",
              title: "عرض الخدمات",
              description:
                "تضيف المنشأة الخدمات التي تستطيع تقديمها لبقية الأعضاء.",
            })}
  
            ${renderWorkflowStep({
              number: "5",
              title: "طلب خدمة",
              description:
                "تختار المنشأة خدمة مناسبة من سوق الخدمات وتقدم طلبًا.",
            })}
  
            ${renderWorkflowStep({
              number: "6",
              title: "تنفيذ المعاملة",
              description:
                "بعد إتمام الخدمة، ينتقل رصيد MQ من طالب الخدمة إلى مقدمها.",
            })}
  
            ${renderWorkflowStep({
              number: "7",
              title: "تحديث السجل",
              description:
                "يُحدث الرصيد وسجل المعاملات ودرجة الثقة لكل منشأة.",
            })}
  
            ${renderWorkflowStep({
              number: "8",
              title: "اقتراح فرص جديدة",
              description:
                "يقترح النظام خدمات وفرص تبادل مناسبة بناءً على النشاط.",
            })}
  
          </div>
  
        </section>
  
  
        <section class="guide-section guide-mq-section">
  
          <div class="guide-section-heading">
  
            <span class="guide-section-number">
              04
            </span>
  
            <div>
              <span class="guide-section-label">
                الرصيد الداخلي
              </span>
  
              <h3>
                ما هو MQ؟
              </h3>
            </div>
  
          </div>
  
          <div class="guide-mq-grid">
  
            <div class="guide-mq-main-card">
  
              <div class="guide-mq-symbol">
                MQ
              </div>
  
              <div>
  
                <h4>
                  رصيد مقاصة الرقمي
                </h4>
  
                <p>
                  MQ هو الرصيد الرقمي الداخلي
                  الذي يمثل قيمة الخدمات المتبادلة
                  بين أعضاء شبكة مقاصة.
                </p>
  
                <p>
                  تحصل المنشأة على MQ عندما تقدم
                  خدمة، وتستخدمه عندما تطلب خدمة
                  من منشأة أخرى.
                </p>
  
              </div>
  
            </div>
  
            <div class="guide-mq-features">
  
              ${renderFeatureItem(
                "ليس عملة مشفرة",
                "لا يتم تداوله في أسواق العملات الرقمية.",
              )}
  
              ${renderFeatureItem(
                "لا يحتاج إلى محفظة",
                "لا يتطلب أي محفظة خارجية.",
              )}
  
              ${renderFeatureItem(
                "للاستخدام الداخلي",
                "يستخدم فقط داخل شبكة مقاصة.",
              )}
  
              ${renderFeatureItem(
                "يمثل قيمة الخدمات",
                "كل رصيد يعكس قيمة خدمة تم تقديمها أو طلبها.",
              )}
  
            </div>
  
          </div>
  
        </section>
  
  
        <section class="guide-section">
  
          <div class="guide-section-heading">
  
            <span class="guide-section-number">
              05
            </span>
  
            <div>
              <span class="guide-section-label">
                التقنية الذكية
              </span>
  
              <h3>
                دور الذكاء الاصطناعي
              </h3>
            </div>
  
          </div>
  
          <div class="guide-ai-grid">
  
            ${renderAiCard({
              icon: "◫",
              title: "تحليل بيانات المنشأة",
              description:
                "تحليل معلومات النشاط والعمر والسجل والبيانات المتاحة.",
            })}
  
            ${renderAiCard({
              icon: "✓",
              title: "درجة الثقة",
              description:
                "تقدير درجة تساعد على قياس موثوقية المنشأة داخل الشبكة.",
            })}
  
            ${renderAiCard({
              icon: "⌁",
              title: "تقييم المخاطر",
              description:
                "تصنيف مستوى المخاطر بناءً على البيانات ونشاط المعاملات.",
            })}
  
            ${renderAiCard({
              icon: "◇",
              title: "الحد الائتماني",
              description:
                "اقتراح حد ائتماني مناسب لاستخدام المنشأة داخل المنصة.",
            })}
  
            ${renderAiCard({
              icon: "✦",
              title: "مطابقة الخدمات",
              description:
                "اقتراح خدمات تتوافق مع احتياجات المنشأة ونوع نشاطها.",
            })}
  
            ${renderAiCard({
              icon: "↗",
              title: "تحسين النشاط",
              description:
                "تقديم توصيات تساعد المنشأة على تحسين رصيدها وفرصها.",
            })}
  
          </div>
  
        </section>
  
  
        <section class="guide-section">
  
          <div class="guide-section-heading">
  
            <span class="guide-section-number">
              06
            </span>
  
            <div>
              <span class="guide-section-label">
                مثال توضيحي
              </span>
  
              <h3>
                كيف تنتقل قيمة الخدمة؟
              </h3>
            </div>
  
          </div>
  
          <div class="guide-example-card">
  
            <div class="guide-example-company">
  
              <span class="guide-example-avatar">
                م
              </span>
  
              <strong>
                مطعم
              </strong>
  
              <small>
                يحتاج إلى تصميم هوية
              </small>
  
              <div class="guide-example-balance">
                1,200 MQ
              </div>
  
            </div>
  
  
            <div class="guide-example-transfer">
  
              <span>
                خدمة تصميم
              </span>
  
              <strong>
                300 MQ
              </strong>
  
              <div class="guide-transfer-line">
                <span>
                  ←
                </span>
              </div>
  
              <small>
                يتم الخصم بعد إتمام الخدمة
              </small>
  
            </div>
  
  
            <div class="guide-example-company">
  
              <span class="guide-example-avatar">
                ت
              </span>
  
              <strong>
                شركة تصميم
              </strong>
  
              <small>
                تقدم خدمة التصميم
              </small>
  
              <div class="guide-example-balance">
                450 MQ
              </div>
  
            </div>
  
          </div>
  
  
          <div class="guide-example-result">
  
            <div>
              <span>
                رصيد المطعم بعد المعاملة
              </span>
  
              <strong>
                900 MQ
              </strong>
            </div>
  
            <div>
              <span>
                رصيد شركة التصميم بعد المعاملة
              </span>
  
              <strong>
                750 MQ
              </strong>
            </div>
  
          </div>
  
        </section>
  
  
        <section class="guide-section">
  
          <div class="guide-section-heading">
  
            <span class="guide-section-number">
              07
            </span>
  
            <div>
              <span class="guide-section-label">
                القيمة المضافة
              </span>
  
              <h3>
                فوائد منصة مقاصة
              </h3>
            </div>
  
          </div>
  
          <div class="guide-benefits-grid">
  
            ${renderBenefitCard(
              "تقليل الضغط على السيولة",
              "الحصول على الخدمات دون دفع نقدي فوري لكل معاملة.",
            )}
  
            ${renderBenefitCard(
              "استثمار الموارد المتاحة",
              "تحويل الخدمات غير المستغلة إلى رصيد قابل للاستخدام.",
            )}
  
            ${renderBenefitCard(
              "زيادة فرص التعاون",
              "ربط المنشآت بشركاء وخدمات جديدة داخل الشبكة.",
            )}
  
            ${renderBenefitCard(
              "تعزيز الثقة",
              "الاعتماد على سجل معاملات وتقييمات واضحة.",
            )}
  
            ${renderBenefitCard(
              "قرارات مدعومة بالبيانات",
              "استخدام التحليل الذكي لتقدير المخاطر والحدود.",
            )}
  
            ${renderBenefitCard(
              "رفع كفاءة التبادل",
              "تسريع الوصول إلى الخدمات المناسبة للمنشأة.",
            )}
  
          </div>
  
        </section>
  
  
        <section class="guide-section guide-faq-section">
  
          <div class="guide-section-heading">
  
            <span class="guide-section-number">
              08
            </span>
  
            <div>
              <span class="guide-section-label">
                الأسئلة الشائعة
              </span>
  
              <h3>
                كل ما تحتاج معرفته
              </h3>
            </div>
  
          </div>
  
          <div class="guide-faq-list">
  
            ${renderFaqItem({
              question:
                "ما هي منصة مقاصة؟",
              answer:
                "منصة رقمية للائتمان المتبادل تتيح للمنشآت عرض الخدمات وطلبها باستخدام رصيد داخلي بدل الدفع النقدي الفوري لكل معاملة.",
            })}
  
            ${renderFaqItem({
              question:
                "ما هو MQ؟",
              answer:
                "MQ هو الرصيد الرقمي الداخلي المستخدم لتمثيل قيمة الخدمات المتبادلة بين أعضاء شبكة مقاصة.",
            })}
  
            ${renderFaqItem({
              question:
                "هل MQ عملة مشفرة؟",
              answer:
                "لا. MQ ليس عملة مشفرة ولا أصلًا استثماريًا، وإنما وحدة رصيد داخلية خاصة بالمنصة.",
            })}
  
            ${renderFaqItem({
              question:
                "هل أحتاج إلى محفظة رقمية؟",
              answer:
                "لا. يتم حفظ الرصيد وإدارته مباشرة داخل حساب المنشأة في مقاصة.",
            })}
  
            ${renderFaqItem({
              question:
                "كيف تحصل المنشأة على MQ؟",
              answer:
                "تحصل المنشأة على رصيد MQ عندما تقدم خدمة ناجحة لمنشأة أخرى داخل الشبكة.",
            })}
  
            ${renderFaqItem({
              question:
                "ماذا يحدث عندما تطلب المنشأة خدمة؟",
              answer:
                "بعد إتمام الخدمة، تُخصم قيمتها من رصيد المنشأة الطالبة وتُضاف إلى رصيد المنشأة المقدمة للخدمة.",
            })}
  
            ${renderFaqItem({
              question:
                "ماذا يعني الرصيد السالب؟",
              answer:
                "يعني أن المنشأة استخدمت جزءًا من حدها الائتماني للحصول على خدمات، ويمكنها تحسين الرصيد من خلال تقديم خدمات لأعضاء آخرين.",
            })}
  
            ${renderFaqItem({
              question:
                "كيف يتم تحديد الحد الائتماني؟",
              answer:
                "يُقترح الحد الائتماني بالاعتماد على بيانات المنشأة ودرجة الثقة ومستوى المخاطر وسجل النشاط داخل المنصة.",
            })}
  
            ${renderFaqItem({
              question:
                "كيف يستخدم الذكاء الاصطناعي؟",
              answer:
                "يستخدم لتحليل بيانات المنشأة وتقدير الثقة والمخاطر واقتراح الحد الائتماني ومطابقة الخدمات والفرص المناسبة.",
            })}
  
            ${renderFaqItem({
              question:
                "هل يمكن تحويل MQ إلى نقد؟",
              answer:
                "في النموذج الحالي، MQ رصيد داخلي مخصص لتبادل الخدمات داخل المنصة ولا يتم سحبه أو تداوله نقديًا.",
            })}
  
            ${renderFaqItem({
              question:
                "هل منصة مقاصة الحالية منتج نهائي؟",
              answer:
                "النسخة الحالية نموذج تجريبي يوضح فكرة الائتمان المتبادل وآلية تبادل الخدمات ودور الذكاء الاصطناعي.",
            })}
  
          </div>
  
        </section>
  
  
        <section class="guide-footer-card">
  
          <div>
            <span>
              مقاصة
            </span>
  
            <strong>
              شبكة الائتمان المتبادل
            </strong>
          </div>
  
          <p>
            نموذج تجريبي لتسهيل تبادل الخدمات
            ودعم التعاون بين المنشآت.
          </p>
  
        </section>
  
      </div>
    `;
  }
  
  
  export function initializePlatformGuidePage() {
    const faqButtons =
      document.querySelectorAll(
        ".guide-faq-question",
      );
  
    faqButtons.forEach(
      (button) => {
        button.addEventListener(
          "click",
          () => {
            const faqItem =
              button.closest(
                ".guide-faq-item",
              );
  
            if (!faqItem) {
              return;
            }
  
            const isOpen =
              faqItem.classList.contains(
                "open",
              );
  
            document
              .querySelectorAll(
                ".guide-faq-item.open",
              )
              .forEach(
                (openItem) => {
                  openItem.classList.remove(
                    "open",
                  );
  
                  const openButton =
                    openItem.querySelector(
                      ".guide-faq-question",
                    );
  
                  if (openButton) {
                    openButton.setAttribute(
                      "aria-expanded",
                      "false",
                    );
                  }
                },
              );
  
            if (!isOpen) {
              faqItem.classList.add(
                "open",
              );
  
              button.setAttribute(
                "aria-expanded",
                "true",
              );
            }
          },
        );
      },
    );
  }
  
  
  function renderOverviewCard({
    icon,
    title,
    description,
  }) {
    return `
      <article class="guide-overview-card">
  
        <span class="guide-overview-icon">
          ${icon}
        </span>
  
        <h3>
          ${title}
        </h3>
  
        <p>
          ${description}
        </p>
  
      </article>
    `;
  }
  
  
  function renderWorkflowStep({
    number,
    title,
    description,
  }) {
    return `
      <article class="guide-workflow-step">
  
        <span class="guide-workflow-number">
          ${number}
        </span>
  
        <div>
          <h4>
            ${title}
          </h4>
  
          <p>
            ${description}
          </p>
        </div>
  
      </article>
    `;
  }
  
  
  function renderFeatureItem(
    title,
    description,
  ) {
    return `
      <article class="guide-feature-item">
  
        <span>
          ✓
        </span>
  
        <div>
          <strong>
            ${title}
          </strong>
  
          <p>
            ${description}
          </p>
        </div>
  
      </article>
    `;
  }
  
  
  function renderAiCard({
    icon,
    title,
    description,
  }) {
    return `
      <article class="guide-ai-card">
  
        <span class="guide-ai-icon">
          ${icon}
        </span>
  
        <h4>
          ${title}
        </h4>
  
        <p>
          ${description}
        </p>
  
      </article>
    `;
  }
  
  
  function renderBenefitCard(
    title,
    description,
  ) {
    return `
      <article class="guide-benefit-card">
  
        <span class="guide-benefit-check">
          ✓
        </span>
  
        <div>
          <h4>
            ${title}
          </h4>
  
          <p>
            ${description}
          </p>
        </div>
  
      </article>
    `;
  }
  
  
  function renderFaqItem({
    question,
    answer,
  }) {
    return `
      <article class="guide-faq-item">
  
        <button
          class="guide-faq-question"
          type="button"
          aria-expanded="false"
        >
  
          <span>
            ${question}
          </span>
  
          <span class="guide-faq-plus">
            +
          </span>
  
        </button>
  
        <div class="guide-faq-answer">
  
          <p>
            ${answer}
          </p>
  
        </div>
  
      </article>
    `;
  }