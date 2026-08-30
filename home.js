"use strict";

document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     NAVIGATION
  ========================= */

  const navButton =
    document.getElementById("navButton");

  const navCloseButton =
    document.getElementById("navCloseButton");

  const navMenu =
    document.getElementById("navMenu");

  const navOverlay =
    document.getElementById("navOverlay");


  function openNavigation() {

    if (!navMenu || !navOverlay) {
      return;
    }

    navMenu.classList.add("active");
    navOverlay.classList.add("active");

    navMenu.setAttribute(
      "aria-hidden",
      "false"
    );

    navOverlay.setAttribute(
      "aria-hidden",
      "false"
    );

    if (navButton) {

      navButton.setAttribute(
        "aria-expanded",
        "true"
      );

      navButton.setAttribute(
        "aria-label",
        "Close navigation"
      );

    }

    document.body.classList.add(
      "nav-open"
    );

  }


  function closeNavigation() {

    if (!navMenu || !navOverlay) {
      return;
    }

    navMenu.classList.remove("active");
    navOverlay.classList.remove("active");

    navMenu.setAttribute(
      "aria-hidden",
      "true"
    );

    navOverlay.setAttribute(
      "aria-hidden",
      "true"
    );

    if (navButton) {

      navButton.setAttribute(
        "aria-expanded",
        "false"
      );

      navButton.setAttribute(
        "aria-label",
        "Open navigation"
      );

    }

    document.body.classList.remove(
      "nav-open"
    );

  }


  if (navButton) {

    navButton.addEventListener(
      "click",
      () => {

        if (
          navMenu &&
          navMenu.classList.contains("active")
        ) {

          closeNavigation();

        } else {

          openNavigation();

        }

      }
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


  if (navMenu) {

    navMenu
      .querySelectorAll(".civa-nav-link")
      .forEach((link) => {

        link.addEventListener(
          "click",
          closeNavigation
        );

      });

  }


  /* =========================
     FEED TABS
  ========================= */

  const latestTab =
    document.getElementById("latestTab");

  const trendingTab =
    document.getElementById("trendingTab");

  const latestPosts =
    document.getElementById("latestPosts");

  const trendingPosts =
    document.getElementById("trendingPosts");


  function showFeed(feed) {

    const showLatest =
      feed === "latest";


    if (latestTab) {

      latestTab.classList.toggle(
        "active",
        showLatest
      );

      latestTab.setAttribute(
        "aria-selected",
        String(showLatest)
      );

    }


    if (trendingTab) {

      trendingTab.classList.toggle(
        "active",
        !showLatest
      );

      trendingTab.setAttribute(
        "aria-selected",
        String(!showLatest)
      );

    }


    if (latestPosts) {

      latestPosts.hidden =
        !showLatest;

    }


    if (trendingPosts) {

      trendingPosts.hidden =
        showLatest;

    }

  }


  if (latestTab) {

    latestTab.addEventListener(
      "click",
      () => showFeed("latest")
    );

  }


  if (trendingTab) {

    trendingTab.addEventListener(
      "click",
      () => showFeed("trending")
    );

  }


  /* =========================
     SEARCH
  ========================= */

  const globalSearch =
    document.getElementById("globalSearch");

  const searchSuggestions =
    document.getElementById(
      "searchSuggestions"
    );


  function closeSuggestions() {

    if (!searchSuggestions) {
      return;
    }

    searchSuggestions.hidden = true;
    searchSuggestions.innerHTML = "";

  }


  function createSuggestion(
    text,
    type
  ) {

    const button =
      document.createElement("button");

    button.type = "button";
    button.className =
      "search-suggestion";


    const icon =
      document.createElement("span");

    icon.className =
      "search-suggestion-icon";

    icon.setAttribute(
      "aria-hidden",
      "true"
    );


    if (type === "topic") {

      icon.textContent = "#";

    } else if (type === "creator") {

      icon.textContent = "@";

    } else {

      icon.textContent = "⌕";

    }


    const label =
      document.createElement("span");

    label.textContent = text;


    button.appendChild(icon);
    button.appendChild(label);


    button.addEventListener(
      "click",
      () => {

        if (globalSearch) {

          globalSearch.value =
            text;

          globalSearch.focus();

        }

        closeSuggestions();

      }
    );


    return button;

  }


  function showSuggestions(value) {

    if (!searchSuggestions) {
      return;
    }


    const query =
      String(value || "")
        .trim();


    if (!query) {

      closeSuggestions();
      return;

    }


    searchSuggestions.innerHTML = "";


    const suggestions = [

      {
        text: query,
        type: "search"
      },

      {
        text:
          `${query} public problems`,
        type: "topic"
      },

      {
        text:
          `${query} creators`,
        type: "creator"
      }

    ];


    suggestions.forEach(
      (suggestion) => {

        searchSuggestions.appendChild(
          createSuggestion(
            suggestion.text,
            suggestion.type
          )
        );

      }
    );


    searchSuggestions.hidden = false;

  }


  if (globalSearch) {

    globalSearch.addEventListener(
      "input",
      () => {

        showSuggestions(
          globalSearch.value
        );

      }
    );


    globalSearch.addEventListener(
      "focus",
      () => {

        if (
          globalSearch.value.trim()
        ) {

          showSuggestions(
            globalSearch.value
          );

        }

      }
    );


    globalSearch.addEventListener(
      "keydown",
      (event) => {

        if (
          event.key === "Enter"
        ) {

          event.preventDefault();


          const query =
            globalSearch.value.trim();


          if (!query) {
            return;
          }


          closeSuggestions();


          window.dispatchEvent(
            new CustomEvent(
              "civa:search",
              {
                detail: {
                  query
                }
              }
            )
          );

        }


        if (
          event.key === "Escape"
        ) {

          closeSuggestions();
          globalSearch.blur();

        }

      }
    );

  }


  document.addEventListener(
    "click",
    (event) => {

      if (
        !globalSearch ||
        !searchSuggestions
      ) {

        return;

      }


      const searchSection =
        globalSearch.closest(
          ".home-search-section"
        );


      if (
        searchSection &&
        !searchSection.contains(
          event.target
        )
      ) {

        closeSuggestions();

      }

    }
  );


  /* =========================
     SUPPORT
  ========================= */

  function updateUserSupportCount(
    change
  ) {

    const key =
      "civa-support-count";


    let count =
      Number(
        localStorage.getItem(key)
      ) || 0;


    count =
      Math.max(
        0,
        count + change
      );


    localStorage.setItem(
      key,
      String(count)
    );

  }


  function setupSupportButton(
    button
  ) {

    button.addEventListener(
      "click",
      () => {

        const alreadySupported =
          button.getAttribute(
            "aria-pressed"
          ) === "true";


        const supported =
          !alreadySupported;


        const countElement =
          button.querySelector(
            ".support-count"
          );


        const icon =
          button.querySelector("svg");


        let count =
          Number.parseInt(
            countElement
              ? countElement.textContent
              : "0",
            10
          );


        if (!Number.isFinite(count)) {
          count = 0;
        }


        const newCount =
          supported
            ? count + 1
            : Math.max(0, count - 1);


        updateUserSupportCount(
          supported ? 1 : -1
        );


        button.setAttribute(
          "aria-pressed",
          String(supported)
        );


        button.classList.toggle(
          "supported",
          supported
        );


        if (countElement) {

          countElement.textContent =
            String(newCount);

        }


        if (icon) {

          icon.setAttribute(
            "fill",
            supported
              ? "currentColor"
              : "none"
          );

        }

      }
    );

  }


  document
    .querySelectorAll(".support-button")
    .forEach(setupSupportButton);


  /* =========================
     SHARE
  ========================= */

  async function sharePost(button) {

    const postCard =
      button.closest(".post-card");


    if (!postCard) {
      return;
    }


    const title =
      postCard
        .querySelector(".post-title")
        ?.textContent
        ?.trim() ||
      "CIVA Public Problem";


    const postLink =
      postCard.querySelector(
        "a[href]"
      );


    const url =
      postLink?.href ||
      window.location.href;


    const shareData = {

      title: "CIVA",

      text: title,

      url

    };


    if (
      navigator.share &&
      typeof navigator.share === "function"
    ) {

      try {

        await navigator.share(
          shareData
        );

        return;

      } catch (error) {

        if (
          error?.name ===
          "AbortError"
        ) {

          return;

        }

      }

    }


    try {

      await navigator.clipboard.writeText(
        url
      );


      const textElement =
        button.querySelector(
          "span:last-child"
        );


      const oldText =
        textElement
          ? textElement.textContent
          : "Share";


      if (textElement) {

        textElement.textContent =
          "Copied";

      }


      button.classList.add(
        "copied"
      );


      window.setTimeout(
        () => {

          if (textElement) {

            textElement.textContent =
              oldText;

          }

          button.classList.remove(
            "copied"
          );

        },
        1600
      );


    } catch {

      window.prompt(
        "Copy this CIVA link:",
        url
      );

    }

  }


  document
    .querySelectorAll(".share-button")
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => sharePost(button)
      );

    });


  /* =========================
     REFRESH BUTTONS
  ========================= */

  function refreshFeed(button) {

    if (!button) {
      return;
    }


    button.disabled = true;

    button.classList.add(
      "is-refreshing"
    );


    window.setTimeout(
      () => {

        button.disabled = false;

        button.classList.remove(
          "is-refreshing"
        );

      },
      700
    );

  }


  const latestRefreshButton =
    document.getElementById(
      "latestRefreshButton"
    );

  const trendingRefreshButton =
    document.getElementById(
      "trendingRefreshButton"
    );


  if (latestRefreshButton) {

    latestRefreshButton.addEventListener(
      "click",
      () => {

        refreshFeed(
          latestRefreshButton
        );

      }
    );

  }


  if (trendingRefreshButton) {

    trendingRefreshButton.addEventListener(
      "click",
      () => {

        refreshFeed(
          trendingRefreshButton
        );

      }
    );

  }


  /* =========================
     HTML ESCAPE
  ========================= */

  function escapeHTML(value) {

    return String(value ?? "")
      .replace(
        /&/g,
        "&amp;"
      )
      .replace(
        /</g,
        "&lt;"
      )
      .replace(
        />/g,
        "&gt;"
      )
      .replace(
        /"/g,
        "&quot;"
      )
      .replace(
        /'/g,
        "&#039;"
      );

  }


  /* =========================
     KEYBOARD
  ========================= */

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape"
      ) {

        closeNavigation();

        closeSuggestions();

      }

    }
  );


  /* =========================
     PART 2 CONTINUES
  =========================
     
     3-dot menu
     Report
     Saved posts
     Comments
     Initial feed
  */
  /* =========================
   POST MENUS
========================= */

  let activePostMenu = null;


  function closeAllPostMenus() {

    document
      .querySelectorAll(".post-options-menu")
      .forEach((menu) => {
        menu.remove();
      });


    document
      .querySelectorAll(".post-menu-button")
      .forEach((button) => {

        button.setAttribute(
          "aria-expanded",
          "false"
        );

      });


    activePostMenu = null;

  }


  async function copyPostLink(
    postCard,
    option
  ) {

    const link =
      postCard.querySelector(
        "a[href]"
      )?.href ||
      window.location.href;


    try {

      await navigator.clipboard.writeText(
        link
      );


      const text =
        option.querySelector("span");


      if (text) {

        const oldText =
          text.textContent;

        text.textContent =
          "Copied";


        window.setTimeout(
          () => {

            text.textContent =
              oldText;

          },
          900
        );

      }


    } catch {

      window.prompt(
        "Copy this CIVA link:",
        link
      );

    }

  }


  function reportPost(
    postCard,
    option
  ) {

    const reportModal =
      document.getElementById(
        "reportModal"
      );


    const reportReason =
      document.getElementById(
        "reportReason"
      );


    const reportError =
      document.getElementById(
        "reportError"
      );


    if (!reportModal) {
      return;
    }


    let postId =
      postCard.dataset.postId ||
      postCard.dataset.id ||
      postCard.id;


    if (!postId) {

      postId =
        `post-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`;


      postCard.dataset.postId =
        postId;

    }


    reportModal.dataset.postId =
      postId;


    reportModal._reportOption =
      option;


    if (reportReason) {

      reportReason.value = "";

    }


    if (reportError) {

      reportError.textContent =
        "";

      reportError.hidden =
        true;

    }


    reportModal.hidden =
      false;


    reportModal.setAttribute(
      "aria-hidden",
      "false"
    );


    if (reportReason) {

      window.setTimeout(
        () => reportReason.focus(),
        50
      );

    }

  }


  function closeReportModal() {

    const reportModal =
      document.getElementById(
        "reportModal"
      );


    if (!reportModal) {
      return;
    }


    reportModal.hidden =
      true;


    reportModal.setAttribute(
      "aria-hidden",
      "true"
    );

  }


  function submitPostReport() {

    const reportModal =
      document.getElementById(
        "reportModal"
      );


    const reportReason =
      document.getElementById(
        "reportReason"
      );


    const reportError =
      document.getElementById(
        "reportError"
      );


    if (
      !reportModal ||
      !reportReason
    ) {

      return;

    }


    const reason =
      reportReason.value.trim();


    if (!reason) {

      if (reportError) {

        reportError.textContent =
          "Please write a reason before submitting.";

        reportError.hidden =
          false;

      }


      reportReason.focus();

      return;

    }


    const postId =
      reportModal.dataset.postId;


    if (!postId) {

      closeReportModal();

      return;

    }


    let reports = {};


    try {

      reports =
        JSON.parse(
          localStorage.getItem(
            "civaPostReports"
          ) || "{}"
        );


      if (
        !reports ||
        typeof reports !== "object"
      ) {

        reports = {};

      }

    } catch {

      reports = {};

    }


    if (!Array.isArray(reports[ postId ])) {

      reports[ postId ] = [];

    }


    const alreadyReported =
      reports[ postId ].some(
        (report) =>
          report.browserReported === true
      );


    if (!alreadyReported) {

      reports[ postId ].push({

        reason:
          reason.slice(0, 500),

        reportedAt:
          new Date().toISOString(),

        browserReported:
          true

      });

    }


    try {

      localStorage.setItem(
        "civaPostReports",
        JSON.stringify(reports)
      );

    } catch {

      closeReportModal();

      return;

    }


    const reportOption =
      reportModal._reportOption;


    if (reportOption) {

      const text =
        reportOption.querySelector(
          "span"
        );


      if (text) {

        text.textContent =
          "Reported";

      }

    }


    const postCard =
      document.querySelector(
        `[data-post-id="${CSS.escape(postId)}"]`
      );


    if (postCard) {

      window.dispatchEvent(
        new CustomEvent(
          "civa:report",
          {
            detail: {
              post: postCard,
              reason
            }
          }
        )
      );

    }


    closeReportModal();

  }


  function setupReportModal() {

    const closeButton =
      document.getElementById(
        "reportCloseButton"
      );


    const cancelButton =
      document.getElementById(
        "reportCancelButton"
      );


    const submitButton =
      document.getElementById(
        "reportSubmitButton"
      );


    const reportModal =
      document.getElementById(
        "reportModal"
      );


    if (closeButton) {

      closeButton.addEventListener(
        "click",
        closeReportModal
      );

    }


    if (cancelButton) {

      cancelButton.addEventListener(
        "click",
        closeReportModal
      );

    }


    if (submitButton) {

      submitButton.addEventListener(
        "click",
        submitPostReport
      );

    }


    if (reportModal) {

      reportModal.addEventListener(
        "click",
        (event) => {

          if (
            event.target ===
            reportModal
          ) {

            closeReportModal();

          }

        }
      );

    }

  }


  function createPostMenu(button) {

    const postCard =
      button.closest(
        ".post-card"
      );


    if (!postCard) {
      return;
    }


    closeAllPostMenus();


    const menu =
      document.createElement(
        "div"
      );


    menu.className =
      "post-options-menu";


    const shareOption =
      document.createElement(
        "button"
      );


    shareOption.type =
      "button";

    shareOption.className =
      "post-option";

    shareOption.innerHTML =
      "<span>Share</span>";


    const copyOption =
      document.createElement(
        "button"
      );


    copyOption.type =
      "button";

    copyOption.className =
      "post-option";

    copyOption.innerHTML =
      "<span>Copy link</span>";


    const reportOption =
      document.createElement(
        "button"
      );


    reportOption.type =
      "button";

    reportOption.className =
      "post-option report-option";

    reportOption.innerHTML =
      "<span>Report</span>";


    menu.appendChild(
      shareOption
    );

    menu.appendChild(
      copyOption
    );

    menu.appendChild(
      reportOption
    );


    postCard.appendChild(
      menu
    );


    button.setAttribute(
      "aria-expanded",
      "true"
    );


    activePostMenu =
      menu;


    shareOption.addEventListener(
      "click",
      () => {

        const shareButton =
          postCard.querySelector(
            ".share-button"
          );


        if (shareButton) {

          sharePost(
            shareButton
          );

        }


        window.setTimeout(
          closeAllPostMenus,
          300
        );

      }
    );


    copyOption.addEventListener(
      "click",
      async () => {

        await copyPostLink(
          postCard,
          copyOption
        );


        window.setTimeout(
          closeAllPostMenus,
          700
        );

      }
    );


    reportOption.addEventListener(
      "click",
      () => {

        reportPost(
          postCard,
          reportOption
        );


        window.setTimeout(
          closeAllPostMenus,
          900
        );

      }
    );

  }


  document
    .querySelectorAll(
      ".post-menu-button"
    )
    .forEach((button) => {

      button.setAttribute(
        "aria-expanded",
        "false"
      );


      button.addEventListener(
        "click",
        (event) => {

          event.preventDefault();

          event.stopPropagation();


          const postCard =
            button.closest(
              ".post-card"
            );


          const existingMenu =
            postCard?.querySelector(
              ".post-options-menu"
            );


          if (existingMenu) {

            closeAllPostMenus();

            return;

          }


          createPostMenu(
            button
          );

        }
      );

    });


  /* =========================
     CLOSE POST MENU
  ========================= */

  document.addEventListener(
    "click",
    (event) => {

      if (
        activePostMenu &&
        !activePostMenu.contains(
          event.target
        )
      ) {

        closeAllPostMenus();

      }

    }
  );


  /* =========================
     REPORT MODAL
  ========================= */

  setupReportModal();


  /* =========================
     LOAD SAVED POSTS
  ========================= */



  function loadSavedPostsToHome() {

    const latestPosts =
      document.getElementById("latestPostsList");

    if (!latestPosts) {
      return;
    }

    let savedPosts = [];

    try {

      const saved =
        localStorage.getItem("civaPosts");

      savedPosts =
        saved ? JSON.parse(saved) : [];

      if (!Array.isArray(savedPosts)) {
        savedPosts = [];
      }

    } catch {

      savedPosts = [];

    }


    savedPosts.forEach((post) => {

      if (!post || !post.id) {
        return;
      }


      /*
       * Duplicate post check
       */

      const existingPost =
        latestPosts.querySelector(
          `[data-post-id="${CSS.escape(String(post.id))}"]`
        );

      if (existingPost) {
        return;
      }


      /*
       * Main card
       */

      const card =
        document.createElement("article");

      card.className =
        "post-card";
      card.dataset.dynamicPost = "true";


      card.dataset.postId =
        String(post.id);


      /*
       * Header
       */

      const header =
        document.createElement("div");

      header.className =
        "post-header";


      const author =
        document.createElement("div");

      author.className =
        "post-author";


      const avatar =
        document.createElement("img");

      avatar.className =
        "avatar";

      avatar.width = 42;
      avatar.height = 42;

      avatar.loading = "lazy";

      avatar.alt = "";

      avatar.src =
        post.authorImage ||
        post.profileImage ||
        "profile-placeholder.jpg";


      const authorInfo =
        document.createElement("div");

      authorInfo.className =
        "post-author-info";


      const authorName =
        document.createElement("p");

      authorName.className =
        "post-author-name";

      authorName.textContent =
        post.authorName ||
        "CIVA User";


      const meta =
        document.createElement("p");

      meta.className =
        "post-meta";

      meta.textContent =
        `${post.category || "Public Issue"} · Recently`;


      authorInfo.appendChild(authorName);
      authorInfo.appendChild(meta);

      author.appendChild(avatar);
      author.appendChild(authorInfo);


      /*
       * Three dots
       */

      const menuButton =
        document.createElement("button");

      menuButton.type =
        "button";

      menuButton.className =
        "icon-button post-menu-button";

      menuButton.setAttribute(
        "aria-label",
        "Post options"
      );

      menuButton.setAttribute(
        "aria-expanded",
        "false"
      );

      menuButton.innerHTML = `
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <circle cx="5" cy="12" r="1.5"></circle>
        <circle cx="12" cy="12" r="1.5"></circle>
        <circle cx="19" cy="12" r="1.5"></circle>
      </svg>
    `;


      header.appendChild(author);
      header.appendChild(menuButton);


      /*
       * Title
       */

      const title =
        document.createElement("h3");

      title.className =
        "post-title";

      title.textContent =
        post.title ||
        "CIVA Public Problem";


      /*
       * Description
       */

      const description =
        document.createElement("p");

      description.className =
        "post-text";

      description.textContent =
        post.description ||
        "";


      /*
       * Image
       *
       * User image nahi ho to
       * post-placeholder.jpg show hoga.
       */

      const image =
        document.createElement("img");

      image.className =
        "post-image";

      image.width = 760;
      image.height = 430;

      image.loading = "lazy";

      image.alt =
        post.title ||
        "CIVA public problem";


      image.src =
        post.image ||
        post.imageUrl ||
        post.photo ||
        post.photoUrl ||
        "post-placeholder.jpg";


      /*
       * Actions
       */

      const actions =
        document.createElement("div");

      actions.className =
        "post-actions";


      /*
       * Support
       */

      const supportButton =
        document.createElement("button");

      supportButton.type =
        "button";

      supportButton.className =
        "post-action support-button";

      supportButton.setAttribute(
        "aria-label",
        "Support this post"
      );

      supportButton.setAttribute(
        "aria-pressed",
        "false"
      );

      supportButton.innerHTML = `
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.9"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path
          d="M20.8 8.7c0 5.5-8.8 10.3-8.8 10.3S3.2 14.2 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5z"
        ></path>
      </svg>

      <span>Support</span>

      <span class="support-count">
        ${Number(post.supports) || 0}
      </span>
    `;


      /*
       * Comments
       */

      const commentsLink =
        document.createElement("a");

      commentsLink.className =
        "post-action";

      commentsLink.href =
        `comments.html?id=${encodeURIComponent(post.id)}`;

      commentsLink.setAttribute(
        "aria-label",
        "Open comments"
      );

      commentsLink.innerHTML = `
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.9"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path
          d="M20 11.5a7.5 7.5 0 0 1-7.8 7.5H8l-4 2v-5.1A7.4 7.4 0 0 1 4 11.5 8 8 0 0 1 12 4a8 8 0 0 1 8 7.5z"
        ></path>
      </svg>

      <span>Comments</span>
    `;


      /*
       * Share
       */

      const shareButton =
        document.createElement("button");

      shareButton.type =
        "button";

      shareButton.className =
        "post-action share-button";

      shareButton.setAttribute(
        "aria-label",
        "Share post"
      );

      shareButton.innerHTML = `
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.9"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle cx="18" cy="5" r="2.5"></circle>
        <circle cx="6" cy="12" r="2.5"></circle>
        <circle cx="18" cy="19" r="2.5"></circle>

        <path d="M8.2 10.8l7.5-4.2"></path>
        <path d="M8.2 13.2l7.5 4.2"></path>
      </svg>

      <span>Share</span>
    `;


      /*
       * Put actions together
       */

      actions.appendChild(
        supportButton
      );

      actions.appendChild(
        commentsLink
      );

      actions.appendChild(
        shareButton
      );


      /*
       * Build complete card
       */

      card.appendChild(header);

      card.appendChild(title);

      card.appendChild(description);

      card.appendChild(image);

      card.appendChild(actions);


      /*
       * Add newest post at top
       */

      latestPosts.prepend(card);

      const dynamicSupportButton =
        card.querySelector(".support-button");

      if (dynamicSupportButton) {

        dynamicSupportButton.addEventListener(
          "click",
          () => {

            const alreadySupported =
              dynamicSupportButton.getAttribute(
                "aria-pressed"
              ) === "true";

            const count =
              dynamicSupportButton.querySelector(
                ".support-count"
              );

            let currentCount =
              Number.parseInt(
                count?.textContent || "0",
                10
              );

            if (!Number.isFinite(currentCount)) {
              currentCount = 0;
            }

            const supported =
              !alreadySupported;

            const newCount =
              supported
                ? currentCount + 1
                : Math.max(0, currentCount - 1);

            dynamicSupportButton.setAttribute(
              "aria-pressed",
              String(supported)
            );

            dynamicSupportButton.classList.toggle(
              "supported",
              supported
            );

            if (count) {
              count.textContent =
                String(newCount);
            }

            updateCIVAUserSupportCount(
              supported ? 1 : -1
            );

          }
        );

      }


      const dynamicShareButton =
        card.querySelector(".share-button");

      if (dynamicShareButton) {

        dynamicShareButton.addEventListener(
          "click",
          () => {
            sharePost(dynamicShareButton);
          }
        );

      }


      const dynamicMenuButton =
        card.querySelector(".post-menu-button");

      if (dynamicMenuButton) {

        dynamicMenuButton.addEventListener(
          "click",
          (event) => {

            event.stopPropagation();

            const existingMenu =
              card.querySelector(
                ".post-options-menu"
              );

            if (existingMenu) {

              closeAllPostMenus();
              return;

            }

            createPostMenu(
              dynamicMenuButton
            );

          }
        );

      }


      /*
       * Support button connection
       *
       * Existing home.js support
       * system ko manually trigger karenge.
       */

      supportButton.addEventListener(
        "click",
        () => {

          const event =
            new MouseEvent("click", {
              bubbles: true
            });

          /*
           * Existing delegated support
           * system ho to use karega.
           */

        }
      );


      /*
       * Share button
       *
       * Existing sharePost function
       * available ho to use karega.
       */

      shareButton.addEventListener(
        "click",
        () => {

          if (
            typeof sharePost ===
            "function"
          ) {

            sharePost(
              shareButton
            );

          }

        }
      );


      /*
       * Image fallback
       */

      image.addEventListener(
        "error",
        () => {

          if (
            image.src.endsWith(
              "post-placeholder.jpg"
            )
          ) {
            return;
          }

          image.src =
            "post-placeholder.jpg";

        }
      );

    });

  }


  /* =========================
     INITIALIZE
  ========================= */

  loadSavedPostsToHome();

  showFeed("latest");


  /* =========================
     ESCAPE KEY
  ========================= */

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape"
      ) {

        closeNavigation();

        closeSuggestions();

        closeAllPostMenus();

        closeReportModal();

      }

    }
  );

});