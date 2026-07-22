const projectTeamMembers = [
    {
      icon: "👤",
      name: "اسم الطالب الأول",
      role: "طالب مشارك",
      city: "مدينة الطالب",
      school: "مدرسة الطالب",
      bio: "تعريف مختصر عن الطالب، واهتماماته.",
      email: "ايميل الطالب ",
    },
    {
      icon: "👤",
      name: "اسم الطالب الثاني",
      role: "طالب مشارك",
      city: "مدينة الطالب",
      school: "مدرسة الطالب",
      bio: "تعريف مختصر عن الطالب، واهتماماته.",
      email: "ايميل الطالب ",
    },
    {
      icon: "👤",
      name: "اسم الطالب الثالث",
      role: "طالب مشارك",
      city: "مدينة الطالب",
      school: "مدرسة الطالب",
      bio: "تعريف مختصر عن الطالب، واهتماماته.",
      email: "ايميل الطالب ",
    },
    {
      icon: "👤",
      name: "اسم الطالب الرابع",
      role: "طالب مشارك",
      city: "مدينة الطالب",
      school: "مدرسة الطالب",
      bio: "تعريف مختصر عن الطالب، واهتماماته.",
      email: "ايميل الطالب ",
    },
    {
      icon: "👤",
      name: "اسم الطالب الخامس",
      role: "طالب مشارك",
      city: "مدينة الطالب",
      school: "مدرسة الطالب",
      bio: "تعريف مختصر عن الطالب، واهتماماته.",
      email: "ايميل الطالب ",
    },
    {
      icon: "👤",
      name: "اسم الطالب السادس",
      role: "طالب مشارك",
      city: "مدينة الطالب",
      school: "مدرسة الطالب",
      bio: "تعريف مختصر عن الطالب، واهتماماته.",
      email: "ايميل الطالب ",
    },
  ];
  
  const projectSupervisors = [
    {
        icon: "👨🏻‍🏫",
        name: "د. عمر العديل",
        role: "مشرف المسار",
        city: "الأحساء",
        school: "",
        bio: "تعريف مختصر عن المشرف، خبراته، ومجال تخصصه.",
        email: "ايميل المشرف",
        featured: true,
    },
    {
        icon: "👩🏻‍💻",
        name: "نجود العبيد",
        role: "المطور التقني للمشروع",
        city: "الأحساء",
        school: "",
        bio: "تعريف مختصر عن المطور التقني، خبراته، ومجال تخصصه.",
        email: "ايميل المطور التقني",
        featured: true,
    },
  ];
  
  export function renderProjectTeamPage() {
    return `
      <section class="project-team-page">
  
        <section class="project-team-hero">
          <span class="project-team-label">
            جمعية بصمات
          </span>
  
          <h2>
            فريق مشروع المقاصة
          </h2>
  
          <p>
              برنامج مدن المستقبل ٢٠٢٦ - مسار اقتصاد النيون
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
              الإشراف والتطوير 
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
    const metaItems = [
      member.city
        ? `
          <span class="project-member-tag">
            ${escapeHtml(member.city)}
          </span>
        `
        : "",
  
      member.school
        ? `
          <span class="project-member-tag">
            ${escapeHtml(member.school)}
          </span>
        `
        : "",
    ]
      .filter(Boolean)
      .join("");
  
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
          metaItems
            ? `
              <div class="project-member-tags">
                ${metaItems}
              </div>
            `
            : ""
        }
  
        ${
          member.bio
            ? `
              <p class="project-member-bio">
                ${escapeHtml(member.bio)}
              </p>
            `
            : ""
        }
  
        ${
          member.email
            ? `
              <a
                class="project-member-contact"
                href="mailto:${escapeHtml(member.email)}"
              >
                تواصل عبر البريد
              </a>
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