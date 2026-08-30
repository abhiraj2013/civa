"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const postsList =
    document.getElementById("postsList");

  const emptyState =
    document.getElementById("emptyState");

  const noPostsState =
    document.getElementById("noPostsState");

  const postCount =
    document.getElementById("postCount");

  const searchInput =
    document.getElementById("postSearch");

  const clearSearch =
    document.getElementById("clearSearch");

  const categoryFilter =
    document.getElementById("categoryFilter");

  const sortPosts =
    document.getElementById("sortPosts");

  const resetFilters =
    document.getElementById("resetFilters");

  const template =
    document.getElementById("postCardTemplate");

  const headerProfileImage =
    document.getElementById("headerProfileImage");


  let posts = [];


  const categoryNames = {
    roads: "Roads & Traffic",
    water: "Water & Drainage",
    electricity: "Electricity",
    education: "Education",
    environment: "Environment",
    health: "Health",
    transport: "Transport",
    "public-facilities": "Public Facilities",
    other: "Other"
  };


  function loadPosts() {

    try {

      const saved =
        localStorage.getItem("civaPosts");

      if (!saved) {
        posts = [];
        return;
      }

      const parsed =
        JSON.parse(saved);

      posts =
        Array.isArray(parsed)
          ? parsed
          : [];

    } catch {

      posts = [];

    }

  }


  function savePosts() {

    try {

      localStorage.setItem(
        "civaPosts",
        JSON.stringify(posts)
      );

      return true;

    } catch {

      return false;

    }

  }


  function getCurrentUser() {

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


  function updateProfileImage() {

    if (!headerProfileImage) {
      return;
    }

    const user =
      getCurrentUser();

    if (
      user &&
      typeof user.profileImage === "string" &&
      user.profileImage.trim()
    ) {

      headerProfileImage.src =
        user.profileImage;

    }

  }


  function escapeHTML(value) {

    const div =
      document.createElement("div");

    div.textContent =
      String(value ?? "");

    return div.innerHTML;

  }


  function formatDate(dateValue) {

    const date =
      new Date(dateValue);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return "Recently";

    }


    const now =
      new Date();

    const seconds =
      Math.floor(
        (now - date) / 1000
      );


    if (seconds < 60) {
      return "Just now";
    }

    if (seconds < 3600) {
      const minutes =
        Math.floor(seconds / 60);

      return `${minutes}m ago`;
    }

    if (seconds < 86400) {
      const hours =
        Math.floor(seconds / 3600);

      return `${hours}h ago`;
    }

    if (seconds < 604800) {
      const days =
        Math.floor(seconds / 86400);

      return `${days}d ago`;
    }


    return date.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric"
      }
    );

  }


  function normalize(value) {

    return String(value ?? "")
      .toLowerCase()
      .trim();

  }


  function getFilteredPosts() {

    const query =
      normalize(
        searchInput?.value
      );

    const category =
      categoryFilter?.value || "all";

    let result =
      posts.filter(post => {

        const searchable =
          normalize(
            `${post.title || ""}
                         ${post.description || ""}
                         ${post.location || ""}
                         ${post.category || ""}
                         ${post.authorName || ""}`
          );


        const matchesSearch =
          !query ||
          searchable.includes(query);


        const matchesCategory =
          category === "all" ||
          normalize(post.category) ===
          category;


        return (
          matchesSearch &&
          matchesCategory
        );

      });


    if (
      sortPosts?.value ===
      "supported"
    ) {

      result.sort(
        (a, b) =>
          Number(b.supports || 0) -
          Number(a.supports || 0)
      );

    } else {

      result.sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );

    }


    return result;

  }


  function updateSearchButton() {

    if (!clearSearch) {
      return;
    }

    clearSearch.hidden =
      !(searchInput?.value || "").length;

  }


  function updateCount(count) {

    if (!postCount) {
      return;
    }

    postCount.textContent =
      `${count} ${count === 1
        ? "post"
        : "posts"
      }`;

  }


  function showState(
    state
  ) {

    if (emptyState) {
      emptyState.hidden =
        state !== "filtered";
    }

    if (noPostsState) {
      noPostsState.hidden =
        state !== "empty";
    }

  }


  function createPostCard(post) {

    if (!template) {
      return null;
    }

    const fragment =
      template.content.cloneNode(true);


    const card =
      fragment.querySelector(".post-card");

    const authorImage =
      fragment.querySelector(
        "[data-author-image]"
      );

    const authorName =
      fragment.querySelector(
        "[data-author-name]"
      );

    const postTime =
      fragment.querySelector(
        "[data-post-time]"
      );

    const category =
      fragment.querySelector(
        "[data-category]"
      );

    const postLink =
      fragment.querySelector(
        "[data-post-link]"
      );

    const title =
      fragment.querySelector(
        "[data-post-title]"
      );

    const description =
      fragment.querySelector(
        "[data-post-description]"
      );

    const location =
      fragment.querySelector(
        "[data-location]"
      );

    const locationContainer =
      fragment.querySelector(
        "[data-location-container]"
      );

    const imageContainer =
      fragment.querySelector(
        "[data-image-container]"
      );

    const postImage =
      fragment.querySelector(
        "[data-post-image]"
      );

    const supportButton =
      fragment.querySelector(
        "[data-support-button]"
      );

    const supportText =
      fragment.querySelector(
        "[data-support-text]"
      );

    const supportCount =
      fragment.querySelector(
        "[data-support-count]"
      );

    const commentsLink =
      fragment.querySelector(
        "[data-comments-link]"
      );

    const commentCount =
      fragment.querySelector(
        "[data-comment-count]"
      );


    const safeTitle =
      escapeHTML(
        post.title ||
        "Public Problem"
      );

    const safeDescription =
      escapeHTML(
        post.description ||
        ""
      );

    const safeAuthor =
      escapeHTML(
        post.authorName ||
        "CIVA User"
      );


    if (authorName) {
      authorName.innerHTML =
        safeAuthor;
    }


    if (postTime) {
      postTime.textContent =
        formatDate(
          post.createdAt
        );
    }


    if (category) {

      const categoryKey =
        normalize(
          post.category
        );

      category.textContent =
        categoryNames[
        categoryKey
        ] ||
        "Public Issue";

    }


    if (title) {
      title.innerHTML =
        safeTitle;
    }


    if (description) {
      description.innerHTML =
        safeDescription;
    }


    if (location) {

      location.textContent =
        post.location ||
        "Public area";

    }


    if (
      !post.location &&
      locationContainer
    ) {

      locationContainer.hidden =
        true;

    }


    if (
      post.authorImage &&
      typeof post.authorImage ===
      "string"
    ) {

      authorImage.src =
        post.authorImage;

    } else {

      authorImage.src =
        "profile-placeholder.jpg";

    }


    if (
      post.image &&
      typeof post.image ===
      "string"
    ) {

      postImage.src =
        post.image;

      postImage.alt =
        safeTitle;

      imageContainer.hidden =
        false;

    }


    const postId =
      encodeURIComponent(
        String(post.id)
      );


    if (postLink) {

      postLink.href =
        `post-detail.html?id=${postId}`;

    }


    if (commentsLink) {

      commentsLink.href =
        `post-detail.html?id=${postId}#comments`;

    }


    const supports =
      Math.max(
        0,
        Number(post.supports) || 0
      );


    if (supportCount) {
      supportCount.textContent =
        supports;
    }


    const supportedPosts =
      getSupportedPosts();

    const alreadySupported =
      supportedPosts.includes(
        String(post.id)
      );


    if (alreadySupported) {

      supportButton.classList.add(
        "supported"
      );

      if (supportText) {
        supportText.textContent =
          "Supported";
      }

    }


    if (supportButton) {

      supportButton.addEventListener(
        "click",
        event => {

          event.preventDefault();
          event.stopPropagation();

          handleSupport(
            post.id
          );

        }
      );

    }


    if (card) {

      card.dataset.postId =
        String(post.id);

    }


    return fragment;

  }


  function renderPosts() {

    if (!postsList) {
      return;
    }

    postsList.innerHTML = "";

    const filtered =
      getFilteredPosts();


    updateCount(
      filtered.length
    );


    if (!posts.length) {

      showState("empty");

      return;

    }


    if (!filtered.length) {

      showState("filtered");

      return;

    }


    showState("posts");


    const fragment =
      document.createDocumentFragment();


    filtered.forEach(post => {

      const card =
        createPostCard(post);

      if (card) {
        fragment.appendChild(card);
      }

    });


    postsList.appendChild(
      fragment
    );

  }


  function getSupportedPosts() {

    try {

      const saved =
        localStorage.getItem(
          "civaSupportedPosts"
        );

      const parsed =
        saved
          ? JSON.parse(saved)
          : [];

      return Array.isArray(parsed)
        ? parsed.map(String)
        : [];

    } catch {

      return [];

    }

  }


  function saveSupportedPosts(
    supported
  ) {

    localStorage.setItem(
      "civaSupportedPosts",
      JSON.stringify(
        supported
      )
    );

  }


  function handleSupport(
    postId
  ) {

    const loggedIn =
      localStorage.getItem(
        "civaLoggedIn"
      ) === "true";


    if (!loggedIn) {

      const shouldLogin =
        window.confirm(
          "Please sign in to support a public problem."
        );

      if (shouldLogin) {
        window.location.href =
          "login.html";
      }

      return;

    }


    const id =
      String(postId);

    const supported =
      getSupportedPosts();


    if (
      supported.includes(id)
    ) {

      return;

    }


    const post =
      posts.find(
        item =>
          String(item.id) === id
      );


    if (!post) {
      return;
    }


    post.supports =
      Math.max(
        0,
        Number(post.supports) || 0
      ) + 1;


    supported.push(id);

    saveSupportedPosts(
      supported
    );


    if (!savePosts()) {
      return;
    }


    renderPosts();

  }


  if (searchInput) {

    searchInput.addEventListener(
      "input",
      () => {

        updateSearchButton();
        renderPosts();

      }
    );

  }


  if (clearSearch) {

    clearSearch.addEventListener(
      "click",
      () => {

        if (searchInput) {
          searchInput.value = "";
          searchInput.focus();
        }

        updateSearchButton();
        renderPosts();

      }
    );

  }


  if (categoryFilter) {

    categoryFilter.addEventListener(
      "change",
      renderPosts
    );

  }


  if (sortPosts) {

    sortPosts.addEventListener(
      "change",
      renderPosts
    );

  }


  if (resetFilters) {

    resetFilters.addEventListener(
      "click",
      () => {

        if (searchInput) {
          searchInput.value = "";
        }

        if (categoryFilter) {
          categoryFilter.value =
            "all";
        }

        if (sortPosts) {
          sortPosts.value =
            "latest";
        }

        updateSearchButton();
        renderPosts();

      }
    );

  }


  loadPosts();
  updateSearchButton();
  renderPosts();

});