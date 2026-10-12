// =====================================================
// Student Registration Form - script.js
// Topics: Event Object, Form Validation, Submit Events,
// Error Messages, classList, data-* / dataset, Attributes
// =====================================================

// ----- Grab the elements we need -----
const form = document.getElementById("registrationForm");
const successMessage = document.getElementById("successMessage");
const togglePasswordBtn = document.getElementById("togglePassword");

const studentId = document.getElementById("studentId");
const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const dob = document.getElementById("dob");
const genderGroup = document.getElementById("genderGroup");
const program = document.getElementById("program");
const yearLevel = document.getElementById("yearLevel");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const address = document.getElementById("address");
const agreement = document.getElementById("agreement");

// ----- Validation patterns (formats chosen for this project) -----
const studentIdPattern = /^\d{4}-\d{5}$/;                 // 2024-12345
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;      // name@domain.ext
const phonePattern = /^09\d{9}$/;                          // 09123456789
const namePattern = /^[A-Za-z][A-Za-z .'-]*$/;             // letters, spaces, . ' -

// =====================================================
// Helper functions for errors (classList.add / remove)
// =====================================================

// Find the <span class="error-message"> that belongs to a field
function getErrorElement(field) {
  return field.closest(".field").querySelector(".error-message");
}

// Show an error: red styling + specific message
function showError(field, message) {
  field.classList.add("error");                 // classList.add()
  field.setAttribute("aria-invalid", "true");   // attribute manipulation (accessibility)
  getErrorElement(field).textContent = message;
}

// Clear an error: remove red styling + message
function clearError(field) {
  field.classList.remove("error");              // classList.remove()
  field.removeAttribute("aria-invalid");
  getErrorElement(field).textContent = "";
}

// =====================================================
// Individual validators - each returns true or false
// field.dataset.label / hint / minLength come from the
// data-* attributes written in index.html
// =====================================================

function validateStudentId() {
  const value = studentId.value.trim();         // trim()
  studentId.value = value;
  if (value === "") {
    showError(studentId, studentId.dataset.label + " is required.");
    return false;
  }
  if (!studentIdPattern.test(value)) {
    showError(studentId, studentId.dataset.hint);
    return false;
  }
  clearError(studentId);
  return true;
}

function validateFullName() {
  const value = fullName.value.trim();
  fullName.value = value;
  if (value === "") {
    showError(fullName, fullName.dataset.label + " is required.");
    return false;
  }
  if (value.length < 3 || !namePattern.test(value)) {
    showError(fullName, "Enter your real name using letters only (at least 3 characters).");
    return false;
  }
  clearError(fullName);
  return true;
}

function validateEmail() {
  const value = email.value.trim();
  email.value = value;
  if (value === "") {
    showError(email, email.dataset.label + " is required.");
    return false;
  }
  if (!emailPattern.test(value)) {
    showError(email, "Enter a valid email address, like juan@school.edu.");
    return false;
  }
  clearError(email);
  return true;
}

function validatePhone() {
  const value = phone.value.trim();
  phone.value = value;
  if (value === "") {
    showError(phone, phone.dataset.label + " is required.");
    return false;
  }
  if (!phonePattern.test(value)) {
    showError(phone, phone.dataset.hint);
    return false;
  }
  clearError(phone);
  return true;
}

function validateDob() {
  if (dob.value === "") {
    showError(dob, dob.dataset.label + " is required.");
    return false;
  }
  const birth = new Date(dob.value);
  const today = new Date();
  if (birth > today) {
    showError(dob, "Date of birth cannot be in the future.");
    return false;
  }
  // Compute age in whole years
  let age = today.getFullYear() - birth.getFullYear();
  const hadBirthday =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  if (!hadBirthday) age--;
  if (age < 15) {
    showError(dob, "You must be at least 15 years old to register.");
    return false;
  }
  clearError(dob);
  return true;
}

function validateGender() {
  const selected = form.querySelector('input[name="gender"]:checked');
  if (!selected) {
    showError(genderGroup, "Select a " + genderGroup.dataset.label.toLowerCase() + " option.");
    return false;
  }
  clearError(genderGroup);
  return true;
}

function validateProgram() {
  if (program.value === "") {
    showError(program, "Select your program.");
    return false;
  }
  clearError(program);
  return true;
}

function validateYearLevel() {
  if (yearLevel.value === "") {
    showError(yearLevel, "Select your year level.");
    return false;
  }
  clearError(yearLevel);
  return true;
}

function validatePassword() {
  const value = password.value.trim();
  const minLength = Number(password.dataset.minLength);   // dataset: "8" -> 8
  if (value === "") {
    showError(password, password.dataset.label + " is required.");
    return false;
  }
  if (value.length < minLength) {
    showError(password, "Password must be at least " + minLength + " characters long.");
    return false;
  }
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
    showError(password, password.dataset.hint);
    return false;
  }
  clearError(password);
  return true;
}

