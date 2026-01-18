// Listen for print click
document.getElementById('btn-print').addEventListener('click', () => {
    window.print();
});

// Load data
chrome.storage.local.get("generatedResumeData", (result) => {
    const data = result.generatedResumeData;
    if (!data) {
        document.getElementById('resume-page').innerHTML = '<p style="color: red; text-align: center;">No resume data found. Please try generating again.</p>';
        return;
    }
    renderResume(data);
});

function renderResume(data) {
    const container = document.getElementById('resume-page');

    container.innerHTML = `
      <header class="header-content">
        <h1>${escapeHtml(data.header.name)}</h1>
        <div class="contact-line">
          ${data.header.email ? `<span class="contact-item">${escapeHtml(data.header.email)}</span>` : ''}
          ${data.header.phone ? `<span class="separator">|</span><span class="contact-item">${escapeHtml(data.header.phone)}</span>` : ''}
          ${data.header.location ? `<span class="separator">|</span><span class="contact-item">${escapeHtml(data.header.location)}</span>` : ''}
          ${data.header.linkedin ? `<span class="separator">|</span><span class="contact-item"><a href="${escapeHtml(data.header.linkedin)}" target="_blank">LinkedIn</a></span>` : ''}
          ${data.header.portfolio ? `<span class="separator">|</span><span class="contact-item"><a href="${escapeHtml(data.header.portfolio)}" target="_blank">Portfolio</a></span>` : ''}
        </div>
      </header>
      
      ${data.summary ? `
      <section>
        <h2>Professional Summary</h2>
        <p>${escapeHtml(data.summary)}</p>
      </section>
      ` : ''}

      ${data.skills && data.skills.length ? `
      <section>
        <h2>Core Competencies</h2>
        <div class="skills-section">
          ${data.skills.map(skill => `<span class="skill-pill">${escapeHtml(skill)}</span>`).join('')}
        </div>
      </section>
      ` : ''}

      ${data.experience && data.experience.length ? `
      <section>
        <h2>Professional Experience</h2>
        ${data.experience.map(exp => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-title">${escapeHtml(exp.role)}</div>
              <div class="entry-meta">${escapeHtml(exp.date || '')}</div>
            </div>
            <div class="entry-subtitle">${escapeHtml(exp.company)}</div>
            <ul>
              ${exp.points.map(point => `<li>${escapeHtml(point)}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </section>
      ` : ''}

      ${data.projects && data.projects.length ? `
      <section>
        <h2>Key Projects</h2>
        ${data.projects.map(proj => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-title">${escapeHtml(proj.name)}</div>
            </div>
             ${proj.link ? `<div style="font-size:9pt; margin-bottom:0.25rem;"><a href="${escapeHtml(proj.link)}" target="_blank">${escapeHtml(proj.link)}</a></div>` : ''}
            <p style="margin-bottom: 0.5rem; font-style: italic;">${escapeHtml(proj.description)}</p>
            <ul>
              ${proj.points.map(point => `<li>${escapeHtml(point)}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </section>
      ` : ''}
      
      ${data.education && data.education.length ? `
      <section>
        <h2>Education</h2>
        ${data.education.map(edu => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-title">${escapeHtml(edu.school)}</div>
              <div class="entry-meta">${escapeHtml(edu.date || '')}</div>
            </div>
            <div class="entry-subtitle">${escapeHtml(edu.degree)}</div>
          </div>
        `).join('')}
      </section>
      ` : ''}
    `;
}

function escapeHtml(unsafe) {
    if (!unsafe) return "";
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
