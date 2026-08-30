"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const form =
    document.getElementById(
      "forgotPasswordForm"
    );

  const emailInput =
    document.getElementById("email");

  const emailError =
    document.getElementById("emailError");

  const resetSubmit =
    document.getElementById(
      "resetSubmit"
    );

  const resetMessage =
    document.getElementById(
      "resetMessage"
    );


  if (
    !form ||
    !emailInput ||
    !emailError ||
    !resetSubmit ||
    !resetMessage
  ) {
    return;
  }


  function normalizeEmail(value) {

    return String(value || "")
      .trim()
      .toLowerCase();

  }


  function isValidEmail(email) {

    if (!email || email.length > 254) {
      return false;
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email
    );

  }


  function showError(message) {

    emailError.textContent =
      message;

    emailInput.classList.add(
      "invalid"
    );

    emailInput.setAttribute(
      "aria-invalid",
      "true"
    );

  }


  function clearError() {

    emailError.textContent =
      "";

    emailInput.classList.remove(
      "invalid"
    );

    emailInput.removeAttribute(
      "aria-invalid"
    );

  }


  emailInput.addEventListener(
    "input",
    () => {

      clearError();

      resetMessage.textContent =
        "";

    }
  );


  form.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      clearError();

      resetMessage.textContent =
        "";


      const email =
        normalizeEmail(
          emailInput.value
        );


      if (!email) {

        showError(
          "Please enter your email address."
        );

        emailInput.focus();

        return;

      }


      if (!isValidEmail(email)) {

        showError(
          "Please enter a valid email address."
        );

        emailInput.focus();

        return;

      }


      resetSubmit.disabled =
        true;

      resetSubmit.textContent =
        "Checking...";


      window.setTimeout(
        () => {

          resetSubmit.disabled =
            false;

          resetSubmit.textContent =
            "Continue";


          resetMessage.textContent =
            "Password recovery will be available after secure backend setup.";

        },
        700
      );

    }
  );

});