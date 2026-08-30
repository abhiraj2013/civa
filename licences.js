document.addEventListener("DOMContentLoaded", () => {

  const navButton =
    document.getElementById("navButton");

  const navCloseButton =
    document.getElementById("navCloseButton");

  const navMenu =
    document.getElementById("navMenu");

  const navOverlay =
    document.getElementById("navOverlay");


  const openNavigation = () => {

    if (!navMenu) {
      return;
    }

    navMenu.classList.add("open");

    if (navOverlay) {
      navOverlay.classList.add("open");
    }

    navMenu.setAttribute(
      "aria-hidden",
      "false"
    );

    if (navButton) {

      navButton.setAttribute(
        "aria-expanded",
        "true"
      );

    }

    document.body.classList.add(
      "nav-open"
    );

  };


  const closeNavigation = () => {

    if (!navMenu) {
      return;
    }

    navMenu.classList.remove("open");

    if (navOverlay) {
      navOverlay.classList.remove("open");
    }

    navMenu.setAttribute(
      "aria-hidden",
      "true"
    );

    if (navButton) {

      navButton.setAttribute(
        "aria-expanded",
        "false"
      );

    }

    document.body.classList.remove(
      "nav-open"
    );

  };


  if (navButton) {

    navButton.addEventListener(
      "click",
      openNavigation
    );

  }


  if (navCloseButton) {

    navCloseButton.addEventListener(
      "click",
      closeNavigation
    );

  }


  if (navOverlay) {

    navOverlay.addEventListener(
      "click",
      closeNavigation
    );

  }


  document.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "Escape") {

        closeNavigation();

      }

    }
  );


  const navLinks =
    document.querySelectorAll(
      ".civa-nav-link"
    );


  navLinks.forEach((link) => {

    link.addEventListener(
      "click",
      closeNavigation
    );

  });


  const currentPage =
    window.location.pathname
      .split("/")
      .pop()
      .toLowerCase();


  navLinks.forEach((link) => {

    const linkPage =
      link.getAttribute("href");

    if (!linkPage) {
      return;
    }

    if (
      linkPage.toLowerCase() ===
      currentPage
    ) {

      link.classList.add(
        "active"
      );

      link.setAttribute(
        "aria-current",
        "page"
      );

    }

  });


  const images =
    document.querySelectorAll(
      ".license-card img, .license-brand-image img, .license-final-logo img"
    );


  images.forEach((image) => {

    image.addEventListener(
      "error",
      () => {

        image.style.display =
          "none";

      }
    );

  });


  window.addEventListener(
    "resize",
    () => {

      if (
        window.innerWidth > 900
      ) {

        closeNavigation();

      }

    }
  );

});