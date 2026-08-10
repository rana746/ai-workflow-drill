const form = document.getElementById("signup-form");
const successMessage = document.getElementById("success-message");

const validators = {
  fullName: (value) => {
    const trimmed = value.trim();
    if (!trimmed) return "Full name is required.";
    if (trimmed.length < 2) return "Name must be at least 2 characters.";
    if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) return "Name can only contain letters, spaces, hyphens, and apostrophes.";
    return "";
  },

  email: (value) => {
    const trimmed = value.trim();
    if (!trimmed) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "Please enter a valid email address.";
    return "";
  },

  password: (value) => {
    if (!value) return "Password is required.";
    if (value.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter.";
    if (!/[0-9]/.test(value)) return "Password must contain at least one number.";
    return "";
  },

  confirmPassword: (value, formData) => {
    if (!value) return "Please confirm your password.";
    if (value !== formData.password) return "Passwords do not match.";
    return "";
  },

  terms: (checked) => {
    if (!checked) return "You must agree to the Terms of Service.";
    return "";
  },
};

function getFormData() {
  return {
    fullName: form.fullName.value,
    email: form.email.value,
    password: form.password.value,
    confirmPassword: form.confirmPassword.value,
    terms: form.terms.checked,
  };
}

function showError(fieldName, message) {
  const input = form.elements[fieldName];
  const errorEl = document.getElementById(`${fieldName}-error`);

  if (input && input.type !== "checkbox") {
    input.classList.toggle("invalid", !!message);
    input.classList.toggle("valid", !message && input.value.trim() !== "");
  }

  if (errorEl) {
    errorEl.textContent = message;
  }
}

function clearError(fieldName) {
  showError(fieldName, "");
}

function validateField(fieldName) {
  const data = getFormData();
  let error = "";

  if (fieldName === "terms") {
    error = validators.terms(data.terms);
  } else if (fieldName === "confirmPassword") {
    error = validators.confirmPassword(data.confirmPassword, data);
  } else {
    error = validators[fieldName](data[fieldName]);
  }

  showError(fieldName, error);
  return !error;
}

function validateForm() {
  const fields = ["fullName", "email", "password", "confirmPassword", "terms"];
  const results = fields.map(validateField);
  return results.every(Boolean);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateForm()) {
    const firstInvalid = form.querySelector(".invalid, input:invalid, input[type='checkbox']:not(:checked)");
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  form.hidden = true;
  successMessage.hidden = false;
});

["fullName", "email", "password", "confirmPassword"].forEach((fieldName) => {
  const input = form.elements[fieldName];

  input.addEventListener("blur", () => validateField(fieldName));

  input.addEventListener("input", () => {
    if (input.classList.contains("invalid")) {
      validateField(fieldName);
    }
  });
});

form.terms.addEventListener("change", () => validateField("terms"));

form.password.addEventListener("input", () => {
  if (form.confirmPassword.value) {
    validateField("confirmPassword");
  }
});
