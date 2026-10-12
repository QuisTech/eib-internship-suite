// ===================================================
// EIB STRATOC LIMITED • SIWES SUITE APPLICATION LOGIC
// ===================================================

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const tabButtons = document.querySelectorAll('.tab-btn');
  const docViews = document.querySelectorAll('.doc-view');
  const printBtn = document.getElementById('printBtn');
  const downloadWordBtn = document.getElementById('downloadWordBtn');
  const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
  const sidebar = document.getElementById('sidebar');

  // Input Fields
  const studentNameInput = document.getElementById('studentNameInput');
  const matricNoInput = document.getElementById('matricNoInput');
  const levelInput = document.getElementById('levelInput');
  const institutionInput = document.getElementById('institutionInput');
  const facultyInput = document.getElementById('facultyInput');
  const departmentInput = document.getElementById('departmentInput');
  const durationInput = document.getElementById('durationInput');
  const refNoInput = document.getElementById('refNoInput');
  const startDateInput = document.getElementById('startDateInput');
  const endDateInput = document.getElementById('endDateInput');
  const unitInput = document.getElementById('unitInput');
  const hrNameInput = document.getElementById('hrNameInput');
  const hrTitleInput = document.getElementById('hrTitleInput');
  const stampRadioInputs = document.querySelectorAll('input[name="stampStyle"]');
  const signatureStyleSelect = document.getElementById('signatureStyleSelect');
  const presetButtons = document.querySelectorAll('.preset-btn');
  const scoreInputs = document.querySelectorAll('.score-input');

  // Editing Toolbar Elements
  const toggleHighlightBoxes = document.getElementById('toggleHighlightBoxes');
  const btnBold = document.getElementById('btnBold');
  const btnItalic = document.getElementById('btnItalic');
  const btnUnderline = document.getElementById('btnUnderline');
  const btnResetDoc = document.getElementById('btnResetDoc');

  // Image elements across all documents
  const stampImages = [
    document.getElementById('letterStampImg'),
    document.getElementById('formStampImg'),
    document.getElementById('certStampImg')
  ];

  const sigImages = [
    document.getElementById('letterSigImg'),
    document.getElementById('formSigImg'),
    document.getElementById('certSigImg')
  ];

  // Helper: Use embedded ASSETS if available, otherwise relative path
  function getAssetUrl(filename) {
    if (typeof ASSETS !== 'undefined' && ASSETS[filename]) {
      return ASSETS[filename];
    }
    return `assets/${filename}`;
  }

  // 1. TAB SWITCHING
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      docViews.forEach(v => v.classList.remove('active'));

      btn.classList.add('active');
      const targetId = `view-${btn.dataset.tab}`;
      const targetView = document.getElementById(targetId);
      if (targetView) {
        targetView.classList.add('active');
      }
    });
  });

  // 2. TOGGLE SIDEBAR
  if (toggleSidebarBtn) {
    toggleSidebarBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
    });
  }

  // 3. PRINT / SAVE AS PDF
  printBtn.addEventListener('click', () => {
    window.print();
  });

  // 4. DOWNLOAD WORD DOCUMENT (.docx)
  downloadWordBtn.addEventListener('click', () => {
    const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
    let fileName = 'EIB_Internship_Completion_Letter.docx';
    if (activeTab === 'form') {
      fileName = 'EIB_SIWES_Evaluation_Form.docx';
    }
    
    // Create download link
    const link = document.createElement('a');
    link.href = fileName;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // 5. LIVE DATA BINDING (Sidebar -> Document)
  let isInternalSync = false;

  function updateAllBindings(sourceElem) {
    if (isInternalSync) return;
    isInternalSync = true;

    const name = studentNameInput.value.trim() || '[Student Name]';
    const matric = matricNoInput.value.trim() || '[Matric No]';
    const level = levelInput.value;
    const inst = institutionInput.value.trim() || '[Institution Name]';
    const faculty = facultyInput.value.trim() || '[Faculty]';
    const dept = departmentInput.value.trim() || '[Department]';
    const duration = durationInput.value;
    const ref = refNoInput.value.trim() || 'EIB/HR/SIWES/2026/042';
    const start = startDateInput.value.trim() || '14th April, 2026';
    const end = endDateInput.value.trim() || '9th October, 2026';
    const unit = unitInput.value.trim() || 'Operations & Technical Services Division';
    const hrName = hrNameInput.value.trim() || 'Marquis';
    const hrTitle = hrTitleInput.value.trim() || 'Head of Human Resources & Talent Development';

    const firstName = name.split(' ')[0] || name;

    const updateGroup = (selector, val) => {
      document.querySelectorAll(selector).forEach(el => {
        if (el !== sourceElem) {
          el.textContent = val;
        }
      });
    };

    updateGroup('.bind-name', name);
    updateGroup('.bind-fname', firstName);
    updateGroup('.bind-matric', matric);
    updateGroup('.bind-level', level);
    updateGroup('.bind-inst', inst);
    updateGroup('.bind-faculty', faculty);
    updateGroup('.bind-dept', dept);
    updateGroup('.bind-duration', duration);
    updateGroup('.bind-ref', ref);
    updateGroup('.bind-start', start);
    updateGroup('.bind-end', end);
    updateGroup('.bind-unit', unit);
    updateGroup('.bind-hr-name', hrName);
    updateGroup('.bind-hr-title', hrTitle);

    isInternalSync = false;
  }

  // Attach input listeners for sidebar inputs
  const inputsToListen = [
    studentNameInput, matricNoInput, levelInput, institutionInput, facultyInput,
    departmentInput, durationInput, refNoInput, startDateInput, endDateInput,
    unitInput, hrNameInput, hrTitleInput
  ];

  inputsToListen.forEach(input => {
    input.addEventListener('input', () => updateAllBindings(input));
    input.addEventListener('change', () => updateAllBindings(input));
  });

  // 6. TWO-WAY LIVE SYNC (Document -> Sidebar & Other Tabs)
  document.querySelectorAll('.a4-sheet').forEach(sheet => {
    // When typing directly inside document
    sheet.addEventListener('input', (e) => {
      const target = e.target;
      const text = target.textContent.trim();

      if (target.classList.contains('bind-name')) {
        studentNameInput.value = text;
        updateAllBindings(target);
      } else if (target.classList.contains('bind-matric')) {
        matricNoInput.value = text;
        updateAllBindings(target);
      } else if (target.classList.contains('bind-inst')) {
        institutionInput.value = text;
        updateAllBindings(target);
      } else if (target.classList.contains('bind-dept')) {
        departmentInput.value = text;
        updateAllBindings(target);
      } else if (target.classList.contains('bind-faculty')) {
        facultyInput.value = text;
        updateAllBindings(target);
      } else if (target.classList.contains('bind-ref')) {
        refNoInput.value = text;
        updateAllBindings(target);
      } else if (target.classList.contains('bind-start')) {
        startDateInput.value = text;
        updateAllBindings(target);
      } else if (target.classList.contains('bind-end')) {
        endDateInput.value = text;
        updateAllBindings(target);
      } else if (target.classList.contains('bind-unit')) {
        unitInput.value = text;
        updateAllBindings(target);
      } else if (target.classList.contains('bind-hr-name')) {
        hrNameInput.value = text;
        updateAllBindings(target);
      } else if (target.classList.contains('bind-hr-title')) {
        hrTitleInput.value = text;
        updateAllBindings(target);
      }
    });

    // Make sure clicking or double clicking ANY element activates edit mode
    sheet.addEventListener('click', (e) => {
      const el = e.target.closest('p, h1, h2, h3, td, th, span, div:not(.a4-sheet):not(.letterhead):not(.form-header)');
      if (el && !el.hasAttribute('contenteditable')) {
        el.setAttribute('contenteditable', 'true');
      }
      if (el && el.getAttribute('contenteditable') === 'true') {
        el.focus();
      }
    });

    sheet.addEventListener('dblclick', (e) => {
      const el = e.target.closest('p, h1, h2, h3, td, th, span, div:not(.a4-sheet):not(.letterhead):not(.form-header)');
      if (el) {
        el.setAttribute('contenteditable', 'true');
        el.focus();

        // Select all text in the clicked block for quick overtyping
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
    });
  });

  // 7. EDITING TOOLBAR CONTROLS
  if (toggleHighlightBoxes) {
    toggleHighlightBoxes.addEventListener('change', () => {
      document.body.classList.toggle('highlight-editable', toggleHighlightBoxes.checked);
    });
  }

  if (btnBold) {
    btnBold.addEventListener('click', () => {
      document.execCommand('bold', false, null);
    });
  }

  if (btnItalic) {
    btnItalic.addEventListener('click', () => {
      document.execCommand('italic', false, null);
    });
  }

  if (btnUnderline) {
    btnUnderline.addEventListener('click', () => {
      document.execCommand('underline', false, null);
    });
  }

  if (btnResetDoc) {
    btnResetDoc.addEventListener('click', () => {
      if (confirm('Reset document to default template values?')) {
        presetButtons[0].click(); // Reset to tech preset
      }
    });
  }

  // 8. STAMP SWITCHER
  function updateStampStyle() {
    const selectedRadio = document.querySelector('input[name="stampStyle"]:checked');
    if (!selectedRadio) return;
    const style = selectedRadio.value;

    let stampSrc = '';
    if (style === 'recreated_marquis') {
      stampSrc = getAssetUrl('stamp_recreated_marquis.png');
    } else if (style === 'original_photo') {
      stampSrc = getAssetUrl('stamp_original_photo_clean.png');
    } else if (style === 'blank') {
      stampSrc = getAssetUrl('stamp_recreated_blank.png');
    }

    stampImages.forEach(img => {
      if (img) img.src = stampSrc;
    });
  }

  stampRadioInputs.forEach(r => r.addEventListener('change', updateStampStyle));

  // 9. SIGNATURE SWITCHER
  function updateSignatureStyle() {
    const style = signatureStyleSelect.value;
    sigImages.forEach(img => {
      if (!img) return;
      if (style === 'none') {
        img.style.visibility = 'hidden';
      } else {
        img.style.visibility = 'visible';
        if (style === 'pen') {
          img.src = getAssetUrl('marquis_signature_pen.png');
        } else {
          img.src = getAssetUrl('marquis_signature.png');
        }
      }
    });
  }

  signatureStyleSelect.addEventListener('change', updateSignatureStyle);

  // 10. PERFORMANCE APPRAISAL MATRIX (FORM 8)
  const remarksText = [
    ['Needs improvement in arrival', 'Fair attendance', 'Good punctuality', 'Very punctual', 'Always on time; zero absences'],
    ['Needs technical training', 'Fair comprehension', 'Good competence', 'Very Good competence', 'Exceptional technical mastery'],
    ['Inconsistent output', 'Average quality', 'Neat execution', 'Very Good accuracy', 'Flawless precision & attention to detail'],
    ['Requires direct supervision', 'Shows some initiative', 'Good problem solver', 'Very proactive', 'Outstanding innovative thinker'],
    ['Struggles with teamwork', 'Fair collaboration', 'Good team player', 'Harmonious collaborator', 'Inspiring team leader & peer'],
    ['Occasional reminder needed', 'Fair rule adherence', 'Good compliance', 'Strictly observant', 'Exemplary conduct; zero infractions'],
    ['Incomplete entries', 'Fair documentation', 'Good logbook entries', 'Very thorough record', 'Meticulously kept; comprehensive records']
  ];

  function updateAppraisal() {
    let totalScore = 0;
    const maxScore = scoreInputs.length * 10;

    scoreInputs.forEach((input, idx) => {
      let val = parseInt(input.value, 10);
      if (isNaN(val) || val < 1) val = 1;
      if (val > 10) val = 10;
      input.value = val;
      totalScore += val;

      // Update table cell
      const scoreCell = document.querySelector(`.cell-score[data-c="${idx}"]`);
      if (scoreCell) {
        scoreCell.textContent = val;
        const row = scoreCell.closest('tr');
        if (row) {
          const pill = row.querySelector('.status-pill');
          const remarkTd = row.cells[4];

          // Determine rating
          let rating = 'Good';
          let pillClass = 'status-pill blue';
          let remarkIdx = 2;

          if (val === 10) {
            rating = 'Excellent';
            pillClass = 'status-pill green';
            remarkIdx = 4;
          } else if (val >= 8) {
            rating = 'Very Good';
            pillClass = 'status-pill blue';
            remarkIdx = 3;
          } else if (val >= 6) {
            rating = 'Good';
            pillClass = 'status-pill blue';
            remarkIdx = 2;
          } else if (val >= 4) {
            rating = 'Fair';
            pillClass = 'status-pill';
            remarkIdx = 1;
          } else {
            rating = 'Poor';
            pillClass = 'status-pill';
            remarkIdx = 0;
          }

          if (pill) {
            pill.textContent = rating;
            pill.className = pillClass;
          }

          if (remarkTd && remarksText[idx]) {
            remarkTd.textContent = remarksText[idx][remarkIdx];
          }
        }
      }
    });

    const percent = ((totalScore / maxScore) * 100).toFixed(1);
    const scoreStr = `${totalScore} / ${maxScore}`;

    // Update aggregate score badge in sidebar
    document.getElementById('aggregateScoreText').textContent = `${scoreStr} (${percent}%)`;

    // Update form Section C
    const formAgg = document.getElementById('formAggregateScore');
    const formPct = document.getElementById('formAggregatePercent');
    if (formAgg) formAgg.textContent = scoreStr;
    if (formPct) formPct.textContent = `${percent}%`;
  }

  scoreInputs.forEach(input => {
    input.addEventListener('input', updateAppraisal);
    input.addEventListener('change', updateAppraisal);
  });

  // 11. PRESETS
  const presets = {
    tech: {
      name: 'Oluwaseun Emmanuel Adeyemi',
      matric: '190407028',
      level: '400 Level (Undergraduate)',
      inst: 'University of Lagos (UNILAG)',
      faculty: 'Faculty of Science',
      dept: 'Computer Science',
      duration: 'six (6) months',
      start: '14th April, 2026',
      end: '9th October, 2026',
      unit: 'Operations & Technical Services Division',
      ref: 'EIB/HR/SIWES/2026/042',
      scores: [10, 9, 9, 9, 10, 10, 9]
    },
    eng: {
      name: 'Chidiebere Victor Okonkwo',
      matric: '2019/182049',
      level: '400 Level (Undergraduate)',
      inst: 'Federal University of Technology Owerri (FUTO)',
      faculty: 'School of Engineering & Engineering Tech',
      dept: 'Electrical & Electronics Engineering',
      duration: 'six (6) months',
      start: '4th May, 2026',
      end: '30th October, 2026',
      unit: 'Field Systems & Telecommunications Unit',
      ref: 'EIB/HR/SIWES/2026/058',
      scores: [10, 10, 9, 9, 10, 10, 10]
    },
    bus: {
      name: 'Amina Fatima Bello',
      matric: 'CU/2021/BUS/0942',
      level: '300 Level (Undergraduate)',
      inst: 'Covenant University, Ota',
      faculty: 'College of Management & Social Sciences',
      dept: 'Business Administration & Logistics',
      duration: 'three (3) months',
      start: '1st June, 2026',
      end: '28th August, 2026',
      unit: 'Corporate Strategy & Logistics Coordination',
      ref: 'EIB/HR/IT/2026/019',
      scores: [10, 9, 10, 9, 10, 10, 9]
    }
  };

  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const p = presets[btn.dataset.preset];
      if (!p) return;

      studentNameInput.value = p.name;
      matricNoInput.value = p.matric;
      levelInput.value = p.level;
      institutionInput.value = p.inst;
      facultyInput.value = p.faculty;
      departmentInput.value = p.dept;
      durationInput.value = p.duration;
      startDateInput.value = p.start;
      endDateInput.value = p.end;
      unitInput.value = p.unit;
      refNoInput.value = p.ref;

      p.scores.forEach((s, idx) => {
        if (scoreInputs[idx]) scoreInputs[idx].value = s;
      });

      updateAllBindings();
      updateAppraisal();
    });
  });

  // Initialize
  updateAllBindings();
  updateStampStyle();
  updateSignatureStyle();
  updateAppraisal();
});
