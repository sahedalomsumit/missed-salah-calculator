/**
 * calculator.js - Lifetime Missed Salah & Qaza Calculation Engine
 * 
 * Strict implementation of prayer behavior periods:
 * 1. Regular: 5/5 prayed (0 missed)
 * 2. Partial: user chooses 1..4 missed prayers/day
 * 3. No prayer: 5/5 missed per day (automatic remainder)
 * 
 * Accurately handles:
 * - Exact calendar dates, leap years, varying month lengths
 * - Menstruation deduction for female users (clearly marked as estimate)
 * - Strict separation of Total Missed Salah vs Qaza Already Prayed vs Remaining Qaza
 * - Equivalent duration calculation (Years, Months, Days)
 * - Complete transparent calculation audit trail
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SalahCalculator = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  /**
   * Helper: Normalize date to midnight UTC to prevent daylight saving / timezone drift
   */
  function toMidnight(date) {
    if (!date) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return now;
    }
    // Handle { year, month, day } objects
    if (typeof date === 'object' && !(date instanceof Date)) {
      if (date.year) {
        const y = parseInt(date.year, 10);
        const m = (parseInt(date.month, 10) || 1) - 1;
        const d = parseInt(date.day, 10) || 1;
        const res = new Date(y, m, d);
        res.setHours(0, 0, 0, 0);
        return res;
      }
    }
    // Handle string "YYYY-MM-DD" safely to avoid timezone offset day shifts
    if (typeof date === 'string') {
      const parts = date.split('T')[0].split('-');
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
          const res = new Date(y, m, d);
          res.setHours(0, 0, 0, 0);
          return res;
        }
      }
    }
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      const fallback = new Date();
      fallback.setHours(0, 0, 0, 0);
      return fallback;
    }
    d.setHours(0, 0, 0, 0);
    return d;
  }

  /**
   * Helper: Check if a year is a leap year
   */
  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  /**
   * Helper: Days in a specific month of a year
   */
  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  /**
   * Add calendar years, months, days to a date, respecting month boundaries
   */
  function addCalendarDuration(startDate, years = 0, months = 0, days = 0) {
    const d = new Date(startDate.getTime());
    const targetYear = d.getFullYear() + Math.floor(years);
    const fractionalYears = years - Math.floor(years);
    const additionalMonths = Math.floor(months) + Math.round(fractionalYears * 12);
    
    // Set year & month
    let targetMonth = d.getMonth() + additionalMonths;
    const finalYear = targetYear + Math.floor(targetMonth / 12);
    const finalMonth = ((targetMonth % 12) + 12) % 12;

    const originalDay = d.getDate();
    const maxDaysInTargetMonth = getDaysInMonth(finalYear, finalMonth);
    const clampedDay = Math.min(originalDay, maxDaysInTargetMonth);

    const result = new Date(finalYear, finalMonth, clampedDay);
    result.setHours(0, 0, 0, 0);

    // Add days
    if (days) {
      result.setDate(result.getDate() + Math.round(days));
    }
    return result;
  }

  /**
   * Exact difference in calendar days between two dates
   */
  function diffDays(startDate, endDate) {
    const s = toMidnight(startDate);
    const e = toMidnight(endDate);
    const diffMs = e.getTime() - s.getTime();
    return Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
  }

  /**
   * Difference between two dates in Years, Months, and Days
   */
  function diffYearsMonthsDays(startDate, endDate) {
    const s = toMidnight(startDate);
    const e = toMidnight(endDate);
    if (e < s) return { years: 0, months: 0, days: 0 };

    let years = e.getFullYear() - s.getFullYear();
    let months = e.getMonth() - s.getMonth();
    let days = e.getDate() - s.getDate();

    if (days < 0) {
      months -= 1;
      // Days in previous month of endDate
      const prevMonthDays = getDaysInMonth(e.getFullYear(), e.getMonth() - 1);
      days += prevMonthDays;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    return {
      years: Math.max(0, years),
      months: Math.max(0, months),
      days: Math.max(0, days)
    };
  }

  /**
   * Convert a total number of days into equivalent Years, Months, Days
   * using calendar projection backwards from reference date (today)
   */
  function convertDaysToYMD(totalDays, referenceDate = new Date()) {
    if (totalDays <= 0) return { years: 0, months: 0, days: 0 };
    const ref = toMidnight(referenceDate);
    const pastDate = new Date(ref.getTime());
    pastDate.setDate(pastDate.getDate() - Math.round(totalDays));
    return diffYearsMonthsDays(pastDate, ref);
  }

  /**
   * Format YMD object into a natural English string
   * e.g., "2 years, 6 months and 15 days"
   */
  function formatYMD(ymd) {
    const parts = [];
    if (ymd.years > 0) {
      parts.push(`${ymd.years} ${ymd.years === 1 ? 'year' : 'years'}`);
    }
    if (ymd.months > 0) {
      parts.push(`${ymd.months} ${ymd.months === 1 ? 'month' : 'months'}`);
    }
    if (ymd.days > 0 || parts.length === 0) {
      parts.push(`${ymd.days} ${ymd.days === 1 ? 'day' : 'days'}`);
    }

    if (parts.length === 1) return parts[0];
    if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
    return `${parts[0]}, ${parts[1]} and ${parts[2]}`;
  }

  /**
   * Format large number with comma separators
   */
  function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  }

  /**
   * Calculate Salah Start Date: DOB + mandatoryAge
   */
  function calculateSalahStartDate(dob, mandatoryAge) {
    const birthDate = toMidnight(dob);
    const age = parseFloat(mandatoryAge) || 15;
    const fullYears = Math.floor(age);
    const partialYearMonths = Math.round((age - fullYears) * 12);
    return addCalendarDuration(birthDate, fullYears, partialYearMonths, 0);
  }

  /**
   * Main Calculation Function
   * 
   * @param {Object} input
   * @param {string} input.gender - 'male' | 'female'
   * @param {string|Date} input.dob - Date of birth
   * @param {number} input.mandatoryAge - Age when Salah became mandatory (e.g. 14, 15)
   * @param {Object} input.regularPeriod - { years: number, months: number, days: number }
   * @param {Object} input.partialPeriod - { years: number, months: number, days: number }
   * @param {number} input.partialMissedPerDay - 1, 2, 3, or 4
   * @param {number} input.qazaAlreadyPrayed - number of Qaza made up
   * @param {number} input.avgMenstruationDays - female only: 2..7 (default 5)
   * @param {string|Date} [input.currentDate] - optional override for today
   * @param {string} [input.name] - user's name
   * @returns {Object} Comprehensive calculation result and transparent breakdown
   */
  function calculateMissedSalah(input) {
    const today = toMidnight(input.currentDate || new Date());
    const dob = toMidnight(input.dob);
    const gender = (input.gender || 'male').toLowerCase();
    const isFemale = gender === 'female';
    const mandatoryAge = Math.max(7, Math.min(25, parseFloat(input.mandatoryAge) || (isFemale ? 12 : 14)));

    // 1. Salah Start Date = DOB + mandatory age
    const salahStartDate = calculateSalahStartDate(dob, mandatoryAge);

    // Guard: DOB must be in the past
    if (dob >= today) {
      throw new Error('Date of birth must be before today.');
    }
    // Guard: Salah start date must be before or equal to today
    if (salahStartDate > today) {
      throw new Error(`Salah start date (${salahStartDate.toISOString().split('T')[0]}) cannot be in the future. Check your Date of Birth or Mandatory Age.`);
    }

    // 2. Total Obligatory Calendar Days
    const totalObligatoryDays = diffDays(salahStartDate, today);
    const obligatoryYMD = diffYearsMonthsDays(salahStartDate, today);

    // Number of months in the obligatory period for menstruation calculation:
    // Calendar-accurate calculation:
    const totalMonthsExact = (today.getFullYear() - salahStartDate.getFullYear()) * 12 + 
                             (today.getMonth() - salahStartDate.getMonth()) + 
                             ((today.getDate() - salahStartDate.getDate()) / 30.4375);
    const totalMonths = Math.max(1, Math.round(totalMonthsExact));

    // Menstruation days (Female only)
    const avgMenstruationDays = isFemale ? Math.max(1, Math.min(15, parseFloat(input.avgMenstruationDays) || 5)) : 0;
    const estimatedMenstruationDays = isFemale ? Math.min(totalObligatoryDays, Math.round(totalMonths * avgMenstruationDays)) : 0;
    
    // Total Eligible Days
    const totalEligibleDays = isFemale 
      ? Math.max(0, totalObligatoryDays - estimatedMenstruationDays)
      : totalObligatoryDays;

    // Eligible ratio for female exclusion across periods
    const eligibleRatio = totalObligatoryDays > 0 ? (totalEligibleDays / totalObligatoryDays) : 1;

    // 3. Regular Prayer Period
    const regY = Math.max(0, parseFloat(input.regularPeriod?.years) || 0);
    const regM = Math.max(0, parseFloat(input.regularPeriod?.months) || 0);
    const regD = Math.max(0, parseFloat(input.regularPeriod?.days) || 0);

    // Calculate calendar days for regular period starting from salahStartDate
    const regularEndDate = addCalendarDuration(salahStartDate, regY, regM, regD);
    let regularCalendarDays = diffDays(salahStartDate, regularEndDate);
    regularCalendarDays = Math.min(totalObligatoryDays, regularCalendarDays);

    // 4. Partial Prayer Period
    const partY = Math.max(0, parseFloat(input.partialPeriod?.years) || 0);
    const partM = Math.max(0, parseFloat(input.partialPeriod?.months) || 0);
    const partD = Math.max(0, parseFloat(input.partialPeriod?.days) || 0);

    // Calculate calendar days for partial period starting from regularEndDate
    const partialEndDate = addCalendarDuration(regularEndDate, partY, partM, partD);
    let partialCalendarDays = diffDays(regularEndDate, partialEndDate);

    // Validate that Regular + Partial does not exceed Total Obligatory Days
    let isClamped = false;
    if (regularCalendarDays + partialCalendarDays > totalObligatoryDays) {
      partialCalendarDays = Math.max(0, totalObligatoryDays - regularCalendarDays);
      isClamped = true;
    }

    // 5. No-Prayer Period (Automatic Remainder)
    const noPrayerCalendarDays = Math.max(0, totalObligatoryDays - regularCalendarDays - partialCalendarDays);

    // Distribute eligible days consistently across periods
    let regularEligibleDays = Math.round(regularCalendarDays * eligibleRatio);
    let partialEligibleDays = Math.round(partialCalendarDays * eligibleRatio);
    let noPrayerEligibleDays = totalEligibleDays - regularEligibleDays - partialEligibleDays;
    
    if (noPrayerEligibleDays < 0) {
      // Fix any rounding overshoot
      noPrayerEligibleDays = 0;
      partialEligibleDays = totalEligibleDays - regularEligibleDays;
    }

    // Missed prayers per day in partial period (1, 2, 3, or 4)
    const partialMissedPerDay = Math.min(4, Math.max(1, parseInt(input.partialMissedPerDay, 10) || 3));
    const partialPrayedPerDay = 5 - partialMissedPerDay;

    // Salah counts per period
    // A. Regular
    const regularMissed = 0;
    const regularPrayed = regularEligibleDays * 5;

    // B. Partial
    const partialMissed = partialEligibleDays * partialMissedPerDay;
    const partialPrayed = partialEligibleDays * partialPrayedPerDay;

    // C. No-Prayer
    const noPrayerMissed = noPrayerEligibleDays * 5;
    const noPrayerPrayed = 0;

    // Totals
    const totalObligatorySalah = totalEligibleDays * 5;
    const totalMissedSalah = partialMissed + noPrayerMissed;
    const totalPrayedSalah = totalObligatorySalah - totalMissedSalah;

    // Qaza Already Prayed & Remaining Qaza
    const qazaAlreadyPrayed = Math.max(0, parseInt(input.qazaAlreadyPrayed, 10) || 0);
    const remainingQaza = Math.max(0, totalMissedSalah - qazaAlreadyPrayed);

    // Percentage
    const missedPercentage = totalObligatorySalah > 0 
      ? Number(((totalMissedSalah / totalObligatorySalah) * 100).toFixed(1))
      : 0;

    // Equivalent fully-missed days (based on 5 prayers/day)
    const equivalentFullyMissedDays = Math.round(totalMissedSalah / 5);
    const equivalentYMD = convertDaysToYMD(equivalentFullyMissedDays, today);
    const equivalentDurationText = formatYMD(equivalentYMD);

    // Remaining Qaza equivalent duration
    const remainingEquivalentDays = Math.round(remainingQaza / 5);
    const remainingEquivalentYMD = convertDaysToYMD(remainingEquivalentDays, today);
    const remainingEquivalentDurationText = formatYMD(remainingEquivalentYMD);

    // Breakdown by individual Salah (Fajr, Dhuhr, Asr, Maghrib, Isha)
    // Distributed evenly across the 5 daily prayers
    const remainingPerPrayer = Math.round(remainingQaza / 5);
    const totalMissedPerPrayer = Math.round(totalMissedSalah / 5);

    // Transparent calculation steps
    const transparentSteps = [
      {
        step: 1,
        title: 'Salah became mandatory',
        formula: `[Date of Birth] + [Mandatory Age] = [Salah Start Date]`,
        calculation: `${dob.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} + ${mandatoryAge} years = ${salahStartDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`,
        note: 'Prayers prior to reaching this age are not counted as obligatory.'
      },
      {
        step: 2,
        title: 'Total obligatory period',
        formula: `[Salah Start Date] → [Today] = Calendar Days`,
        calculation: `${salahStartDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} → ${today.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} = ${formatNumber(totalObligatoryDays)} calendar days (${formatYMD(obligatoryYMD)})`,
        additionalDetail: isFemale ? `Estimated menstruation: ~${totalMonths} months × ${avgMenstruationDays} days = ${formatNumber(estimatedMenstruationDays)} days excluded.\nTotal Eligible Days = ${formatNumber(totalObligatoryDays)} − ${formatNumber(estimatedMenstruationDays)} = ${formatNumber(totalEligibleDays)} days.` : null
      },
      {
        step: 3,
        title: 'Regular prayer period',
        formula: `Period Duration = Eligible Days × 5 prayed`,
        calculation: `${formatYMD({ years: regY, months: regM, days: regD })} = ${formatNumber(regularEligibleDays)} eligible days`,
        resultDetail: `Missed = 0 Salah | Prayed = ${formatNumber(regularPrayed)} Salah`
      },
      {
        step: 4,
        title: 'Partial prayer period',
        formula: `Eligible Days × Selected Missed Prayers/Day = Missed Salah`,
        calculation: `${formatYMD({ years: partY, months: partM, days: partD })} = ${formatNumber(partialEligibleDays)} eligible days`,
        resultDetail: `${partialMissedPerDay} missed/day × ${formatNumber(partialEligibleDays)} days = ${formatNumber(partialMissed)} missed Salah (${formatNumber(partialPrayed)} prayed)`
      },
      {
        step: 5,
        title: 'No-prayer period (Automatically calculated)',
        formula: `Remaining Eligible Days × 5 = Missed Salah`,
        calculation: `Remaining eligible days = ${formatNumber(noPrayerEligibleDays)} days`,
        resultDetail: `${formatNumber(noPrayerEligibleDays)} days × 5 = ${formatNumber(noPrayerMissed)} missed Salah`
      },
      {
        step: 6,
        title: 'Qaza already completed',
        formula: `Recorded Qaza Salah Made Up`,
        calculation: `${formatNumber(qazaAlreadyPrayed)} Salah already prayed`
      },
      {
        step: 7,
        title: 'Remaining Qaza',
        formula: `Total Missed Salah − Qaza Already Prayed = Remaining Qaza`,
        calculation: `${formatNumber(totalMissedSalah)} − ${formatNumber(qazaAlreadyPrayed)} = ${formatNumber(remainingQaza)} Salah`,
        isFinal: true
      }
    ];

    return {
      name: input.name || '',
      gender,
      isFemale,
      dob,
      mandatoryAge,
      salahStartDate,
      today,
      
      // Days breakdown
      totalObligatoryDays,
      obligatoryYMD,
      totalMonths,
      avgMenstruationDays,
      estimatedMenstruationDays,
      totalEligibleDays,

      // Period days (calendar)
      regularCalendarDays,
      partialCalendarDays,
      noPrayerCalendarDays,
      isClamped,

      // Period days (eligible)
      regularEligibleDays,
      partialEligibleDays,
      noPrayerEligibleDays,
      partialMissedPerDay,

      // Salah breakdown by period
      regularMissed,
      regularPrayed,
      partialMissed,
      partialPrayed,
      noPrayerMissed,
      noPrayerPrayed,

      // Lifetime Salah Summary
      totalObligatorySalah,
      totalPrayedSalah,
      totalMissedSalah,
      qazaAlreadyPrayed,
      remainingQaza,

      // Percentage & equivalent duration
      missedPercentage,
      equivalentFullyMissedDays,
      equivalentYMD,
      equivalentDurationText,
      remainingEquivalentDays,
      remainingEquivalentYMD,
      remainingEquivalentDurationText,

      // Individual prayer distribution
      remainingPerPrayer,
      totalMissedPerPrayer,

      // Step-by-step audit
      transparentSteps,

      // Raw inputs for easy adjustment state sync
      inputs: {
        gender,
        dob: dob.toISOString().split('T')[0],
        mandatoryAge,
        regularPeriod: { years: regY, months: regM, days: regD },
        partialPeriod: { years: partY, months: partM, days: partD },
        partialMissedPerDay,
        qazaAlreadyPrayed,
        avgMenstruationDays
      }
    };
  }

  return {
    calculateMissedSalah,
    calculateSalahStartDate,
    addCalendarDuration,
    diffDays,
    diffYearsMonthsDays,
    convertDaysToYMD,
    formatYMD,
    formatNumber,
    isLeapYear,
    getDaysInMonth
  };
});
