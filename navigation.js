"use strict";

document.addEventListener("DOMContentLoaded", function() {

  const button = document.getElementById("navButton");
  const menu = document.getElementById("navMenu");
  const overlay = document.getElementById("navOverlay");
  const closeButton = document.getElementById("navCloseButton");

  if (!button || !menu || !overlay) {
    console.error("CIVA Navigation: Required elements not found.");
    return;
  }

  function openNav() {
    menu.classList.add("active");
    overlay.classList.add("active");
    document.body.classList.add("nav-open");

    button.setAttribute("aria-expanded", "true");
    menu.setAttribute("aria-hidden", "false");
    overlay.setAttribute("aria-hidden", "false");
  }

  function closeNav() {
    menu.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("nav-open");

    button.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-hidden", "true");
    overlay.setAttribute("aria-hidden", "true");
  }

  button.addEventListener("click", function(event) {
    event.preventDefault();
    event.stopPropagation();

    if (menu.classList.contains("active")) {
      closeNav();
    } else {
      openNav();
    }
  });

  if (closeButton) {
    closeButton.addEventListener("click", function(event) {
      event.preventDefault();
      event.stopPropagation();
      closeNav();
    });
  }

  overlay.addEventListener("click", function() {
    closeNav();
  });

  menu.addEventListener("click", function(event) {

    const link = event.target.closest(".civa-nav-link");

    if (!link) {
      return;
    }

    closeNav();
  });

  document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {
      closeNav();
    }

  });

});