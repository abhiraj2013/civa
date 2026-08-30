"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("postForm");
  const titleInput = document.getElementById("postTitleInput");
  const categoryInput = document.getElementById("category");
  const descriptionInput = document.getElementById("description");
  const locationInput = document.getElementById("location");
  const imageInput = document.getElementById("postImage");
  const previewImage = document.getElementById("previewImage");
  const publishButton = document.getElementById("publishButton");
  const message = document.getElementById("postMessage");
  const titleCount = document.getElementById("titleCount");
  const descriptionCount = document.getElementById("descriptionCount");

  const MAX_TITLE_LENGTH = 120;
  const MAX_DESCRIPTION_LENGTH = 2000;
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

  const blockedPatterns = [
    /\b(?:fuck|fucking|bitch|bastard|slut|whore)\b/i,
    /\b(?:kill|murder|bomb|burn)\s+(?:him|her|them|you|everyone|people)\b/i,
    /\b(?:i\s+will|we\s+will|going\s+to)\s+(?:kill|hurt|attack|burn)\b/i
  ];

  const civicTerms = [
    "road", "street", "traffic", "bridge", "pothole",
    "water", "drain", "drainage", "sewage", "toilet",
    "electricity", "light", "streetlight", "power",
    "school", "college", "hospital", "clinic",
    "garbage", "waste", "cleanliness", "pollution",
    "environment", "park", "public", "bus", "transport",
    "safety", "sanitation", "government", "service",
    "community", "footpath", "sidewalk", "parking",
    "flood", "flooding", "noise", "education"
  ];

  function getUser() {
    try {
      const saved = localStorage.getItem("civaUserProfile");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  function isLoggedIn() {
    return localStorage.getItem("civaLoggedIn") === "true";
  }

  function showMessage(text, type) {
    if (!message) return;
    message.textContent = text;
    message.className = `post-message show ${type}`;
  }

  function clearMessage() {
    if (!message) return;
    message.textContent = "";
    message.className = "post-message";
  }

  function setError(input, errorId, text) {
    const error = document.getElementById(errorId);
    const field = input?.closest(".form-field");

    if (error) error.textContent = text;

    if (field) {
      field.classList.add("has-error");
      field.classList.remove("has-success");
    }
  }

  function clearError(input, errorId) {
    const error = document.getElementById(errorId);
    const field = input?.closest(".form-field");

    if (error) error.textContent = "";

    if (field) {
      field.classList.remove("has-error");
    }
  }

  function updateCount(input, counter, maximum) {
    if (!input || !counter) return;
    counter.textContent = `${input.value.length}/${maximum}`;
  }

  function cleanText(value) {
    return value
      .replace(/\s+/g, " ")
      .trim();
  }

  function normalizeText(value) {
    return value
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function containsBlockedContent(text) {
    return blockedPatterns.some(pattern => pattern.test(text));
  }

  function containsPrivateInformation(text) {
    const phonePattern = /(?:\+?\d[\d\s-]{8,}\d)/;
    const emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
    const urlPattern = /\b(?:https?:\/\/|www\.)\S+/i;

    return (
      phonePattern.test(text) ||
      emailPattern.test(text) ||
      urlPattern.test(text)
    );
  }

  function hasExcessiveRepetition(text) {
    const words = text
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    if (words.length < 8) return false;

    const counts = {};

    words.forEach(word => {
      counts[ word ] = (counts[ word ] || 0) + 1;
    });

    return Object.values(counts)
      .some(count => count / words.length > 0.45);
  }

  function hasCivicContext(title, description, category) {
    if (category && category !== "other") {
      return true;
    }

    const combined =
      `${title} ${description}`;

    const normalized =
      normalizeText(combined);

    return civicTerms.some(term =>
      normalized.includes(term)
    );
  }

  function validateSafety(title, description, location) {
    const combined =
      `${title} ${description} ${location}`;

    if (containsBlockedContent(combined)) {
      return {
        valid: false,
        message:
          "This content appears to contain abusive or threatening language. Please rewrite it respectfully."
      };
    }

    if (containsPrivateInformation(combined)) {
      return {
        valid: false,
        message:
          "Please remove phone numbers, email addresses, private details or external links."
      };
    }

    if (hasExcessiveRepetition(combined)) {
      return {
        valid: false,
        message:
          "The post appears repetitive or spam-like. Please describe the issue clearly."
      };
    }

    return {
      valid: true,
      message: ""
    };
  }

  function validateForm() {
    let valid = true;

    const title = cleanText(titleInput.value);
    const category = categoryInput.value;
    const description = cleanText(descriptionInput.value);
    const location = cleanText(locationInput.value);

    clearError(titleInput, "postTitleError");
    clearError(categoryInput, "categoryError");
    clearError(descriptionInput, "descriptionError");
    clearError(locationInput, "locationError");

    if (
      title.length < 5 ||
      title.length > MAX_TITLE_LENGTH
    ) {
      setError(
        titleInput,
        "postTitleError",
        "Title must be between 5 and 120 characters."
      );
      valid = false;
    }

    if (!category) {
      setError(
        categoryInput,
        "categoryError",
        "Please select a category."
      );
      valid = false;
    }

    if (
      description.length < 20 ||
      description.length > MAX_DESCRIPTION_LENGTH
    ) {
      setError(
        descriptionInput,
        "descriptionError",
        "Description must be between 20 and 2000 characters."
      );
      valid = false;
    }

    if (location.length > 120) {
      setError(
        locationInput,
        "locationError",
        "Location is too long."
      );
      valid = false;
    }

    const safety =
      validateSafety(
        title,
        description,
        location
      );

    if (!safety.valid) {
      showMessage(
        safety.message,
        "error"
      );
      valid = false;
    }

    if (
      category === "other" &&
      !hasCivicContext(
        title,
        description,
        category
      )
    ) {
      showMessage(
        "This platform is for genuine public and civic issues. Please describe a relevant public problem.",
        "error"
      );
      valid = false;
    }

    return valid;
  }

  if (titleInput) {
    titleInput.addEventListener("input", () => {
      updateCount(
        titleInput,
        titleCount,
        MAX_TITLE_LENGTH
      );

      clearError(
        titleInput,
        "postTitleError"
      );

      clearMessage();
    });
  }

  if (descriptionInput) {
    descriptionInput.addEventListener("input", () => {
      updateCount(
        descriptionInput,
        descriptionCount,
        MAX_DESCRIPTION_LENGTH
      );

      clearError(
        descriptionInput,
        "descriptionError"
      );

      clearMessage();
    });
  }

  if (categoryInput) {
    categoryInput.addEventListener("change", () => {
      clearError(
        categoryInput,
        "categoryError"
      );

      clearMessage();
    });
  }

  if (locationInput) {
    locationInput.addEventListener("input", () => {
      clearError(
        locationInput,
        "locationError"
      );

      clearMessage();
    });
  }

  if (imageInput) {
    imageInput.addEventListener("change", () => {
      const file = imageInput.files?.[ 0 ];

      if (!file) return;

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
      ];

      if (!allowedTypes.includes(file.type)) {
        imageInput.value = "";

        showMessage(
          "Only JPG, PNG and WebP images are allowed.",
          "error"
        );

        return;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        imageInput.value = "";

        showMessage(
          "Image must be 5 MB or smaller.",
          "error"
        );

        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        if (previewImage) {
          previewImage.src = reader.result;
        }
      };

      reader.readAsDataURL(file);
    });
  }

  if (form) {
    form.addEventListener("submit", event => {
      event.preventDefault();

      clearMessage();

      if (!isLoggedIn()) {
        showMessage(
          "Please sign in before creating a post.",
          "error"
        );

        setTimeout(() => {
          window.location.href = "login.html";
        }, 900);

        return;
      }

      const user = getUser();

      if (!user) {
        localStorage.removeItem(
          "civaLoggedIn"
        );

        showMessage(
          "Your account session could not be found. Please sign in again.",
          "error"
        );

        return;
      }

      if (!validateForm()) {
        if (
          !message?.classList.contains(
            "show"
          )
        ) {
          showMessage(
            "Please fix the highlighted fields.",
            "error"
          );
        }

        return;
      }

      const post = {
        id:
          `post_${Date.now()}_${Math.random()
            .toString(36)
            .slice(2, 8)}`,

        title:
          cleanText(
            titleInput.value
          ),

        category:
          categoryInput.value,

        description:
          cleanText(
            descriptionInput.value
          ),

        location:
          cleanText(
            locationInput.value
          ),

        authorEmail:
          typeof user.email === "string"
            ? user.email
            : "",

        authorName:
          typeof user.fullName === "string"
            ? user.fullName
            : "CIVA User",

        createdAt:
          new Date().toISOString(),

        supports: 0,

        comments: 0
      };

      publishButton.disabled = true;
      publishButton.textContent = "Saving...";

      try {
        const existingPosts =
          JSON.parse(
            localStorage.getItem(
              "civaPosts"
            ) || "[]"
          );

        if (!Array.isArray(existingPosts)) {
          throw new Error(
            "Invalid post storage"
          );
        }

        existingPosts.unshift(post);

        localStorage.setItem(
          "civaPosts",
          JSON.stringify(
            existingPosts
          )
        );

        showMessage(
          "Your post has been saved on this device.",
          "success"
        );

        form.reset();

        if (previewImage) {
          previewImage.src =
            "post-placeholder.jpg";
        }

        updateCount(
          titleInput,
          titleCount,
          MAX_TITLE_LENGTH
        );

        updateCount(
          descriptionInput,
          descriptionCount,
          MAX_DESCRIPTION_LENGTH
        );

        setTimeout(() => {
          window.location.href =
            "profile.html";
        }, 900);

      } catch {
        showMessage(
          "The post could not be saved on this device.",
          "error"
        );
      } finally {
        publishButton.disabled = false;
        publishButton.textContent =
          "Publish Post";
      }
    });
  }

  updateCount(
    titleInput,
    titleCount,
    MAX_TITLE_LENGTH
  );

  updateCount(
    descriptionInput,
    descriptionCount,
    MAX_DESCRIPTION_LENGTH
  );
});