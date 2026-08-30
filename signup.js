"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("signupForm");

  const fullName =
    document.getElementById("fullName");

  const email =
    document.getElementById("email");

  const dateOfBirth =
    document.getElementById("dateOfBirth");

  const password =
    document.getElementById("password");

  const confirmPassword =
    document.getElementById("confirmPassword");

  const terms =
    document.getElementById("terms");

  const profileImage =
    document.getElementById("profileImage");

  const profilePreview =
    document.getElementById("profilePreview");

  const passwordStrengthBar =
    document.getElementById("passwordStrengthBar");

  const passwordStrengthText =
    document.getElementById("passwordStrengthText");

  const signupMessage =
    document.getElementById("signupMessage");

  const signupSubmit =
    document.getElementById("signupSubmit");


  function getError(input) {

    if (!input) {
      return null;
    }

    return document.getElementById(
      `${input.id}Error`
    );
  }


  function setError(input, message) {

    if (!input) {
      return;
    }

    const error = getError(input);
    const field = input.closest(".signup-field");

    if (error) {
      error.textContent = message;
    }

    if (field) {
      field.classList.add("has-error");
      field.classList.remove("has-success");
    }
  }


  function clearError(input) {

    if (!input) {
      return;
    }

    const error = getError(input);
    const field = input.closest(".signup-field");

    if (error) {
      error.textContent = "";
    }

    if (field) {
      field.classList.remove("has-error");
    }
  }


  function setSuccess(input) {

    if (!input) {
      return;
    }

    const field = input.closest(".signup-field");

    if (field) {
      field.classList.remove("has-error");
      field.classList.add("has-success");
    }
  }


  function showMessage(message, type) {

    if (!signupMessage) {
      return;
    }

    signupMessage.textContent = message;

    signupMessage.className =
      `signup-form-message show ${type}`;
  }


  function clearMessage() {

    if (!signupMessage) {
      return;
    }

    signupMessage.textContent = "";

    signupMessage.className =
      "signup-form-message";
  }


  function isValidEmail(value) {

    if (
      !value ||
      value.length > 254
    ) {
      return false;
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(value);
  }


  function isValidDateOfBirth(value) {

    if (
      !/^\d{2}\/\d{2}\/\d{4}$/.test(value)
    ) {
      return false;
    }

    const parts =
      value.split("/");

    const day =
      Number(parts[ 0 ]);

    const month =
      Number(parts[ 1 ]);

    const year =
      Number(parts[ 2 ]);

    if (
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > 31 ||
      year < 1900
    ) {
      return false;
    }

    const date =
      new Date(
        year,
        month - 1,
        day
      );

    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }


  function isValidPassword(value) {

    return (
      typeof value === "string" &&
      value.length >= 8 &&
      value.length <= 128 &&
      !/\s/.test(value)
    );
  }


  function updatePasswordStrength(value) {

    if (
      !passwordStrengthBar ||
      !passwordStrengthText
    ) {
      return;
    }

    passwordStrengthBar.className =
      "password-strength-bar";

    if (!value) {

      passwordStrengthText.textContent =
        "Use at least 8 characters.";

      return;
    }

    let score = 0;

    if (value.length >= 8) score++;
    if (value.length >= 12) score++;
    if (/[a-z]/.test(value)) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    if (score <= 2) {

      passwordStrengthBar.classList.add("weak");

      passwordStrengthText.textContent =
        "Weak password.";

    } else if (score <= 4) {

      passwordStrengthBar.classList.add("medium");

      passwordStrengthText.textContent =
        "Medium password.";

    } else if (score === 5) {

      passwordStrengthBar.classList.add("strong");

      passwordStrengthText.textContent =
        "Strong password.";

    } else {

      passwordStrengthBar.classList.add("very-strong");

      passwordStrengthText.textContent =
        "Very strong password.";
    }
  }


  if (password) {

    password.addEventListener(
      "input",
      () => {

        updatePasswordStrength(
          password.value
        );

        clearError(password);
        clearMessage();
      }
    );
  }


  if (dateOfBirth) {

    dateOfBirth.addEventListener(
      "input",
      () => {

        let value =
          dateOfBirth.value
            .replace(/\D/g, "")
            .slice(0, 8);

        if (value.length > 4) {

          value =
            `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;

        } else if (value.length > 2) {

          value =
            `${value.slice(0, 2)}/${value.slice(2)}`;
        }

        dateOfBirth.value = value;

        clearError(dateOfBirth);
        clearMessage();
      }
    );
  }


  if (profileImage) {

    profileImage.addEventListener(
      "change",
      () => {

        const file =
          profileImage.files?.[ 0 ];

        if (!file) {
          return;
        }

        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/webp"
        ];

        if (
          !allowedTypes.includes(
            file.type
          )
        ) {

          profileImage.value = "";

          showMessage(
            "Please choose a JPG, PNG or WebP image.",
            "error"
          );

          return;
        }

        if (
          file.size >
          2 * 1024 * 1024
        ) {

          profileImage.value = "";

          showMessage(
            "Profile image must be 2 MB or smaller.",
            "error"
          );

          return;
        }

        const reader =
          new FileReader();

        reader.onload = () => {

          if (profilePreview) {
            profilePreview.src =
              reader.result;
          }
        };

        reader.readAsDataURL(file);
      }
    );
  }


  document
    .querySelectorAll(".password-toggle")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const input =
            document.getElementById(
              button.dataset.target
            );

          if (!input) {
            return;
          }

          const show =
            input.type === "password";

          input.type =
            show
              ? "text"
              : "password";

          button.textContent =
            show
              ? "Hide"
              : "Show";

          button.setAttribute(
            "aria-label",
            show
              ? "Hide password"
              : "Show password"
          );
        }
      );
    });


  function validateForm() {

    let valid = true;


    const name =
      fullName.value.trim();

    if (
      name.length < 2 ||
      name.length > 80
    ) {

      setError(
        fullName,
        "Please enter your full name."
      );

      valid = false;

    } else {

      clearError(fullName);
      setSuccess(fullName);
    }


    const mail =
      email.value.trim();

    if (!isValidEmail(mail)) {

      setError(
        email,
        "Please enter a valid email address."
      );

      valid = false;

    } else {

      clearError(email);
      setSuccess(email);
    }


    const dob =
      dateOfBirth.value.trim();

    if (!isValidDateOfBirth(dob)) {

      setError(
        dateOfBirth,
        "Enter a valid date in DD/MM/YYYY format."
      );

      valid = false;

    } else {

      clearError(dateOfBirth);
      setSuccess(dateOfBirth);
    }


    if (!isValidPassword(password.value)) {

      setError(
        password,
        "Password must contain 8–128 characters and no spaces."
      );

      valid = false;

    } else {

      clearError(password);
      setSuccess(password);
    }


    if (
      confirmPassword.value !==
      password.value
    ) {

      setError(
        confirmPassword,
        "Passwords do not match."
      );

      valid = false;

    } else {

      clearError(confirmPassword);
      setSuccess(confirmPassword);
    }


    const termsError =
      document.getElementById(
        "termsError"
      );

    if (!terms.checked) {

      if (termsError) {
        termsError.textContent =
          "Please agree to the CIVA Terms.";
      }

      valid = false;

    } else {

      if (termsError) {
        termsError.textContent = "";
      }
    }


    return valid;
  }


  [
    fullName,
    email,
    dateOfBirth,
    password,
    confirmPassword
  ].forEach(input => {

    if (!input) {
      return;
    }

    input.addEventListener(
      "input",
      () => {

        clearError(input);
        clearMessage();
      }
    );
  });


  if (form) {

    form.addEventListener(
      "submit",
      event => {

        event.preventDefault();

        if (!validateForm()) {

          showMessage(
            "Please fix the highlighted fields.",
            "error"
          );

          return;
        }


        const user = {
          fullName:
            fullName.value.trim(),

          email:
            email.value.trim().toLowerCase(),

          dateOfBirth:
            dateOfBirth.value.trim(),

          profileImage:
            profilePreview?.src || "",

          createdAt:
            new Date().toISOString()
        };


        try {

          localStorage.setItem(
            "civaUserProfile",
            JSON.stringify(user)
          );

          localStorage.setItem(
            "civaLoggedIn",
            "true"
          );

        } catch (error) {

          showMessage(
            "Your browser could not save the profile. Please try again.",
            "error"
          );

          return;
        }


        if (signupSubmit) {
          signupSubmit.disabled = true;
        }


        window.location.href =
          "profile.html";

      }
    );
  }

});