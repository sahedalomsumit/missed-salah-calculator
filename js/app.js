/**
 * app.js - UI Controller & State Orchestrator
 * Lifetime Missed Salah & Qaza Calculator
 */

document.addEventListener('DOMContentLoaded', () => {
  const calc = window.SalahCalculator;

  // -------------------------------------------------------------------------
  // State
  // -------------------------------------------------------------------------
  const state = {
    name: '',
    gender: 'male',
    dob: '1998-05-15',
    mandatoryAge: 14,
    regularPeriod: { years: 0, months: 0, days: 0 },
    partialPeriod: { years: 0, months: 0, days: 0 },
    partialMissedPerDay: 3,
    qazaAlreadyPrayed: 0,
    avgMenstruationDays: 5,
    plannerPace: 5,
    includeWitr: false,
    currentStep: 1,
    calculationResult: null
  };

  // -------------------------------------------------------------------------
  // DOM Elements
  // -------------------------------------------------------------------------
  // Stepper
  const stepperNav = document.getElementById('stepperNav');
  const stepperStepName = document.getElementById('stepperStepName');
  const stepperCounter = document.getElementById('stepperCounter');
  const progressFill = document.getElementById('progressFill');
  const stepperDotsContainer = document.getElementById('stepperDotsContainer');

  // Wizard Card & Steps
  const wizardCard = document.getElementById('wizardCard');
  const stepViews = [
    document.getElementById('step1'),
    document.getElementById('step2'),
    document.getElementById('step3'),
    document.getElementById('step4'),
    document.getElementById('step5'),
    document.getElementById('step6'),
    document.getElementById('step7')
  ];

  const btnPrevStep = document.getElementById('btnPrevStep');
  const btnNextStep = document.getElementById('btnNextStep');

  // Step 1: Gender & Name
  const inputName = document.getElementById('inputName');
  const choiceMale = document.getElementById('choiceMale');
  const choiceFemale = document.getElementById('choiceFemale');

  // Step 2: Date of Birth (Day, Month, Year)
  const dobDay = document.getElementById('dobDay');
  const dobMonth = document.getElementById('dobMonth');
  const dobYear = document.getElementById('dobYear');
  const inputDOB = document.getElementById('inputDOB');
  const currentDateDisplay = document.getElementById('currentDateDisplay');
  const calculatedAgeNote = document.getElementById('calculatedAgeNote');

  // Step 3: Mandatory Age
  const guidanceTextMale = document.getElementById('guidanceTextMale');
  const guidanceTextFemale = document.getElementById('guidanceTextFemale');
  const sliderMandatoryAge = document.getElementById('sliderMandatoryAge');
  const displayMandatoryAge = document.getElementById('displayMandatoryAge');
  const salahStartDateNotice = document.getElementById('salahStartDateNotice');

  // Step 4: Regular Period
  const regYears = document.getElementById('regYears');
  const regMonths = document.getElementById('regMonths');
  const regDays = document.getElementById('regDays');

  // Step 5: Partial Period
  const partYears = document.getElementById('partYears');
  const partMonths = document.getElementById('partMonths');
  const partDays = document.getElementById('partDays');
  const chipGridMissed = document.getElementById('chipGridMissed');

  // Step 6: Qaza Prayed
  const inputQazaDone = document.getElementById('inputQazaDone');

  // Step 7: Menstruation
  const chipGridMenstruation = document.getElementById('chipGridMenstruation');

  // Results Dashboard Elements
  const resultsDashboard = document.getElementById('resultsDashboard');
  const resGreeting = document.getElementById('resGreeting');
  const resTotalMissedText = document.getElementById('resTotalMissedText');
  const resPercentageVal = document.getElementById('resPercentageVal');
  const resEquivalentDurationText = document.getElementById('resEquivalentDurationText');

  const cardTotalMissed = document.getElementById('cardTotalMissed');
  const cardQazaPrayed = document.getElementById('cardQazaPrayed');
  const cardRemainingQaza = document.getElementById('cardRemainingQaza');

  const barPrayed = document.getElementById('barPrayed');
  const barPartialMissed = document.getElementById('barPartialMissed');
  const barNoPrayer = document.getElementById('barNoPrayer');
  const ratioBarStats = document.getElementById('ratioBarStats');

  const tblTotalObligatory = document.getElementById('tblTotalObligatory');
  const tblTotalPrayed = document.getElementById('tblTotalPrayed');
  const tblTotalMissed = document.getElementById('tblTotalMissed');
  const tblQazaPrayed = document.getElementById('tblQazaPrayed');
  const tblRemainingQaza = document.getElementById('tblRemainingQaza');

  const tblPartialMissed = document.getElementById('tblPartialMissed');
  const tblNoPrayerMissed = document.getElementById('tblNoPrayerMissed');
  const tblBreakdownTotalMissed = document.getElementById('tblBreakdownTotalMissed');
  const femaleMenstruationCallout = document.getElementById('femaleMenstruationCallout');
  const valMenstruationDays = document.getElementById('valMenstruationDays');

  const btnToggleAudit = document.getElementById('btnToggleAudit');
  const auditContent = document.getElementById('auditContent');
  const auditStepsContainer = document.getElementById('auditStepsContainer');

  // Planner
  const plannerPaceDisplay = document.getElementById('plannerPaceDisplay');
  const plannerCompletionDate = document.getElementById('plannerCompletionDate');
  const chkIncludeWitr = document.getElementById('chkIncludeWitr');
  const countFajr = document.getElementById('countFajr');
  const countDhuhr = document.getElementById('countDhuhr');
  const countAsr = document.getElementById('countAsr');
  const countMaghrib = document.getElementById('countMaghrib');
  const countIsha = document.getElementById('countIsha');
  const cardWitr = document.getElementById('cardWitr');
  const countWitr = document.getElementById('countWitr');

  // Action Buttons
  const btnRestartWizard = document.getElementById('btnRestartWizard');
  const btnCopySummary = document.getElementById('btnCopySummary');
  const btnPrintReport = document.getElementById('btnPrintReport');
  const toastNotice = document.getElementById('toastNotice');

  // Adjust Drawer Elements
  const btnOpenAdjustDrawer = document.getElementById('btnOpenAdjustDrawer');
  const adjustDrawerBackdrop = document.getElementById('adjustDrawerBackdrop');
  const btnCloseAdjustDrawer = document.getElementById('btnCloseAdjustDrawer');
  const btnApplyAdjust = document.getElementById('btnApplyAdjust');

  const adjDobDay = document.getElementById('adjDobDay');
  const adjDobMonth = document.getElementById('adjDobMonth');
  const adjDobYear = document.getElementById('adjDobYear');

  const adjMandatoryAge = document.getElementById('adjMandatoryAge');
  const adjDisplayMandatoryAge = document.getElementById('adjDisplayMandatoryAge');
  const adjRegYears = document.getElementById('adjRegYears');
  const adjRegMonths = document.getElementById('adjRegMonths');
  const adjRegDays = document.getElementById('adjRegDays');
  const adjPartYears = document.getElementById('adjPartYears');
  const adjPartMonths = document.getElementById('adjPartMonths');
  const adjPartDays = document.getElementById('adjPartDays');
  const adjChipGridMissed = document.getElementById('adjChipGridMissed');
  const adjQazaPrayed = document.getElementById('adjQazaPrayed');
  const adjGroupMenstruation = document.getElementById('adjGroupMenstruation');
  const adjChipGridMenstruation = document.getElementById('adjChipGridMenstruation');

  // -------------------------------------------------------------------------
  // Step Definitions & Names
  // -------------------------------------------------------------------------
  const stepTitles = {
    male: [
      'Your Gender',
      'Date of Birth',
      'Age Salah Became Mandatory',
      'Regular Prayer Period',
      'Partial Prayer Period',
      'Qaza Already Prayed'
    ],
    female: [
      'Your Gender',
      'Date of Birth',
      'Age Salah Became Mandatory',
      'Regular Prayer Period',
      'Partial Prayer Period',
      'Qaza Already Prayed',
      'Average Menstruation Days'
    ]
  };

  function getTotalSteps() {
    return state.gender === 'female' ? 7 : 6;
  }

  // -------------------------------------------------------------------------
  // Helper: Animated Number Counter
  // -------------------------------------------------------------------------
  function animateNumber(element, start, end, duration = 800) {
    if (!element) return;
    const startTime = performance.now();
    const diff = end - start;

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(start + diff * easeProgress);
      element.textContent = calc.formatNumber(currentVal);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = calc.formatNumber(end);
      }
    }

    requestAnimationFrame(step);
  }

  // -------------------------------------------------------------------------
  // Step Stepper & Navigation
  // -------------------------------------------------------------------------
  function renderStepperDots() {
    const total = getTotalSteps();
    stepperDotsContainer.innerHTML = '';

    for (let i = 1; i <= total; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `step-dot ${i === state.currentStep ? 'active' : ''} ${i < state.currentStep ? 'completed' : ''}`;
      dot.textContent = i;
      dot.title = `Step ${i}: ${stepTitles[state.gender][i - 1]}`;
      dot.addEventListener('click', () => {
        goToStep(i);
      });
      stepperDotsContainer.appendChild(dot);
    }
  }

  function updateStepperUI() {
    const total = getTotalSteps();
    const current = state.currentStep;
    const title = stepTitles[state.gender][current - 1] || '';

    stepperStepName.textContent = `Step ${current} of ${total}: ${title}`;
    stepperCounter.textContent = `${current} / ${total}`;
    progressFill.style.width = `${((current) / total) * 100}%`;

    renderStepperDots();

    // Toggle Back button visibility
    btnPrevStep.style.visibility = current === 1 ? 'hidden' : 'visible';

    // Update Next button text
    if (current === total) {
      btnNextStep.innerHTML = `Calculate Missed Salah
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>`;
      btnNextStep.className = 'btn-wizard btn-calculate';
    } else {
      btnNextStep.innerHTML = `Next Step
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>`;
      btnNextStep.className = 'btn-wizard btn-next';
    }
  }

  function goToStep(stepIndex) {
    const total = getTotalSteps();
    if (stepIndex < 1 || stepIndex > total) return;

    state.currentStep = stepIndex;

    // Show only active step view
    stepViews.forEach((view, index) => {
      if (view) {
        if (index + 1 === stepIndex) {
          view.classList.add('active');
        } else {
          view.classList.remove('active');
        }
      }
    });

    updateStepperUI();
    wizardCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // -------------------------------------------------------------------------
  // Form Updates & Date Sync
  // -------------------------------------------------------------------------
  function getParsedDOB(dayElem = dobDay, monthElem = dobMonth, yearElem = dobYear) {
    if (!dayElem || !monthElem || !yearElem) return null;
    const day = parseInt(dayElem.value, 10);
    const month = parseInt(monthElem.value, 10);
    let year = parseInt(yearElem.value, 10);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return null;
    }

    // Auto-expand 2-digit years if user entered e.g. 95
    if (year < 100) {
      year = year > 25 ? 1900 + year : 2000 + year;
    }

    const currentYear = new Date().getFullYear();
    if (year < 1920 || year > currentYear) {
      return null;
    }

    const maxDays = calc.getDaysInMonth(year, month - 1);
    const clampedDay = Math.min(Math.max(1, day), maxDays);

    const date = new Date(year, month - 1, clampedDay);
    date.setHours(0, 0, 0, 0);
    return { date, year, month, day: clampedDay };
  }

  function updateDatePreviews() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    currentDateDisplay.textContent = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    const parsed = getParsedDOB(dobDay, dobMonth, dobYear);
    if (!parsed) {
      const yrVal = dobYear ? dobYear.value.trim() : '';
      if (yrVal && yrVal.length > 0 && yrVal.length < 4) {
        calculatedAgeNote.textContent = `Entering year: ${yrVal}... (e.g. 1995)`;
        calculatedAgeNote.style.color = 'var(--text-muted)';
      } else if (yrVal && parseInt(yrVal, 10) > today.getFullYear()) {
        calculatedAgeNote.textContent = `⚠️ Birth year cannot be in the future.`;
        calculatedAgeNote.style.color = '#f87171';
      } else {
        calculatedAgeNote.textContent = 'Please enter a valid 4-digit birth year (e.g. 1995).';
        calculatedAgeNote.style.color = 'var(--accent-gold-light)';
      }
      return;
    }

    const birthDate = parsed.date;
    // Sync hidden inputDOB
    const yStr = String(parsed.year).padStart(4, '0');
    const mStr = String(parsed.month).padStart(2, '0');
    const dStr = String(parsed.day).padStart(2, '0');
    if (inputDOB) {
      inputDOB.value = `${yStr}-${mStr}-${dStr}`;
    }
    state.dob = `${yStr}-${mStr}-${dStr}`;

    const diffYMD = calc.diffYearsMonthsDays(birthDate, today);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    calculatedAgeNote.textContent = `Age today: ~${diffYMD.years} years old (Born: ${monthNames[parsed.month - 1]} ${parsed.day}, ${parsed.year})`;
    calculatedAgeNote.style.color = 'var(--text-muted)';

    // Salah start date preview
    const age = parseFloat(sliderMandatoryAge.value) || 14;
    const startDate = calc.calculateSalahStartDate(birthDate, age);
    const isPast = startDate <= today;

    if (isPast) {
      salahStartDateNotice.innerHTML = `Salah became obligatory around: <strong>${startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>. Prayers before this date are not counted.`;
      salahStartDateNotice.style.color = 'var(--text-gold)';
    } else {
      salahStartDateNotice.innerHTML = `<span style="color:#f87171;">⚠️ Salah start date would be in the future (${startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}). Please check your birth year or mandatory age.</span>`;
    }
  }

  function setGender(gender) {
    state.gender = gender;

    if (gender === 'male') {
      choiceMale.classList.add('selected');
      choiceFemale.classList.remove('selected');
      choiceMale.setAttribute('aria-pressed', 'true');
      choiceFemale.setAttribute('aria-pressed', 'false');

      guidanceTextMale.style.display = 'inline';
      guidanceTextFemale.style.display = 'none';
      adjGroupMenstruation.style.display = 'none';
    } else {
      choiceFemale.classList.add('selected', 'female');
      choiceMale.classList.remove('selected');
      choiceFemale.setAttribute('aria-pressed', 'true');
      choiceMale.setAttribute('aria-pressed', 'false');

      guidanceTextMale.style.display = 'none';
      guidanceTextFemale.style.display = 'inline';
      adjGroupMenstruation.style.display = 'block';

      // Default female puberty age typically 12-13
      if (sliderMandatoryAge.value == 14) {
        sliderMandatoryAge.value = 12;
        state.mandatoryAge = 12;
        displayMandatoryAge.textContent = '12 years';
      }
    }

    updateDatePreviews();
    updateStepperUI();
  }

  // Global Presets for window bindings
  window.setPresetDOB = function (ageYears) {
    const targetDate = new Date();
    const birthYear = targetDate.getFullYear() - ageYears;
    if (dobYear) dobYear.value = birthYear;
    if (dobMonth) dobMonth.value = targetDate.getMonth() + 1;
    if (dobDay) dobDay.value = targetDate.getDate();
    updateDatePreviews();
  };

  window.setMandatoryAge = function (age) {
    sliderMandatoryAge.value = age;
    state.mandatoryAge = age;
    displayMandatoryAge.textContent = `${age} years`;
    updateDatePreviews();
  };

  window.setRegularPreset = function (y, m, d) {
    regYears.value = y;
    regMonths.value = m;
    regDays.value = d;
  };

  window.setRegularPresetAll = function () {
    try {
      const dob = new Date(inputDOB.value + 'T00:00:00');
      const start = calc.calculateSalahStartDate(dob, parseFloat(sliderMandatoryAge.value) || 14);
      const diff = calc.diffYearsMonthsDays(start, new Date());
      regYears.value = diff.years;
      regMonths.value = diff.months;
      regDays.value = diff.days;
    } catch (e) {
      regYears.value = 5;
    }
  };

  window.addQaza = function (amount) {
    const curr = parseInt(inputQazaDone.value, 10) || 0;
    inputQazaDone.value = curr + amount;
  };

  window.setQaza = function (amount) {
    inputQazaDone.value = amount;
  };

  window.setPlannerPace = function (pace) {
    state.plannerPace = pace;
    document.querySelectorAll('.pace-card').forEach(card => {
      card.classList.toggle('active', parseInt(card.dataset.pace, 10) === pace);
    });
    updatePlannerUI();
  };

  // -------------------------------------------------------------------------
  // Event Listeners: Step 1 to Step 7
  // -------------------------------------------------------------------------
  choiceMale.addEventListener('click', () => setGender('male'));
  choiceFemale.addEventListener('click', () => setGender('female'));

  inputName.addEventListener('input', (e) => {
    state.name = e.target.value.trim();
  });

  // Date of Birth event listeners
  if (dobDay) {
    dobDay.addEventListener('input', updateDatePreviews);
    dobDay.addEventListener('change', updateDatePreviews);
  }
  if (dobMonth) {
    dobMonth.addEventListener('change', updateDatePreviews);
  }
  if (dobYear) {
    dobYear.addEventListener('input', () => {
      updateDatePreviews();
    });
    dobYear.addEventListener('change', () => {
      // Auto-expand 2-digit years if user entered e.g. 95
      let y = parseInt(dobYear.value, 10);
      if (!isNaN(y) && y < 100) {
        y = y > 25 ? 1900 + y : 2000 + y;
        dobYear.value = y;
      }
      updateDatePreviews();
    });
    dobYear.addEventListener('blur', () => {
      let y = parseInt(dobYear.value, 10);
      if (!isNaN(y) && y < 100) {
        y = y > 25 ? 1900 + y : 2000 + y;
        dobYear.value = y;
      }
      updateDatePreviews();
    });
  }

  if (inputDOB) {
    inputDOB.addEventListener('change', () => {
      state.dob = inputDOB.value;
      updateDatePreviews();
    });
  }

  sliderMandatoryAge.addEventListener('input', (e) => {
    state.mandatoryAge = parseFloat(e.target.value);
    displayMandatoryAge.textContent = `${state.mandatoryAge} years`;
    updateDatePreviews();
  });

  // Chip Grid for Missed Salah per day (Step 5)
  chipGridMissed.querySelectorAll('.chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      chipGridMissed.querySelectorAll('.chip-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.partialMissedPerDay = parseInt(btn.dataset.missed, 10);
    });
  });

  // Chip Grid for Menstruation days (Step 7)
  chipGridMenstruation.querySelectorAll('.chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      chipGridMenstruation.querySelectorAll('.chip-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.avgMenstruationDays = parseInt(btn.dataset.days, 10);
    });
  });

  // Navigation Prev / Next
  btnPrevStep.addEventListener('click', () => {
    goToStep(state.currentStep - 1);
  });

  btnNextStep.addEventListener('click', () => {
    // Validate Step 2 (Date of Birth)
    if (state.currentStep === 2) {
      const parsed = getParsedDOB(dobDay, dobMonth, dobYear);
      if (!parsed) {
        calculatedAgeNote.textContent = '⚠️ Please enter a valid 4-digit birth year (e.g. 1995) to continue.';
        calculatedAgeNote.style.color = '#f87171';
        if (dobYear) dobYear.focus();
        return;
      }
    }

    const total = getTotalSteps();
    if (state.currentStep < total) {
      goToStep(state.currentStep + 1);
    } else {
      // Last Step -> Run Calculation & Show Dashboard!
      runCalculationAndDisplay();
    }
  });

  // -------------------------------------------------------------------------
  // Calculation Runner & Results Dashboard Presentation
  // -------------------------------------------------------------------------
  function collectFormInputs() {
    const parsedDOB = getParsedDOB(dobDay, dobMonth, dobYear);
    const birthDate = parsedDOB ? parsedDOB.date : new Date(inputDOB.value + 'T00:00:00');
    return {
      name: inputName.value.trim(),
      gender: state.gender,
      dob: birthDate,
      mandatoryAge: parseFloat(sliderMandatoryAge.value) || 14,
      regularPeriod: {
        years: parseFloat(regYears.value) || 0,
        months: parseFloat(regMonths.value) || 0,
        days: parseFloat(regDays.value) || 0
      },
      partialPeriod: {
        years: parseFloat(partYears.value) || 0,
        months: parseFloat(partMonths.value) || 0,
        days: parseFloat(partDays.value) || 0
      },
      partialMissedPerDay: state.partialMissedPerDay,
      qazaAlreadyPrayed: parseInt(inputQazaDone.value, 10) || 0,
      avgMenstruationDays: state.avgMenstruationDays
    };
  }

  function runCalculationAndDisplay() {
    try {
      const inputs = collectFormInputs();
      const res = calc.calculateMissedSalah(inputs);
      state.calculationResult = res;

      // Switch views: hide wizard, show results dashboard
      stepperNav.style.display = 'none';
      wizardCard.style.display = 'none';
      resultsDashboard.classList.add('active');

      renderDashboardResults(res);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      alert(`Calculation Error: ${err.message}`);
    }
  }

  function renderDashboardResults(res) {
    const userName = res.name || 'there';
    resGreeting.textContent = `Hey ${userName},`;

    // Highlight metrics
    animateNumber(resTotalMissedText, 0, res.totalMissedSalah, 700);
    animateNumber(cardTotalMissed, 0, res.totalMissedSalah, 700);
    animateNumber(cardQazaPrayed, 0, res.qazaAlreadyPrayed, 700);
    animateNumber(cardRemainingQaza, 0, res.remainingQaza, 900);

    // Percentage
    resPercentageVal.textContent = `${res.missedPercentage}%`;

    // Equivalent Duration natural text
    resEquivalentDurationText.innerHTML = `Your missed Salah is equivalent to approximately <strong>${res.equivalentDurationText}</strong> of all five daily prayers.`;

    // Segmented Ratio Bar
    const totalObl = res.totalObligatorySalah;
    if (totalObl > 0) {
      const prayedPct = ((res.totalPrayedSalah / totalObl) * 100).toFixed(1);
      const partialMissedPct = ((res.partialMissed / totalObl) * 100).toFixed(1);
      const noPrayerMissedPct = ((res.noPrayerMissed / totalObl) * 100).toFixed(1);

      barPrayed.style.width = `${prayedPct}%`;
      barPartialMissed.style.width = `${partialMissedPct}%`;
      barNoPrayer.style.width = `${noPrayerMissedPct}%`;
      ratioBarStats.textContent = `Total Obligatory: ${calc.formatNumber(totalObl)} Salah`;
    }

    // Lifetime Salah Summary Table
    tblTotalObligatory.textContent = calc.formatNumber(res.totalObligatorySalah);
    tblTotalPrayed.textContent = calc.formatNumber(res.totalPrayedSalah);
    tblTotalMissed.textContent = calc.formatNumber(res.totalMissedSalah);
    tblQazaPrayed.textContent = calc.formatNumber(res.qazaAlreadyPrayed);
    tblRemainingQaza.textContent = calc.formatNumber(res.remainingQaza);

    // Missed Salah Breakdown Table
    tblPartialMissed.textContent = calc.formatNumber(res.partialMissed);
    tblNoPrayerMissed.textContent = calc.formatNumber(res.noPrayerMissed);
    tblBreakdownTotalMissed.textContent = calc.formatNumber(res.totalMissedSalah);

    // Menstruation note for females
    if (res.isFemale && res.estimatedMenstruationDays > 0) {
      femaleMenstruationCallout.style.display = 'flex';
      valMenstruationDays.textContent = `${calc.formatNumber(res.estimatedMenstruationDays)} days (~${res.totalMonths} mos × ${res.avgMenstruationDays} days)`;
    } else {
      femaleMenstruationCallout.style.display = 'none';
    }

    // Render Transparent Audit Steps
    renderAuditSteps(res.transparentSteps);

    // Update Planner
    updatePlannerUI();
  }

  // -------------------------------------------------------------------------
  // Render Transparent Audit Trail (How was this calculated?)
  // -------------------------------------------------------------------------
  function renderAuditSteps(steps) {
    auditStepsContainer.innerHTML = '';

    steps.forEach(st => {
      const card = document.createElement('div');
      card.className = `audit-step-card ${st.isFinal ? 'final' : ''}`;

      card.innerHTML = `
        <div class="audit-step-header">
          <span class="audit-step-num">${st.step}</span>
          <span class="audit-step-title">${st.title}</span>
        </div>
        <div class="audit-formula">${st.formula}</div>
        <div class="audit-calc-text">${st.calculation}</div>
        ${st.additionalDetail ? `<div style="font-size:0.82rem; color:var(--text-muted); margin-top:4px;">${st.additionalDetail}</div>` : ''}
        ${st.resultDetail ? `<div class="audit-result-text">↳ ${st.resultDetail}</div>` : ''}
      `;
      auditStepsContainer.appendChild(card);
    });
  }

  // Toggle Audit Accordion
  btnToggleAudit.addEventListener('click', () => {
    const isOpen = auditContent.classList.contains('open');
    if (isOpen) {
      auditContent.classList.remove('open');
      btnToggleAudit.setAttribute('aria-expanded', 'false');
    } else {
      auditContent.classList.add('open');
      btnToggleAudit.setAttribute('aria-expanded', 'true');
    }
  });

  // -------------------------------------------------------------------------
  // Qaza Make-Up Roadmap & Prayer Counts
  // -------------------------------------------------------------------------
  function updatePlannerUI() {
    if (!state.calculationResult) return;
    const rem = state.calculationResult.remainingQaza;
    const pace = state.plannerPace || 5;

    plannerPaceDisplay.textContent = `${pace} Qaza prayers per day`;

    if (rem === 0) {
      plannerCompletionDate.textContent = 'Alhamdulillah, no remaining Qaza!';
    } else {
      const daysNeeded = Math.ceil(rem / pace);
      const completionDate = new Date();
      completionDate.setDate(completionDate.getDate() + daysNeeded);

      const ymd = calc.convertDaysToYMD(daysNeeded, completionDate);
      const durationStr = calc.formatYMD(ymd);

      const formattedTargetDate = completionDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      plannerCompletionDate.innerHTML = `~${durationStr}<br><span style="font-size:0.85rem; color:#a7f3d0; font-weight:normal;">Target completion: <strong>${formattedTargetDate}</strong> insha'Allah</span>`;
    }

    // Individual prayers
    // Standard division by 5 (or 6 if Witr included)
    const count5 = Math.round(rem / 5);
    countFajr.textContent = calc.formatNumber(count5);
    countDhuhr.textContent = calc.formatNumber(count5);
    countAsr.textContent = calc.formatNumber(count5);
    countMaghrib.textContent = calc.formatNumber(count5);
    countIsha.textContent = calc.formatNumber(count5);

    if (chkIncludeWitr.checked) {
      cardWitr.style.display = 'block';
      countWitr.textContent = calc.formatNumber(count5);
    } else {
      cardWitr.style.display = 'none';
    }
  }

  chkIncludeWitr.addEventListener('change', () => {
    updatePlannerUI();
  });

  // -------------------------------------------------------------------------
  // Adjust My Calculation Drawer (Instant Recalculation)
  // -------------------------------------------------------------------------
  function populateDrawerInputs() {
    if (!state.calculationResult) return;
    const inp = state.calculationResult.inputs;

    if (adjDobDay && dobDay) adjDobDay.value = dobDay.value;
    if (adjDobMonth && dobMonth) adjDobMonth.value = dobMonth.value;
    if (adjDobYear && dobYear) adjDobYear.value = dobYear.value;

    adjMandatoryAge.value = inp.mandatoryAge;
    adjDisplayMandatoryAge.textContent = inp.mandatoryAge;

    adjRegYears.value = inp.regularPeriod.years;
    adjRegMonths.value = inp.regularPeriod.months;
    adjRegDays.value = inp.regularPeriod.days;

    adjPartYears.value = inp.partialPeriod.years;
    adjPartMonths.value = inp.partialPeriod.months;
    adjPartDays.value = inp.partialPeriod.days;

    adjQazaPrayed.value = inp.qazaAlreadyPrayed;

    // Missed chips
    adjChipGridMissed.querySelectorAll('.chip-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.adjMissed, 10) === inp.partialMissedPerDay);
    });

    // Menstruation
    if (state.gender === 'female') {
      adjGroupMenstruation.style.display = 'block';
      adjChipGridMenstruation.querySelectorAll('.chip-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.adjDays, 10) === inp.avgMenstruationDays);
      });
    } else {
      adjGroupMenstruation.style.display = 'none';
    }
  }

  function handleInstantAdjust() {
    const parsedAdjDOB = getParsedDOB(adjDobDay, adjDobMonth, adjDobYear) || getParsedDOB(dobDay, dobMonth, dobYear);
    if (!parsedAdjDOB) return;

    // Sync back to main wizard inputs
    if (dobDay) dobDay.value = parsedAdjDOB.day;
    if (dobMonth) dobMonth.value = parsedAdjDOB.month;
    if (dobYear) dobYear.value = parsedAdjDOB.year;
    updateDatePreviews();

    // Collect updated values from drawer
    const updatedInputs = {
      name: inputName.value.trim(),
      gender: state.gender,
      dob: parsedAdjDOB.date,
      mandatoryAge: parseFloat(adjMandatoryAge.value) || 14,
      regularPeriod: {
        years: parseFloat(adjRegYears.value) || 0,
        months: parseFloat(adjRegMonths.value) || 0,
        days: parseFloat(adjRegDays.value) || 0
      },
      partialPeriod: {
        years: parseFloat(adjPartYears.value) || 0,
        months: parseFloat(adjPartMonths.value) || 0,
        days: parseFloat(adjPartDays.value) || 0
      },
      partialMissedPerDay: state.partialMissedPerDay,
      qazaAlreadyPrayed: parseInt(adjQazaPrayed.value, 10) || 0,
      avgMenstruationDays: state.avgMenstruationDays
    };

    try {
      const res = calc.calculateMissedSalah(updatedInputs);
      state.calculationResult = res;

      // Sync primary wizard form fields as well
      sliderMandatoryAge.value = updatedInputs.mandatoryAge;
      displayMandatoryAge.textContent = `${updatedInputs.mandatoryAge} years`;
      regYears.value = updatedInputs.regularPeriod.years;
      regMonths.value = updatedInputs.regularPeriod.months;
      regDays.value = updatedInputs.regularPeriod.days;
      partYears.value = updatedInputs.partialPeriod.years;
      partMonths.value = updatedInputs.partialPeriod.months;
      partDays.value = updatedInputs.partialPeriod.days;
      inputQazaDone.value = updatedInputs.qazaAlreadyPrayed;

      renderDashboardResults(res);
    } catch (e) {
      console.warn('Instant recalculate prevented:', e.message);
    }
  }

  btnOpenAdjustDrawer.addEventListener('click', () => {
    populateDrawerInputs();
    adjustDrawerBackdrop.classList.add('open');
  });

  function closeDrawer() {
    adjustDrawerBackdrop.classList.remove('open');
  }

  btnCloseAdjustDrawer.addEventListener('click', closeDrawer);
  btnApplyAdjust.addEventListener('click', closeDrawer);
  adjustDrawerBackdrop.addEventListener('click', (e) => {
    if (e.target === adjustDrawerBackdrop) closeDrawer();
  });

  // Drawer Instant Listeners
  [adjDobDay, adjDobMonth, adjDobYear].forEach(inp => {
    if (inp) {
      inp.addEventListener('input', handleInstantAdjust);
      inp.addEventListener('change', handleInstantAdjust);
    }
  });

  adjMandatoryAge.addEventListener('input', (e) => {
    adjDisplayMandatoryAge.textContent = e.target.value;
    handleInstantAdjust();
  });

  [adjRegYears, adjRegMonths, adjRegDays, adjPartYears, adjPartMonths, adjPartDays, adjQazaPrayed].forEach(inp => {
    inp.addEventListener('input', handleInstantAdjust);
  });

  adjChipGridMissed.querySelectorAll('.chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      adjChipGridMissed.querySelectorAll('.chip-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.partialMissedPerDay = parseInt(btn.dataset.adjMissed, 10);
      handleInstantAdjust();
    });
  });

  adjChipGridMenstruation.querySelectorAll('.chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      adjChipGridMenstruation.querySelectorAll('.chip-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.avgMenstruationDays = parseInt(btn.dataset.adjDays, 10);
      handleInstantAdjust();
    });
  });

  // -------------------------------------------------------------------------
  // Restart / Reset Wizard
  // -------------------------------------------------------------------------
  btnRestartWizard.addEventListener('click', () => {
    resultsDashboard.classList.remove('active');
    stepperNav.style.display = 'block';
    wizardCard.style.display = 'block';
    goToStep(1);
  });

  // -------------------------------------------------------------------------
  // Copy Summary to Clipboard
  // -------------------------------------------------------------------------
  btnCopySummary.addEventListener('click', async () => {
    if (!state.calculationResult) return;
    const res = state.calculationResult;
    const namePart = res.name ? `Name: ${res.name}\n` : '';

    const summaryText = `Lifetime Missed Salah & Qaza Summary
=====================================
${namePart}Gender: ${res.isFemale ? 'Female' : 'Male'}
Obligatory Period: ${res.salahStartDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} to ${res.today.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
Total Obligatory Days: ${calc.formatNumber(res.totalObligatoryDays)}
${res.isFemale ? `Estimated Menstruation Excluded: ${calc.formatNumber(res.estimatedMenstruationDays)} days\n` : ''}Total Eligible Days: ${calc.formatNumber(res.totalEligibleDays)}

LIFETIME SALAH COUNTS:
----------------------
Total Obligatory Salah: ${calc.formatNumber(res.totalObligatorySalah)}
Total Prayed: ${calc.formatNumber(res.totalPrayedSalah)}
Total Missed: ${calc.formatNumber(res.totalMissedSalah)} (${res.missedPercentage}%)
Qaza Already Prayed: ${calc.formatNumber(res.qazaAlreadyPrayed)}
>>> REMAINING QAZA: ${calc.formatNumber(res.remainingQaza)} <<<

Equivalent Fully-Missed Duration: ${res.equivalentDurationText}
Estimated Target at 5 Qaza/day: ${plannerCompletionDate.innerText.replace('\n', ' ')}
=====================================
Generated with Lifetime Missed Salah Calculator`;

    try {
      await navigator.clipboard.writeText(summaryText);
      showToast('Summary copied to clipboard!');
    } catch (e) {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = summaryText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('Summary copied to clipboard!');
    }
  });

  function showToast(msg) {
    toastNotice.textContent = msg;
    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 2800);
  }

  // Print Report
  btnPrintReport.addEventListener('click', () => {
    window.print();
  });

  // -------------------------------------------------------------------------
  // Initialization
  // -------------------------------------------------------------------------
  updateDatePreviews();
  updateStepperUI();
});

