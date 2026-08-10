(function (root) {
  'use strict';

  function validateFullName(value) {
    const trimmed = (value || '').trim();
    if (trimmed.length === 0) {
      return { valid: false, message: 'Full name is required.' };
    }
    const words = trimmed.split(/\s+/).filter(Boolean);
    if (words.length < 2) {
      return { valid: false, message: 'Please enter your first and last name.' };
    }
    return { valid: true, message: '' };
  }

  function validateEmail(value) {
    const trimmed = (value || '').trim();
    if (trimmed.length === 0) {
      return { valid: false, message: 'Email is required.' };
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmed)) {
      return { valid: false, message: 'Please enter a valid email address.' };
    }
    return { valid: true, message: '' };
  }

  function validatePassword(value, fullName) {
    const password = value || '';
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters long.' };
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one uppercase letter.' };
    }
    const normalizedName = (fullName || '').trim().toLowerCase().replace(/\s+/g, '');
    const normalizedPassword = password.toLowerCase().replace(/\s+/g, '');
    if (normalizedName.length > 0 && normalizedPassword.includes(normalizedName)) {
      return { valid: false, message: 'Your password should not contain your name.' };
    }
    return { valid: true, message: '' };
  }

  function validateConfirmPassword(value, password) {
    if (!value) {
      return { valid: false, message: 'Please confirm your password.', success: false };
    }
    if (value !== password) {
      return { valid: false, message: 'Passwords do not match.', success: false };
    }
    return { valid: true, message: 'Password matched', success: true };
  }

  function validateTerms(checked) {
    if (!checked) {
      return { valid: false, message: 'You must agree to the Terms of Service.' };
    }
    return { valid: true, message: '' };
  }

  const api = {
    validateFullName,
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    validateTerms,
  };

  // Export for Node-based automated tests
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  // Expose for any inline browser usage/debugging
  if (typeof root !== 'undefined') {
    root.SignupValidation = api;
  }

  // DOM wiring only runs in a real browser, not under Node during tests
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function () {
      const form = document.getElementById('signup-form');
      const successMessage = document.getElementById('success-message');
      if (!form) return;

      const fullNameInput = document.getElementById('fullName');
      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');
      const confirmPasswordInput = document.getElementById('confirmPassword');
      const termsInput = document.getElementById('terms');

      const fullNameError = document.getElementById('fullName-error');
      const emailError = document.getElementById('email-error');
      const passwordError = document.getElementById('password-error');
      const confirmPasswordError = document.getElementById('confirmPassword-error');
      const termsError = document.getElementById('terms-error');

      function applyResult(input, errorEl, result) {
        input.setAttribute('aria-invalid', result.valid ? 'false' : 'true');
        errorEl.textContent = result.valid ? '' : result.message;
        errorEl.classList.remove('is-success');
        return result.valid;
      }

      function applyConfirmPasswordResult(input, errorEl, result) {
        input.setAttribute('aria-invalid', result.valid ? 'false' : 'true');
        errorEl.textContent = result.message;
        errorEl.classList.toggle('is-success', !!result.success);
        return result.valid;
      }

      function checkFullName() {
        return applyResult(fullNameInput, fullNameError, validateFullName(fullNameInput.value));
      }
      function checkEmail() {
        return applyResult(emailInput, emailError, validateEmail(emailInput.value));
      }
      function checkPassword() {
        return applyResult(
          passwordInput,
          passwordError,
          validatePassword(passwordInput.value, fullNameInput.value)
        );
      }
      function checkConfirmPassword() {
        return applyConfirmPasswordResult(
          confirmPasswordInput,
          confirmPasswordError,
          validateConfirmPassword(confirmPasswordInput.value, passwordInput.value)
        );
      }
      function checkTerms() {
        return applyResult(termsInput, termsError, validateTerms(termsInput.checked));
      }

      fullNameInput.addEventListener('blur', checkFullName);
      emailInput.addEventListener('blur', checkEmail);
      passwordInput.addEventListener('blur', checkPassword);
      confirmPasswordInput.addEventListener('blur', checkConfirmPassword);
      termsInput.addEventListener('change', checkTerms);

      // Re-validate dependent fields once they've already been checked
      fullNameInput.addEventListener('input', function () {
        if (passwordInput.getAttribute('aria-invalid') !== null) {
          checkPassword();
        }
      });
      passwordInput.addEventListener('input', function () {
        if (confirmPasswordInput.value) {
          checkConfirmPassword();
        }
      });

      form.addEventListener('submit', function (event) {
        event.preventDefault();

        const nameOk = checkFullName();
        const emailOk = checkEmail();
        const passwordOk = checkPassword();
        const confirmOk = checkConfirmPassword();
        const termsOk = checkTerms();

        const allOk = nameOk && emailOk && passwordOk && confirmOk && termsOk;

        if (!allOk) {
          const firstInvalid = form.querySelector('[aria-invalid="true"]');
          if (firstInvalid) firstInvalid.focus();
          return;
        }

        form.hidden = true;
        successMessage.hidden = false;
      });
    });
  }
})(typeof window !== 'undefined' ? window : undefined);
