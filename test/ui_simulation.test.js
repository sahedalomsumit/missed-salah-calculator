const assert = require('assert');
const calc = require('../js/calculator.js');

console.log('--- Running Lifetime Missed Salah Simulation & Audit Tests ---');

// Scenario 1: Ahmed (Male, 30 years old, 15 years obligatory, 3 yrs regular, 3 yrs partial with 3 missed/day, 200 qaza done)
{
  const dob = new Date('1994-06-15T00:00:00Z');
  const today = new Date('2024-06-15T00:00:00Z'); // exactly 30 years old
  const mandatoryAge = 15; // Salah starts at 15 = 1994 + 15 = 2009-06-15 (15 years obligatory period = 5479 days)

  const res = calc.calculateMissedSalah({
    name: 'Ahmed',
    gender: 'male',
    dob,
    mandatoryAge,
    regularPeriod: { years: 3, months: 7, days: 15 },
    partialPeriod: { years: 3, months: 7, days: 15 },
    partialMissedPerDay: 3,
    qazaAlreadyPrayed: 200,
    currentDate: today
  });

  console.log('\n--- Scenario 1: Ahmed (Male) ---');
  console.log(`Greeting: Hey ${res.name},`);
  console.log(`Total Obligatory Salah: ${res.totalObligatorySalah}`);
  console.log(`Total Prayed: ${res.totalPrayedSalah}`);
  console.log(`Total Missed: ${res.totalMissedSalah}`);
  console.log(`Qaza Already Prayed: ${res.qazaAlreadyPrayed}`);
  console.log(`Remaining Qaza: ${res.remainingQaza}`);
  console.log(`Missed Percentage: ${res.missedPercentage}%`);
  console.log(`Equivalent Duration: ${res.equivalentDurationText}`);

  assert.strictEqual(res.regularMissed, 0);
  assert(res.totalMissedSalah > 0);
  assert.strictEqual(res.remainingQaza, res.totalMissedSalah - 200);
  assert.strictEqual(res.totalObligatorySalah, res.totalPrayedSalah + res.totalMissedSalah);
  assert.strictEqual(res.transparentSteps.length, 7);

  console.log('Audit Steps:');
  res.transparentSteps.forEach(s => {
    console.log(` [Step ${s.step}] ${s.title}: ${s.calculation}`);
  });
  console.log('✓ Scenario 1 verified successfully!');
}

// Scenario 2: Fatima (Female, 120 months obligatory, 5 days/month menstruation excluded)
{
  const dob = new Date('2002-01-01T00:00:00Z');
  const today = new Date('2024-01-01T00:00:00Z');
  const mandatoryAge = 12; // Salah starts 2014-01-01. Total 10 years = 120 months.

  const res = calc.calculateMissedSalah({
    name: 'Fatima',
    gender: 'female',
    dob,
    mandatoryAge,
    regularPeriod: { years: 2, months: 0, days: 0 },
    partialPeriod: { years: 2, months: 0, days: 0 },
    partialMissedPerDay: 2,
    qazaAlreadyPrayed: 150,
    avgMenstruationDays: 5,
    currentDate: today
  });

  console.log('\n--- Scenario 2: Fatima (Female with Menstruation) ---');
  console.log(`Total Obligatory Days: ${res.totalObligatoryDays}`);
  console.log(`Total Months: ~${res.totalMonths}`);
  console.log(`Estimated Menstruation Days Excluded: ${res.estimatedMenstruationDays}`);
  console.log(`Total Eligible Days: ${res.totalEligibleDays}`);
  console.log(`Total Obligatory Salah: ${res.totalObligatorySalah}`);
  console.log(`Remaining Qaza: ${res.remainingQaza}`);

  // 120 months * 5 days = 600 estimated menstruation days
  assert.strictEqual(res.totalMonths, 120);
  assert.strictEqual(res.estimatedMenstruationDays, 600);
  assert.strictEqual(res.totalEligibleDays, res.totalObligatoryDays - 600);
  assert.strictEqual(res.totalObligatorySalah, res.totalEligibleDays * 5);
  assert.strictEqual(res.transparentSteps.length, 7);
  console.log('✓ Scenario 2 verified successfully!');
}

// Scenario 3: Qaza already prayed exceeds missed (clamped to 0, never negative)
{
  const dob = new Date('2000-01-01T00:00:00Z');
  const today = new Date('2024-01-01T00:00:00Z');
  const res = calc.calculateMissedSalah({
    gender: 'male',
    dob,
    mandatoryAge: 15,
    regularPeriod: { years: 5, months: 0, days: 0 },
    partialPeriod: { years: 0, months: 0, days: 0 },
    qazaAlreadyPrayed: 999999,
    currentDate: today
  });

  assert.strictEqual(res.remainingQaza, 0);
  console.log('\n✓ Scenario 3 verified: Remaining Qaza never negative!');
}

// Scenario 4: Flexible DOB input formats (Object { year, month, day }, string, Date)
{
  const today = new Date('2024-01-01T00:00:00Z');
  
  // Test with object { year, month, day }
  const resObj = calc.calculateMissedSalah({
    dob: { year: 1995, month: 5, day: 15 },
    mandatoryAge: 14,
    currentDate: today
  });

  // Test with string '1995-05-15'
  const resStr = calc.calculateMissedSalah({
    dob: '1995-05-15',
    mandatoryAge: 14,
    currentDate: today
  });

  assert.strictEqual(resObj.totalObligatoryDays, resStr.totalObligatoryDays);
  assert.strictEqual(resObj.salahStartDate.getFullYear(), 2009);
  assert.strictEqual(resObj.salahStartDate.getMonth(), 4); // May (0-indexed)
  assert.strictEqual(resObj.salahStartDate.getDate(), 15);
  console.log('\n✓ Scenario 4 verified: Flexible DOB { year, month, day } works seamlessly!');
}

console.log('\n--- ALL VERIFICATION TESTS COMPLETED WITH 100% SUCCESS ---');
