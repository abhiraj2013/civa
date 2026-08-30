"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const form =
    document.getElementById("loginForm");

  const emailInput =
    document.getElementById("email");

  const passwordInput =
    document.getElementById("password");

  const rememberMe =
    document.getElementById("rememberMe");

  const submitButton =
    document.getElementById("loginSubmit");

  const message =
    document.getElementById("loginMessage");


  /* =========================
     MESSAGE
  ========================= */

  function showMessage(text, type) {

    if (!message) {
      return;
    }

    message.textContent = text;

    message.className =
      `login-message show ${type}`;

  }


  function clearMessage() {

    if (!message) {
      return;
    }

    message.textContent = "";

    message.className =
      "login-message";

  }


  /* =========================
     ERRORS
  ========================= */

  function setError(input, text) {

    if (!input) {
      return;
    }

    const field =
      input.closest(".login-field");

    const error =
      document.getElementById(
        `${input.id}Error`
      );

    if (error) {
      error.textContent = text;
    }

    if (field) {

      field.classList.add(
        "has-error"
      );

      field.classList.remove(
        "has-success"
      );

    }

  }


  function clearError(input) {

    if (!input) {
      return;
    }

    const field =
      input.closest(".login-field");

    const error =
      document.getElementById(
        `${input.id}Error`
      );

    if (error) {
      error.textContent = "";
    }

    if (field) {

      field.classList.remove(
        "has-error"
      );

    }

  }


  function setSuccess(input) {

    if (!input) {
      return;
    }

    const field =
      input.closest(".login-field");

    if (field) {

      field.classList.remove(
        "has-error"
      );

      field.classList.add(
        "has-success"
      );

    }

  }


  /* =========================
     EMAIL VALIDATION
  ========================= */

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


  /* =========================
     GET LOCAL PROFILE
  ========================= */

  function getSavedUser() {

    try {

      const saved =
        localStorage.getItem(
          "civaUserProfile"
        );

      if (!saved) {
        return null;
      }

      const user =
        JSON.parse(saved);

      if (
        !user ||
        typeof user !== "object"
      ) {
        return null;
      }

      return user;

    } catch (error) {

      console.warn(
        "CIVA profile could not be read.",
        error
      );

      return null;

    }

  }


  /* =========================
     PASSWORD TOGGLE
  ========================= */

  document
    .querySelectorAll(".password-toggle")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const target =
            document.getElementById(
              button.dataset.target
            );

          if (!target) {
            return;
          }

          const shouldShow =
            target.type === "password";

          target.type =
            shouldShow
              ? "text"
              : "password";

          button.textContent =
            shouldShow
              ? "Hide"
              : "Show";

          button.setAttribute(
            "aria-label",
            shouldShow
              ? "Hide password"
              : "Show password"
          );

        }
      );

    });


  /* =========================
     INPUT EVENTS
  ========================= */

  [
    emailInput,
    passwordInput
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


  /* =========================
     FORM SUBMIT
  ========================= */

  if (form) {

    form.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        const email =
          emailInput
            ? emailInput.value
              .trim()
              .toLowerCase()
            : "";


        const password =
          passwordInput
            ? passwordInput.value
            : "";


        clearMessage();

        clearError(emailInput);
        clearError(passwordInput);


        let valid = true;


        /* EMAIL */

        if (!isValidEmail(email)) {

          setError(
            emailInput,
            "Please enter a valid email address."
          );

          valid = false;

        } else {

          setSuccess(emailInput);

        }


        /* PASSWORD */

        if (
          !password ||
          password.length < 8 ||
          password.length > 128
        ) {

          setError(
            passwordInput,
            "Please enter a valid password."
          );

          valid = false;

        } else {

          setSuccess(passwordInput);

        }


        if (!valid) {

          showMessage(
            "Please fix the highlighted fields.",
            "error"
          );

          return;

        }


        /* =========================
           FIND LOCAL ACCOUNT
        ========================= */

        const user =
          getSavedUser();


        if (!user) {

          showMessage(
            "No CIVA account was found on this device. Please create an account first.",
            "error"
          );

          return;

        }


        const savedEmail =
          typeof user.email === "string"
            ? user.email
              .trim()
              .toLowerCase()
            : "";


        if (
          !savedEmail ||
          savedEmail !== email
        ) {

          showMessage(
            "The email address does not match the CIVA account on this device.",
            "error"
          );

          return;

        }


        /* =========================
           FRONTEND MVP SESSION
        ========================= */

        try {

          localStorage.setItem(
            "civaLoggedIn",
            "true"
          );


          /*
           * Keep a simple current-user
           * reference for other pages.
           */

          localStorage.setItem(
            "civaCurrentUserEmail",
            savedEmail
          );


          /*
           * These values help the
           * Creators and Leaders pages
           * identify the current account.
           */

          if (user.fullName) {

            localStorage.setItem(
              "civaCurrentUserName",
              String(user.fullName)
            );

          }


          /*
           * Optional compatibility key.
           */

          localStorage.setItem(
            "civaUser",
            JSON.stringify(user)
          );


        } catch (error) {

          showMessage(
            "Your browser could not restore the CIVA session. Please try again.",
            "error"
          );

          return;

        }


        /* =========================
           REMEMBER ME
        ========================= */

        if (rememberMe?.checked) {

          try {

            localStorage.setItem(
              "civaRememberMe",
              "true"
            );

          } catch (error) {

            console.warn(
              "Remember-me preference could not be saved."
            );

          }

        } else {

          try {

            localStorage.removeItem(
              "civaRememberMe"
            );

          } catch (error) {

            // Ignore storage cleanup errors.

          }

        }


        /* =========================
           SUCCESS
        ========================= */

        showMessage(
          "Signed in successfully. Opening your profile...",
          "success"
        );


        if (submitButton) {

          submitButton.disabled = true;

        }


        setTimeout(() => {

          window.location.href =
            "profile.html";

        }, 500);

      }
    );

  }


  /* =========================
     AUTO RESTORE EMAIL
  ========================= */

  try {

    const savedUser =
      getSavedUser();

    const savedEmail =
      savedUser &&
        typeof savedUser.email === "string"
        ? savedUser.email.trim()
        : "";


    if (
      savedEmail &&
      emailInput
    ) {

      emailInput.value =
        savedEmail;

    }


    const remembered =
      localStorage.getItem(
        "civaRememberMe"
      ) === "true";


    if (rememberMe) {

      rememberMe.checked =
        remembered;

    }

  } catch (error) {

    console.warn(
      "CIVA login preferences could not be restored."
    );

  }

});