const test = require('node:test');
const assert = require('node:assert');
const {
  validateFullName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateTerms,
} = require('./validation.js');

test('Full name: rejects empty value', () => {
  assert.strictEqual(validateFullName('').valid, false);
});

test('Full name: rejects a single word', () => {
  const result = validateFullName('John');
  assert.strictEqual(result.valid, false);
  assert.strictEqual(result.message, 'Please enter your first and last name.');
});

test('Full name: accepts first and last name', () => {
  assert.strictEqual(validateFullName('John Smith').valid, true);
});

test('Email: rejects empty value', () => {
  assert.strictEqual(validateEmail('').valid, false);
});

test('Email: rejects invalid format', () => {
  assert.strictEqual(validateEmail('not-an-email').valid, false);
});

test('Email: accepts valid format', () => {
  assert.strictEqual(validateEmail('jane@example.com').valid, true);
});

test('Password: rejects passwords under 8 characters', () => {
  assert.strictEqual(validatePassword('Short1', 'John Smith').valid, false);
});

test('Password: rejects passwords with no uppercase letter', () => {
  assert.strictEqual(validatePassword('lowercase123', 'John Smith').valid, false);
});

test('Password: rejects an exact match with the full name', () => {
  const result = validatePassword('John Smith', 'John Smith');
  assert.strictEqual(result.valid, false);
  assert.strictEqual(result.message, 'Your password should not contain your name.');
});

test('Password: rejects the name embedded inside a longer password', () => {
  const result = validatePassword('MyJohnSmith2024', 'John Smith');
  assert.strictEqual(result.valid, false);
  assert.strictEqual(result.message, 'Your password should not contain your name.');
});

test('Password: accepts a valid password different from the name', () => {
  assert.strictEqual(validatePassword('Sup3rSecret', 'John Smith').valid, true);
});

test('Confirm password: rejects empty value', () => {
  assert.strictEqual(validateConfirmPassword('', 'Sup3rSecret').valid, false);
});

test('Confirm password: rejects a mismatch', () => {
  const result = validateConfirmPassword('Different1', 'Sup3rSecret');
  assert.strictEqual(result.valid, false);
  assert.strictEqual(result.message, 'Passwords do not match.');
});

test('Confirm password: accepts an exact match and reports success', () => {
  const result = validateConfirmPassword('Sup3rSecret', 'Sup3rSecret');
  assert.strictEqual(result.valid, true);
  assert.strictEqual(result.message, 'Password matched');
});

test('Terms: rejects unchecked', () => {
  assert.strictEqual(validateTerms(false).valid, false);
});

test('Terms: accepts checked', () => {
  assert.strictEqual(validateTerms(true).valid, true);
});
