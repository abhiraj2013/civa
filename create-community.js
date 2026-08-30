"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const form =
    document.getElementById(
      "createCommunityForm"
    );

  const nameInput =
    document.getElementById(
      "communityName"
    );

  const categoryInput =
    document.getElementById(
      "communityCategory"
    );

  const descriptionInput =
    document.getElementById(
      "communityDescription"
    );

  const locationInput =
    document.getElementById(
      "communityLocation"
    );

  const rulesInput =
    document.getElementById(
      "communityRules"
    );

  const responsibilityInput =
    document.getElementById(
      "responsibilityCheck"
    );

  const nameError =
    document.getElementById(
      "communityNameError"
    );

  const categoryError =
    document.getElementById(
      "communityCategoryError"
    );

  const descriptionError =
    document.getElementById(
      "communityDescriptionError"
    );

  const locationError =
    document.getElementById(
      "communityLocationError"
    );

  const rulesError =
    document.getElementById(
      "communityRulesError"
    );

  const responsibilityError =
    document.getElementById(
      "responsibilityError"
    );

  const nameCount =
    document.getElementById(
      "communityNameCount"
    );

  const descriptionCount =
    document.getElementById(
      "communityDescriptionCount"
    );

  const rulesCount =
    document.getElementById(
      "communityRulesCount"
    );

  const submitButton =
    document.getElementById(
      "createCommunityButton"
    );

  const message =
    document.getElementById(
      "createCommunityMessage"
    );


  if (
    !form ||
    !nameInput ||
    !categoryInput ||
    !descriptionInput ||
    !locationInput ||
    !rulesInput ||
    !responsibilityInput ||
    !submitButton ||
    !message
  ) {
    return;
  }


  function getUser() {

    try {

      const saved =
        localStorage.getItem(
          "civaUserProfile"
        );

      return saved
        ? JSON.parse(saved)
        : null;

    } catch {

      return null;

    }

  }


  function isLoggedIn() {

    return (
      localStorage.getItem(
        "civaLoggedIn"
      ) === "true"
    );

  }


  function getCommunities() {

    try {

      const saved =
        localStorage.getItem(
          "civaCommunities"
        );

      const parsed =
        saved
          ? JSON.parse(saved)
          : [];

      return Array.isArray(parsed)
        ? parsed
        : [];

    } catch {

      return [];

    }

  }


  function saveCommunities(
    communities
  ) {

    try {

      localStorage.setItem(
        "civaCommunities",
        JSON.stringify(
          communities
        )
      );

      return true;

    } catch {

      return false;

    }

  }


  function getCurrentYear() {

    return new Date()
      .getFullYear();

  }


  function getCommunityYear(
    community
  ) {

    const date =
      new Date(
        community.createdAt
      );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return null;
    }

    return date.getFullYear();

  }


  function getUserIdentifier(
    user
  ) {

    if (!user) {
      return "";
    }

    return String(
      user.id ||
      user.email ||
      user.uid ||
      ""
    )
      .trim()
      .toLowerCase();

  }


  function normalizeText(
    value
  ) {

    return String(
      value || ""
    )
      .trim()
      .replace(
        /\s+/g,
        " "
      );

  }


  function updateCount(
    input,
    output,
    max
  ) {

    output.textContent =
      `${input.value.length}/${max}`;

  }


  function clearErrors() {

    [
      nameError,
      categoryError,
      descriptionError,
      locationError,
      rulesError,
      responsibilityError
    ].forEach(
      element => {

        if (element) {
          element.textContent = "";
        }

      }
    );


    [
      nameInput,
      categoryInput,
      descriptionInput,
      locationInput,
      rulesInput
    ].forEach(
      element => {

        element.classList.remove(
          "invalid"
        );

        element.removeAttribute(
          "aria-invalid"
        );

      }
    );

  }


  function setInvalid(
    input,
    error,
    text
  ) {

    input.classList.add(
      "invalid"
    );

    input.setAttribute(
      "aria-invalid",
      "true"
    );

    error.textContent =
      text;

  }


  function countCreatedCommunities(
    communities,
    user
  ) {

    const identifier =
      getUserIdentifier(
        user
      );

    if (!identifier) {
      return 0;
    }


    const year =
      getCurrentYear();


    return communities.filter(
      community => {

        const owner =
          String(
            community.creatorId ||
            community.leaderId ||
            ""
          )
            .trim()
            .toLowerCase();

        return (
          owner === identifier &&
          getCommunityYear(
            community
          ) === year
        );

      }
    ).length;

  }


  function updateCounters() {

    updateCount(
      nameInput,
      nameCount,
      80
    );

    updateCount(
      descriptionInput,
      descriptionCount,
      500
    );

    updateCount(
      rulesInput,
      rulesCount,
      600
    );

  }


  nameInput.addEventListener(
    "input",
    () => {

      nameError.textContent = "";

      nameInput.classList.remove(
        "invalid"
      );

      message.textContent = "";

      updateCounters();

    }
  );


  categoryInput.addEventListener(
    "change",
    () => {

      categoryError.textContent = "";

      categoryInput.classList.remove(
        "invalid"
      );

      message.textContent = "";

    }
  );


  descriptionInput.addEventListener(
    "input",
    () => {

      descriptionError.textContent = "";

      descriptionInput.classList.remove(
        "invalid"
      );

      message.textContent = "";

      updateCounters();

    }
  );


  locationInput.addEventListener(
    "input",
    () => {

      locationError.textContent = "";

      locationInput.classList.remove(
        "invalid"
      );

      message.textContent = "";

    }
  );


  rulesInput.addEventListener(
    "input",
    () => {

      rulesError.textContent = "";

      rulesInput.classList.remove(
        "invalid"
      );

      message.textContent = "";

      updateCounters();

    }
  );


  responsibilityInput.addEventListener(
    "change",
    () => {

      responsibilityError.textContent = "";

      message.textContent = "";

    }
  );


  form.addEventListener(
    "submit",
    event => {

      event.preventDefault();

      clearErrors();

      message.textContent = "";


      const user =
        getUser();


      if (!isLoggedIn()) {

        message.textContent =
          "Please sign in before creating a community.";

        window.setTimeout(
          () => {
            window.location.href =
              "login.html";
          },
          700
        );

        return;

      }


      const name =
        normalizeText(
          nameInput.value
        );

      const category =
        categoryInput.value;

      const description =
        normalizeText(
          descriptionInput.value
        );

      const location =
        normalizeText(
          locationInput.value
        );

      const rules =
        normalizeText(
          rulesInput.value
        );


      let valid = true;


      if (!name) {

        setInvalid(
          nameInput,
          nameError,
          "Please enter a community name."
        );

        valid = false;

      } else if (
        name.length < 3
      ) {

        setInvalid(
          nameInput,
          nameError,
          "Community name must be at least 3 characters."
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


      if (!description) {

        setInvalid(
          descriptionInput,
          descriptionError,
          "Please describe the community."
        );

        valid = false;

      } else if (
        description.length < 20
      ) {

        setInvalid(
          descriptionInput,
          descriptionError,
          "Description must be at least 20 characters."
        );

        valid = false;

      }


      if (
        location.length > 120
      ) {

        setInvalid(
          locationInput,
          locationError,
          "Location is too long."
        );

        valid = false;

      }


      if (!rules) {

        setInvalid(
          rulesInput,
          rulesError,
          "Please add basic community rules."
        );

        valid = false;

      } else if (
        rules.length < 10
      ) {

        setInvalid(
          rulesInput,
          rulesError,
          "Please provide meaningful community rules."
        );

        valid = false;

      }


      if (
        !responsibilityInput.checked
      ) {

        responsibilityError.textContent =
          "Please confirm your responsibility.";

        valid = false;

      }


      if (!valid) {
        return;
      }


      const communities =
        getCommunities();


      const currentCount =
        countCreatedCommunities(
          communities,
          user
        );


      if (
        currentCount >= 10
      ) {

        message.textContent =
          "You have reached the 10-community limit for this year.";

        return;

      }


      const userId =
        getUserIdentifier(
          user
        );


      if (!userId) {

        message.textContent =
          "Your account information is incomplete.";

        return;

      }


      submitButton.disabled =
        true;

      submitButton.textContent =
        "Creating...";


      const community = {

        id:
          `community-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 9)}`,

        name,

        category,

        description,

        location,

        rules,

        creatorId:
          userId,

        creatorName:
          user.name ||
          user.fullName ||
          "CIVA Leader",

        creatorImage:
          user.profileImage ||
          "profile-placeholder.jpg",

        members: 1,

        posts: 0,

        createdAt:
          new Date().toISOString()

      };


      communities.push(
        community
      );


      if (
        !saveCommunities(
          communities
        )
      ) {

        submitButton.disabled =
          false;

        submitButton.textContent =
          "Create Community";

        message.textContent =
          "Could not save the community on this device.";

        return;

      }


      message.textContent =
        "Community created successfully.";


      window.setTimeout(
        () => {

          window.location.href =
            `community-detail.html?id=${encodeURIComponent(
              community.id
            )}`;

        },
        600
      );

    }
  );


  updateCounters();

});