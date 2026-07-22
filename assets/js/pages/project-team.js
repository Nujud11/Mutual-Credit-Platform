const projectTeamMembers = [
    {
      icon: "👤",
      name: "اسم الطالب الأول",
      role: "طالب مشارك",
      city: "",
      school: "",
      bio: "",
      email: "",
    },
    {
      icon: "👤",
      name: "اسم الطالب الثاني",
      role: "طالب مشارك",
      city: "",
      school: "",
      bio: "",
      email: "",
    },
    {
      icon: "👤",
      name: "اسم الطالب الثالث",
      role: "طالب مشارك",
      city: "",
      school: "",
      bio: "",
      email: "",
    },
    {
      icon: "👤",
      name: "اسم الطالب الرابع",
      role: "طالب مشارك",
      city: "",
      school: "",
      bio: "",
      email: "",
    },
    {
      icon: "👤",
      name: "اسم الطالب الخامس",
      role: "طالب مشارك",
      city: "",
      school: "",
      bio: "",
      email: "",
    },
    {
      icon: "👤",
      name: "اسم الطالب السادس",
      role: "طالب مشارك",
      city: "",
      school: "",
      bio: "",
      email: "",
    },
  ];
  
  const projectSupervisors = [
    {
      icon: "👩🏻‍💻",
      name: "نجود العبيد",
      role: "المطور التقني للمشروع",
      city: "",
      school: "",
      bio: "",
      email: "",
      featured: true,
    },
    {
      icon: "👨🏻‍🏫",
      name: "اسم معلم المسار",
      role: "معلم المسار",
      city: "",
      school: "",
      bio: "",
      featured: true,
    },
  ];
  
  export function renderProjectTeamPage() {
    return `
      <section class="project-team-page">
  
        <section class="project-team-hero">
          <span class="project-team-label">
            برنامج مدن المستقبل
          </span>
  
          <h2>
            فريق المشروع
          </h2>
  
          <p>
            مسار اقتصاد النيون — جمعية بصمات
          </p>
        </section>
  
        <section class="project-team-section">
          <div class="project-team-section-header">
            <h3>
              الطلاب المشاركون
            </h3>
  
            <p>
              أعضاء فريق المشروع المشاركون في تطوير الفكرة وعرضها.
            </p>
          </div>
  
          <div class="project-team-grid">
            ${projectTeamMembers
              .map(renderTeamMemberCard)
              .join("")}
          </div>
        </section>
  
        <section class="project-team-section">
          <div class="project-team-section-header">
            <h3>
              التطوير والإشراف
            </h3>
  
            <p>
              المشرفون على تنفيذ المشروع ودعم الفريق.
            </p>
          </div>
  
          <div class="project-team-grid project-team-grid--supervisors">
            ${projectSupervisors
              .map(renderTeamMemberCard)
              .join("")}
          </div>
        </section>
  
        <footer class="project-team-footer">
          <strong>
            مقاصة
          </strong>
  
          <span>
            مشروع مقدم ضمن برنامج مدن المستقبل
            التابع لجمعية بصمات
            في مسار اقتصاد النيون.
          </span>
        </footer>
  
      </section>
    `;
  }
  
  export function initializeProjectTeamPage() {
    // الصفحة حاليًا تعريفية ولا تحتاج أحداث JavaScript.
  }
  
  function renderTeamMemberCard(member) {
    const optionalInformation = [
      member.city
        ? `
          <div class="project-member-detail">
            <span>📍</span>
            <p>${escapeHtml(member.city)}</p>
          </div>
        `
        : "",
  
      member.school
        ? `
          <div class="project-member-detail">
            <span>🏫</span>
            <p>${escapeHtml(member.school)}</p>
          </div>
        `
        : "",
  
      member.bio
        ? `
          <p class="project-member-bio">
            ${escapeHtml(member.bio)}
          </p>
        `
        : "",

        member.email
        ? `
            <a
            class="project-member-contact"
            href="mailto:${escapeHtml(member.email)}"
            >
            ✉️
            <span>
                ${escapeHtml(member.email)}
            </span>
            </a>
        `
        : "",
    ].join("");
  
    return `
      <article
        class="
          project-member-card
          ${
            member.featured
              ? "project-member-card--featured"
              : ""
          }
        "
      >
        <div class="project-member-icon">
          ${member.icon}
        </div>
  
        <div class="project-member-main">
          <h4>
            ${escapeHtml(member.name)}
          </h4>
  
          <span class="project-member-role">
            ${escapeHtml(member.role)}
          </span>
        </div>
  
        ${
          optionalInformation
            ? `
              <div class="project-member-details">
                ${optionalInformation}
              </div>
            `
            : ""
        }
      </article>
    `;
  }
  
  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }