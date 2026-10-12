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
  
  // Duration Inputs (Months, Weeks, and Formatted Custom Text)
  const durationMonthsInput = document.getElementById('durationMonthsInput');
  const durationWeeksInput = document.getElementById('durationWeeksInput');
  const durationInput = document.getElementById('durationInput');
  const durationPills = document.querySelectorAll('.duration-pill');

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

  // Number to formal English words mapping for months
  const numWords = {
    1: 'one (1)', 2: 'two (2)', 3: 'three (3)', 4: 'four (4)',
    5: 'five (5)', 6: 'six (6)', 7: 'seven (7)', 8: 'eight (8)',
    9: 'nine (9)', 10: 'ten (10)', 11: 'eleven (11)', 12: 'twelve (12)'
  };

  function formatDurationText(months, weeks) {
    const m = parseInt(months, 10);
    const w = parseInt(weeks, 10);

    const hasM = !isNaN(m) && m > 0;
    const hasW = !isNaN(w) && w > 0;

    let mPart = '';
    let wPart = '';

    if (hasM) {
      if (m === 12) {
        mPart = 'one (1) year';
      } else {
        const mWord = numWords[m] || `${m}`;
        mPart = `${mWord} month${m > 1 ? 's' : ''}`;
      }
    }

    if (hasW) {
      wPart = `(${w} week${w > 1 ? 's' : ''})`;
    }

    if (hasM && hasW) {
      return `${mPart} ${wPart}`;
    } else if (hasM) {
      return mPart;
    } else if (hasW) {
      return `${w} week${w > 1 ? 's' : ''}`;
    }
    return 'six (6) months (24 weeks)';
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

  // 3. PRINT / SAVE AS PDF (Ensures clean paper output without any editing lines or boxes)
  function prepareCleanPrint() {
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
    const sel = window.getSelection();
    if (sel) sel.removeAllRanges();
    document.body.classList.remove('highlight-editable');
  }

  printBtn.addEventListener('click', () => {
    prepareCleanPrint();
    window.print();
  });

  window.addEventListener('beforeprint', () => {
    prepareCleanPrint();
  });

  window.addEventListener('afterprint', () => {
    if (toggleHighlightBoxes && toggleHighlightBoxes.checked) {
      document.body.classList.add('highlight-editable');
    }
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

    const name = studentNameInput.value.trim() || 'ADEMUWAGUN OLUWATIMILEHIN SAMUEL';
    const matric = matricNoInput.value.trim() || '23CJ03334';
    const level = levelInput.value;
    const inst = institutionInput.value.trim() || 'Covenant University';
    const faculty = facultyInput.value.trim() || 'EIE COMPUTER ENGINEERING';
    const dept = departmentInput.value.trim() || 'Computer Engineering';
    const duration = durationInput.value.trim() || '10 weeks';
    const ref = refNoInput.value.trim() || 'EIB/HR/2026/042';
    const start = startDateInput.value.trim() || '27th July, 2026';
    const end = endDateInput.value.trim() || '2nd October, 2026';
    const unit = unitInput.value.trim() || 'Research and Analysis Wing';
    const hrName = hrNameInput.value.trim() || 'Michael Marquis';
    const hrTitle = hrTitleInput.value.trim() || 'Group Head, Training & HRM (DICO)';

    const firstName = name.includes('ADEMUWAGUN') ? 'ADEMUWAGUN' : (name.split(' ')[0] || name);

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

  // 5B. DURATION CONTROLS HANDLING
  if (durationMonthsInput) {
    durationMonthsInput.addEventListener('input', () => {
      const m = parseInt(durationMonthsInput.value, 10);
      if (!isNaN(m) && m > 0) {
        // Auto-compute weeks if appropriate (4 weeks per month)
        const computedWeeks = m * 4;
        if (durationWeeksInput) {
          durationWeeksInput.value = computedWeeks;
        }
        durationInput.value = formatDurationText(m, computedWeeks);
      } else {
        durationInput.value = formatDurationText(0, durationWeeksInput ? durationWeeksInput.value : 0);
      }
      updateAllBindings(durationInput);
    });
  }

  if (durationWeeksInput) {
    durationWeeksInput.addEventListener('input', () => {
      const w = parseInt(durationWeeksInput.value, 10);
      const m = durationMonthsInput ? parseInt(durationMonthsInput.value, 10) : 0;
      durationInput.value = formatDurationText(m, w);
      updateAllBindings(durationInput);
    });
  }

  if (durationPills) {
    durationPills.forEach(pill => {
      pill.addEventListener('click', () => {
        durationPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const m = pill.dataset.m;
        const w = pill.dataset.w;

        if (durationMonthsInput) durationMonthsInput.value = m;
        if (durationWeeksInput) durationWeeksInput.value = w;
        durationInput.value = formatDurationText(m, w);

        updateAllBindings(durationInput);
      });
    });
  }

  // Attach input listeners for other sidebar inputs
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
      } else if (target.classList.contains('bind-duration')) {
        durationInput.value = text;
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
    samuel: {
      name: 'ADEMUWAGUN OLUWATIMILEHIN SAMUEL',
      matric: '23CJ03334',
      level: '400 Level (Undergraduate)',
      inst: 'Covenant University',
      faculty: 'EIE COMPUTER ENGINEERING',
      dept: 'Computer Engineering',
      duration: '10 weeks',
      months: 2.5,
      weeks: 10,
      start: '27th July, 2026',
      end: '2nd October, 2026',
      unit: 'Research and Analysis Wing',
      ref: 'EIB/HR/2026/042',
      hrName: 'Michael Marquis',
      hrTitle: 'Group Head, Training & HRM (DICO)',
      scores: [10, 9, 9, 9, 10, 10, 9]
    },
    tech: {
      name: 'Oluwaseun Emmanuel Adeyemi',
      matric: '190407028',
      level: '400 Level (Undergraduate)',
      inst: 'University of Lagos (UNILAG)',
      faculty: 'Faculty of Science',
      dept: 'Computer Science',
      duration: 'six (6) months (24 weeks)',
      months: 6,
      weeks: 24,
      start: '14th April, 2026',
      end: '9th October, 2026',
      unit: 'Operations & Technical Services Division',
      ref: 'EIB/HR/SIWES/2026/042',
      hrName: 'Marquis',
      hrTitle: 'Head of Human Resources & Talent Development',
      scores: [10, 9, 9, 9, 10, 10, 9]
    },
    eng: {
      name: 'Chidiebere Victor Okonkwo',
      matric: '2019/182049',
      level: '400 Level (Undergraduate)',
      inst: 'Federal University of Technology Owerri (FUTO)',
      faculty: 'School of Engineering & Engineering Tech',
      dept: 'Electrical & Electronics Engineering',
      duration: 'six (6) months (24 weeks)',
      months: 6,
      weeks: 24,
      start: '4th May, 2026',
      end: '30th October, 2026',
      unit: 'Field Systems & Telecommunications Unit',
      ref: 'EIB/HR/SIWES/2026/058',
      hrName: 'Marquis',
      hrTitle: 'Head of Human Resources & Talent Development',
      scores: [10, 10, 9, 9, 10, 10, 10]
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
      
      if (durationMonthsInput) durationMonthsInput.value = p.months;
      if (durationWeeksInput) durationWeeksInput.value = p.weeks;
      durationInput.value = p.duration;

      startDateInput.value = p.start;
      endDateInput.value = p.end;
      unitInput.value = p.unit;
      refNoInput.value = p.ref;

      if (p.hrName) hrNameInput.value = p.hrName;
      if (p.hrTitle) hrTitleInput.value = p.hrTitle;

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
