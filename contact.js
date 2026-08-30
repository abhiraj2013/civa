"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const form =
    document.getElementById("contactForm");

  const emailInput =
    document.getElementById("contactEmail");

  const categoryInput =
    document.getElementById(
      "contactCategory"
    );

  const messageInput =
    document.getElementById(
      "contactMessage"
    );

  const emailError =
    document.getElementById(
      "contactEmailError"
    );

  const categoryError =
    document.getElementById(
      "contactCategoryError"
    );

  const messageError =
    document.getElementById(
      "contactMessageError"
    );

  const characters =
    document.getElementById(
      "messageCharacters"
    );

  const submitButton =
    document.getElementById(
      "contactSubmit"
    );

  const status =
    document.getElementById(
      "contactMessageStatus"
    );


  if (
    !form ||
    !emailInput ||
    !categoryInput ||
    !messageInput ||
    !emailError ||
    !categoryError ||
    !messageError ||
    !characters ||
    !submitButton ||
    !status
  ) {
    return;
  }


  function normalizeEmail(value) {

    return String(value || "")
      .trim()
      .toLowerCase();

  }


  function isValidEmail(email) {

    if (
      !email ||
      email.length > 254
    ) {
      return false;
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email
    );

  }


  function clearErrors() {

    emailError.textContent = "";
    categoryError.textContent = "";
    messageError.textContent = "";

    emailInput.classList.remove(
      "invalid"
    );

    categoryInput.classList.remove(
      "invalid"
    );

    messageInput.classList.remove(
      "invalid"
    );

    emailInput.removeAttribute(
      "aria-invalid"
    );

    categoryInput.removeAttribute(
      "aria-invalid"
    );

    messageInput.removeAttribute(
      "aria-invalid"
    );

  }


  function updateCharacters() {

    characters.textContent =
      `${messageInput.value.length}/1000`;

  }


  function setInvalid(
    element,
    errorElement,
    message
  ) {

    element.classList.add(
      "invalid"
    );

    element.setAttribute(
      "aria-invalid",
      "true"
    );

    errorElement.textContent =
      message;

  }


  emailInput.addEventListener(
    "input",
    () => {

      emailError.textContent = "";

      emailInput.classList.remove(
        "invalid"
      );

      emailInput.removeAttribute(
        "aria-invalid"
      );

      status.textContent = "";

    }
  );


  categoryInput.addEventListener(
    "change",
    () => {

      categoryError.textContent = "";

      categoryInput.classList.remove(
        "invalid"
      );

      categoryInput.removeAttribute(
        "aria-invalid"
      );

      status.textContent = "";

    }
  );


  messageInput.addEventListener(
    "input",
    () => {

      updateCharacters();

      messageError.textContent = "";

      messageInput.classList.remove(
        "invalid"
      );

      messageInput.removeAttribute(
        "aria-invalid"
      );

      status.textContent = "";

    }
  );


  form.addEventListener(
    "submit",
    event => {

      event.preventDefault();

      clearErrors();

      status.textContent = "";


      const email =
        normalizeEmail(
          emailInput.value
        );

      const category =
        categoryInput.value;

      const message =
        messageInput.value.trim();


      let valid = true;


      if (!email) {

        setInvalid(
          emailInput,
          emailError,
          "Please enter your email address."
        );

        valid = false;

      } else if (
        !isValidEmail(email)
      ) {

        setInvalid(
          emailInput,
          emailError,
          "Please enter a valid email address."
        );

        valid = false;

      }


      if (!category) {

        setInvalid(
          categoryInput,
          categoryError,
          "Please select a category."
        );

        valid = false;

      }


      if (!message) {

        setInvalid(
          messageInput,
          messageError,
          "Please describe your issue."
        );

        valid = false;

      } else if (
        message.length < 10
      ) {

        setInvalid(
          messageInput,
          messageError,
          "Please provide a little more detail."
        );

        valid = false;

      } else if (
        message.length > 1000
      ) {

        setInvalid(
          messageInput,
          messageError,
          "Message must be 1000 characters or less."
        );

        valid = false;

      }


      if (!valid) {
        return;
      }


      submitButton.disabled =
        true;

      submitButton.textContent =
        "Sending...";


      window.setTimeout(
        () => {

          const supportRequest = {

            id:
              `${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 9)}`,

            email,

            category,

            message,

            createdAt:
              new Date().toISOString()

          };


          try {

            const existing =
              JSON.parse(
                localStorage.getItem(
                  "civaSupportRequests"
                ) || "[]"
              );


            const requests =
              Array.isArray(
                existing
              )
                ? existing
                : [];


            requests.push(
              supportRequest
            );


            localStorage.setItem(
              "civaSupportRequests",
              JSON.stringify(
                requests
              )
            );


            status.textContent =
              "Your message has been saved. Secure support submission will be connected with the backend.";


            form.reset();

            updateCharacters();

          } catch {

            status.textContent =
              "Unable to save this message on this device.";

          }


          submitButton.disabled =
            false;

          submitButton.textContent =
            "Send Message";

        },
        600
      );

    }
  );


  updateCharacters();

});