function validateConfirmPassword() {
  const value = confirmPassword.value.trim();
  if (value === "") {
    showError(confirmPassword, "Confirm your password.");
    return false;
  }
  if (value !== password.value.trim()) {
    showError(confirmPassword, "Passwords do not match.");
    return false;
  }
  clearError(confirmPassword);
  return true;
}

function validateAddress() {
  const value = address.value.trim();
  address.value = value;
  const minLength = Number(address.dataset.minLength);
  if (value === "") {
    showError(address, address.dataset.label + " is required.");
    return false;
  }
  if (value.length < minLength) {
    showError(address, "Enter your complete address (at least " + minLength + " characters).");
    return false;
  }
  clearError(address);
  return true;
}

function validateAgreement() {
  if (!agreement.checked) {
    showError(agreement, "You must agree to the enrollment terms before registering.");
    return false;
  }
  clearError(agreement);
  return true;
}

// =====================================================
// Submit event (Event Object + preventDefault)
// =====================================================
form.addEventListener("submit", function (event) {
  // Stop the browser from submitting/reloading the page
  event.preventDefault();

  // Run EVERY validator (no short-circuit) so all errors show at once
  const results = [
    validateStudentId(),
    validateFullName(),
    validateEmail(),
    validatePhone(),
    validateDob(),
    validateGender(),
    validateProgram(),
    validateYearLevel(),
    validatePassword(),
    validateConfirmPassword(),
    validateAddress(),
    validateAgreement()
  ];

  const allValid = results.every(function (ok) { return ok; });

  if (!allValid) {
    successMessage.hidden = true;
    // Move focus to the first invalid field
    const firstInvalid = form.querySelector(".error");
    if (firstInvalid) {
      const target = firstInvalid.matches("fieldset, label")
        ? firstInvalid.querySelector("input")
        : firstInvalid;
      target.focus();
    }
    return;
  }

  // Everything is valid: show success message (errors are already cleared)
  successMessage.textContent =
    "Registration successful! Welcome, " + fullName.value.trim() + " (" + studentId.value.trim() + ").";
  successMessage.hidden = false;
  successMessage.scrollIntoView({ behavior: "smooth", block: "start" });
});

// =====================================================
// Live feedback: re-validate a field once the user fixes it
// event.target tells us which field fired the event
// =====================================================
const liveValidators = {
  studentId: validateStudentId,
  fullName: validateFullName,
  email: validateEmail,
  phone: validatePhone,
  dob: validateDob,
  program: validateProgram,
  yearLevel: validateYearLevel,
  password: validatePassword,
  confirmPassword: validateConfirmPassword,
  address: validateAddress,
  agreement: validateAgreement
};

form.addEventListener("input", function (event) {
  const field = event.target;

  // Only react if this field is currently marked invalid
  if (field.classList.contains("error") && liveValidators[field.id]) {
    liveValidators[field.id]();
  }
  // Changing the password also affects the confirm field
  if (field === password && confirmPassword.classList.contains("error")) {
    validateConfirmPassword();
  }
  if (field.name === "gender" && genderGroup.classList.contains("error")) {
    validateGender();
  }
});

// Selects, date, radios and checkbox fire "change"
form.addEventListener("change", function (event) {
  const field = event.target;
  if (field.classList.contains("error") && liveValidators[field.id]) {
    liveValidators[field.id]();
  }
  if (field.name === "gender") {
    validateGender();
  }
});

// =====================================================
// Show / Hide password
// classList.toggle() + attribute manipulation (type)
// =====================================================
togglePasswordBtn.addEventListener("click", function () {
  // Toggle the "active" class on the button; toggle() returns true when the class was added
  const isShowing = togglePasswordBtn.classList.toggle("active");

  // Change the input "type" attribute so the password is readable or hidden
  const newType = isShowing ? "text" : "password";
  password.setAttribute("type", newType);
  confirmPassword.setAttribute("type", newType);

  // Keep the button text and accessible label in sync
  togglePasswordBtn.textContent = isShowing ? "Hide" : "Show";
  togglePasswordBtn.setAttribute("aria-label", isShowing ? "Hide password" : "Show password");
});

// =====================================================
// Reset: clear errors, success message and password toggle
// =====================================================
form.addEventListener("reset", function () {
  // Remove error styling and messages from every field
  form.querySelectorAll(".error").forEach(function (el) {
    clearError(el);
  });
  form.querySelectorAll(".error-message").forEach(function (span) {
    span.textContent = "";
  });

  // Hide and empty the success message
  successMessage.hidden = true;
  successMessage.textContent = "";

  // Put the password fields and toggle button back to their original state
  password.setAttribute("type", "password");
  confirmPassword.setAttribute("type", "password");
  togglePasswordBtn.classList.remove("active");
  togglePasswordBtn.textContent = "Show";
  togglePasswordBtn.setAttribute("aria-label", "Show password");
});
