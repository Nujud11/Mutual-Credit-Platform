const EMAILJS_CONFIG = {
  serviceId: "service_vp4csdl",
  templateId: "template_maxf0ph",
  publicKey: "XMT9dYpbI--L4GtAR",
};

const projectTeamMembers = [
  {
    name: "اسم الطالب الأول",
    city: "مدينة الطالب",
    email: "student1@example.com",
  },
  {
    name: "اسم الطالب الثاني",
    city: "مدينة الطالب",
    email: "student2@example.com",
  },
  {
    name: "اسم الطالب الثالث",
    city: "مدينة الطالب",
    email: "student3@example.com",
  },
  {
    name: "اسم الطالب الرابع",
    city: "مدينة الطالب",
    email: "student4@example.com",
  },
  {
    name: "اسم الطالب الخامس",
    city: "مدينة الطالب",
    email: "student5@example.com",
  },
  {
    name: "اسم الطالب السادس",
    city: "مدينة الطالب",
    email: "student6@example.com",
  },
];


const projectSupervisors = [
  {
    name: "د. عمر العديل",
    role: "مشرف المسار",
    email: "supervisor@example.com",
  },
  {
    name: "نجود العبيد",
    role: "المطور التقني للمشروع",
    email: "developer@example.com",
  },
];


export function renderProjectTeamPage() {
  return `
    <section class="contact-page">

      <section class="contact-hero">
        <span class="contact-hero-label">
          منصة مقاصة
        </span>

        <h2>
          تواصل معنا
        </h2>

        <p>
          نسعد باستقبال استفساراتكم واقتراحاتكم
          وملاحظاتكم، ونتطلع دائمًا إلى التعاون
          وتطوير تجربة منصة مقاصة.
        </p>
      </section>


      <section class="contact-layout">

        <aside class="contact-team-panel">
          <div class="contact-team-header">
            <span class="contact-team-label">
              فريق العمل
            </span>

            <h3>
              المشاركون في المشروع
            </h3>

            <p>
              بيانات مختصرة لأعضاء فريق المشروع
              والإشراف.
            </p>
          </div>


          <div class="contact-team-group">
            <h4>
              الطلاب المشاركون
            </h4>

            <div class="contact-team-list">
              ${projectTeamMembers
                .map(renderStudentItem)
                .join("")}
            </div>
          </div>


          <div class="contact-team-group">
            <h4>
              الإشراف والتطوير
            </h4>

            <div class="contact-team-list">
              ${projectSupervisors
                .map(renderSupervisorItem)
                .join("")}
            </div>
          </div>
        </aside>


        <section class="contact-form-panel">
          <div class="contact-form-header">
            <span class="contact-form-label">
              أرسل رسالتك
            </span>

            <h3>
              كيف يمكننا مساعدتك؟
            </h3>

            <p>
              املأ النموذج التالي، وسيتم إرسال
              رسالتك إلى فريق منصة مقاصة.
            </p>
          </div>


          <form
            class="contact-form"
            id="contact-form"
            novalidate
          >
            <div class="contact-form-field">
              <label for="contact-type">
                نوع التواصل
              </label>

              <select
                id="contact-type"
                name="contactType"
                required
              >
                <option value="">
                  اختر نوع التواصل
                </option>

                <option value="اقتراح">
                  اقتراح
                </option>

                <option value="استفسار">
                  استفسار
                </option>

                <option value="تعاون">
                  تعاون
                </option>

                <option value="شكوى">
                  شكوى
                </option>

                <option value="الإبلاغ عن مشكلة">
                  الإبلاغ عن مشكلة
                </option>

                <option value="أخرى">
                  أخرى
                </option>
              </select>

              <small
                class="contact-field-error"
                data-error-for="contact-type"
              ></small>
            </div>


            <div class="contact-form-field">
              <label for="contact-subject">
                عنوان الرسالة
              </label>

              <input
                id="contact-subject"
                name="subject"
                type="text"
                maxlength="100"
                placeholder="اكتب عنوانًا مختصرًا للرسالة"
                required
              />

              <small
                class="contact-field-error"
                data-error-for="contact-subject"
              ></small>
            </div>


            <div class="contact-form-field">
              <label for="contact-email">
                بريدك الإلكتروني
              </label>

              <input
                id="contact-email"
                name="email"
                type="email"
                maxlength="150"
                placeholder="name@example.com"
                dir="ltr"
                required
              />

              <small
                class="contact-field-error"
                data-error-for="contact-email"
              ></small>
            </div>


            <div class="contact-form-field">
              <label for="contact-message">
                الرسالة
              </label>

              <textarea
                id="contact-message"
                name="message"
                rows="8"
                maxlength="1500"
                placeholder="اكتب تفاصيل رسالتك هنا..."
                required
              ></textarea>

              <div class="contact-message-footer">
                <small
                  class="contact-field-error"
                  data-error-for="contact-message"
                ></small>

                <span id="contact-character-count">
                  0 / 1500
                </span>
              </div>
            </div>


            <div
              class="contact-form-status"
              id="contact-form-status"
              role="status"
              aria-live="polite"
            ></div>


            <button
              class="contact-submit-button"
              type="submit"
            >
              إرسال الرسالة
            </button>


            <p class="contact-form-note">
              سيتم توجيه الرسالة إلى بريد المنصة،
              ويمكن التواصل معك من خلال البريد
              الإلكتروني الذي أدخلته.
            </p>
          </form>
        </section>

      </section>


      <footer class="contact-footer">
        <strong>
          مقاصة
        </strong>

        <span>
          مشروع مقدم ضمن برنامج مدن المستقبل
          التابع لجمعية بصمات في مسار اقتصاد النيون.
        </span>
      </footer>

    </section>
  `;
}


