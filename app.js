"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const HOME_PAGE = "home.html";
  const REDIRECT_DELAY = 1600;

  const openHome = () => {
    window.location.replace(HOME_PAGE);
  };

  window.setTimeout(
    openHome,
    REDIRECT_DELAY
  );

});