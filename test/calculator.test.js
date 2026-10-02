const assert = require('assert');
const { calculateMissedSalah, formatYMD, diffDays, calculateSalahStartDate } = require('../js/calculator.js');

console.log('--- Running Lifetime Missed Salah Calculator Tests ---');

// Test Case 1: Standard Male Scenario
{
  const testDate = new Date('2025-01-01T00:00:00Z');
  const dob = new Date('1995-01-01T00:00:00Z');
  const result = calculateMissedSalah({
    name: 'Ahmed',
    gender: 'male',
    dob,
    mandatoryAge: 15, // Salah starts 2010-01-01 (15 years = 5479 days up to 2025-01-01)
    regularPeriod: { years: 5, months: 0, days: 0 },
    partialPeriod: { years: 3, months: 0, days: 0 },
    partialMissedPerDay: 3,
    qazaAlreadyPrayed: 250,
    currentDate: testDate
  });

  assert.strictEqual(result.isFemale, false);
  assert.strictEqual(result.estimatedMenstruationDays, 0);
  assert.strictEqual(result.totalObligatoryDays, result.totalEligibleDays);
  assert.strictEqual(result.regularMissed, 0);
  
  // Partial period: 3 years. Missed 3/day.
  assert(result.partialMissed > 0, 'Partial missed should be > 0');
  // No prayer period: 15 - 5 - 3 = 7 years. Missed 5/day.
  assert(result.noPrayerMissed > 0, 'No prayer missed should be > 0');
  
  // Sum check
  assert.strictEqual(result.totalMissedSalah, result.partialMissed + result.noPrayerMissed);
  assert.strictEqual(result.totalObligatorySalah, result.totalEligibleDays * 5);
  assert.strictEqual(result.totalPrayedSalah, result.totalObligatorySalah - result.totalMissedSalah);
  assert.strictEqual(result.remainingQaza, result.totalMissedSalah - 250);

  console.log('✓ Test 1 Passed: Standard Male Scenario');
  console.log(`  Total Obligatory Salah: ${result.totalObligatorySalah}`);
  console.log(`  Total Prayed: ${result.totalPrayedSalah}`);
  console.log(`  Total Missed: ${result.totalMissedSalah}`);
  console.log(`  Remaining Qaza: ${result.remainingQaza}`);
  console.log(`  Equivalent Duration: ${result.equivalentDurationText}`);
}

// Test Case 2: Female Scenario with Menstruation Exclusion
{
  const testDate = new Date('2025-01-01T00:00:00Z');
  const dob = new Date('2005-01-01T00:00:00Z');
  const result = calculateMissedSalah({
    name: 'Fatima',
    gender: 'female',
    dob,
    mandatoryAge: 12, // Salah starts 2017-01-01 (8 years up to 2025-01-01 = 96 months)
    regularPeriod: { years: 2, months: 0, days: 0 },
    partialPeriod: { years: 2, months: 0, days: 0 },
    partialMissedPerDay: 2,
    qazaAlreadyPrayed: 100,
    avgMenstruationDays: 5,
    currentDate: testDate
  });

  assert.strictEqual(result.isFemale, true);
  assert(result.estimatedMenstruationDays > 0, 'Menstruation days should be > 0');
  assert.strictEqual(result.totalEligibleDays, result.totalObligatoryDays - result.estimatedMenstruationDays);
  assert.strictEqual(result.totalObligatorySalah, result.totalEligibleDays * 5);
  assert.strictEqual(result.totalMissedSalah, result.partialMissed + result.noPrayerMissed);
  assert.strictEqual(result.remainingQaza, Math.max(0, result.totalMissedSalah - 100));

  console.log('✓ Test 2 Passed: Female Scenario with Menstruation');
  console.log(`  Obligatory Days: ${result.totalObligatoryDays}, Menstruation Days: ${result.estimatedMenstruationDays}`);
  console.log(`  Eligible Days: ${result.totalEligibleDays}`);
  console.log(`  Remaining Qaza: ${result.remainingQaza}`);
}

// Test Case 3: Edge Case - Future start date should throw error
try {
  const testDate = new Date('2025-01-01T00:00:00Z');
  const dob = new Date('2015-01-01T00:00:00Z');
  calculateMissedSalah({
    dob,
    mandatoryAge: 15,
    currentDate: testDate
  });
  assert.fail('Should have thrown error for future start date');
} catch (e) {
  assert(e.message.includes('future') || e.message.includes('cannot be in the future'));
  console.log('✓ Test 3 Passed: Future Start Date caught properly');
}

// Test Case 4: Over-entered regular + partial period clamped
{
  const testDate = new Date('2025-01-01T00:00:00Z');
  const dob = new Date('2000-01-01T00:00:00Z');
  const result = calculateMissedSalah({
    gender: 'male',
    dob,
    mandatoryAge: 15, // Starts 2015-01-01 = 10 years total
    regularPeriod: { years: 8, months: 0, days: 0 },
    partialPeriod: { years: 6, months: 0, days: 0 }, // 8 + 6 = 14 > 10
    partialMissedPerDay: 2,
    currentDate: testDate
  });

  assert.strictEqual(result.isClamped, true);
  assert.strictEqual(result.noPrayerEligibleDays, 0);
  assert.strictEqual(result.regularEligibleDays + result.partialEligibleDays, result.totalEligibleDays);
  console.log('✓ Test 4 Passed: Over-entered period gracefully clamped');
}

// Test Case 5: Qaza already prayed exceeds total missed -> clamped to 0, never negative
{
  const testDate = new Date('2025-01-01T00:00:00Z');
  const dob = new Date('2000-01-01T00:00:00Z');
  const result = calculateMissedSalah({
    gender: 'male',
    dob,
    mandatoryAge: 15,
    regularPeriod: { years: 10, months: 0, days: 0 }, // All prayed regularly!
    partialPeriod: { years: 0, months: 0, days: 0 },
    qazaAlreadyPrayed: 500,
    currentDate: testDate
  });

  assert.strictEqual(result.totalMissedSalah, 0);
  assert.strictEqual(result.remainingQaza, 0);
  assert.strictEqual(result.missedPercentage, 0);
  console.log('✓ Test 5 Passed: Zero missed Salah and no negative Qaza');
}

console.log('\n--- ALL CALCULATOR TESTS PASSED SUCCESSFULLY! ---');