export function initializeProjectTeamPage() {
  
  window.emailjs.init({  
    publicKey: EMAILJS_CONFIG.publicKey,
  });

  const contactForm =
    document.getElementById(
      "contact-form",
    );

  const messageInput =
    document.getElementById(
      "contact-message",
    );

  const characterCount =
    document.getElementById(
      "contact-character-count",
    );

  if (
    messageInput
    && characterCount
  ) {
    messageInput.addEventListener(
      "input",
      () => {
        characterCount.textContent =
          `${messageInput.value.length} / 1500`;
      },
    );
  }

  if (!contactForm) {
    return;
  }

  contactForm.addEventListener(
    "submit",
    handleContactFormSubmit,
  );
}


async function handleContactFormSubmit(event) {
  event.preventDefault();

  clearFormErrors();

  const form =
    event.currentTarget;

  const formData =
    new FormData(form);

  const contactType =
    String(
      formData.get("contactType") || "",
    ).trim();

  const subject =
    String(
      formData.get("subject") || "",
    ).trim();

  const senderEmail =
    String(
      formData.get("email") || "",
    ).trim();

  const message =
    String(
      formData.get("message") || "",
    ).trim();

  let isValid = true;


  if (!contactType) {
    showFieldError(
      "contact-type",
      "يرجى اختيار نوع التواصل.",
    );

    isValid = false;
  }


  if (subject.length < 3) {
    showFieldError(
      "contact-subject",
      "يرجى كتابة عنوان واضح للرسالة.",
    );

    isValid = false;
  }


  if (!isValidEmail(senderEmail)) {
    showFieldError(
      "contact-email",
      "يرجى إدخال بريد إلكتروني صحيح.",
    );

    isValid = false;
  }


  if (message.length < 10) {
    showFieldError(
      "contact-message",
      "يرجى كتابة تفاصيل الرسالة.",
    );

    isValid = false;
  }


  if (!isValid) {
    setFormStatus(
      "يرجى مراجعة الحقول المطلوبة.",
      "error",
    );

    return;
  }

  try {

    await window.emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      {
        contact_type: contactType,
        subject,
        sender_email: senderEmail,
        message,
        sent_at: new Date().toLocaleString("ar-SA"),
      }
    );
  
    form.reset();
  
    document.getElementById(
      "contact-character-count"
    ).textContent = "0 / 1500";
  
    setFormStatus(
      "تم إرسال رسالتك بنجاح.",
      "success",
    );
  
  }
  catch (error) {
  
    console.error(error);
  
    setFormStatus(
      "تعذر إرسال الرسالة.",
      "error",
    );
  
  }
}


function renderStudentItem(member) {
  return `
    <article class="contact-team-member">
      <div class="contact-member-heading">
        <strong>
          ${escapeHtml(member.name)}
        </strong>

        ${
          member.city
            ? `
              <span>
                ${escapeHtml(member.city)}
              </span>
            `
            : ""
        }
      </div>

      ${
        member.email
          ? `
            <a
              href="mailto:${escapeHtml(
                member.email,
              )}"
              dir="ltr"
            >
              ${escapeHtml(member.email)}
            </a>
          `
          : ""
      }
    </article>
  `;
}


function renderSupervisorItem(member) {
  return `
    <article
      class="
        contact-team-member
        contact-team-member--supervisor
      "
    >
      <div class="contact-member-heading">
        <strong>
          ${escapeHtml(member.name)}
        </strong>

        <span>
          ${escapeHtml(member.role)}
        </span>
      </div>

      ${
        member.email
          ? `
            <a
              href="mailto:${escapeHtml(
                member.email,
              )}"
              dir="ltr"
            >
              ${escapeHtml(member.email)}
            </a>
          `
          : ""
      }
    </article>
  `;
}


function showFieldError(
  fieldId,
  message,
) {
  const field =
    document.getElementById(fieldId);

  const errorElement =
    document.querySelector(
      `[data-error-for="${fieldId}"]`,
    );

  field?.classList.add(
    "contact-field-invalid",
  );

  if (errorElement) {
    errorElement.textContent =
      message;
  }
}


function clearFormErrors() {
  document
    .querySelectorAll(
      ".contact-field-invalid",
    )
    .forEach((element) => {
      element.classList.remove(
        "contact-field-invalid",
      );
    });

  document
    .querySelectorAll(
      ".contact-field-error",
    )
    .forEach((element) => {
      element.textContent = "";
    });

  setFormStatus("", "");
}


function setFormStatus(
  message,
  type,
) {
  const statusElement =
    document.getElementById(
      "contact-form-status",
    );

  if (!statusElement) {
    return;
  }

  statusElement.textContent =
    message;

  statusElement.className =
    "contact-form-status";

  if (type) {
    statusElement.classList.add(
      `contact-form-status--${type}`,
    );
  }
}


function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    .test(email);
}


function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
