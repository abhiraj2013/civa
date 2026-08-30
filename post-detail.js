"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const loadingState =
    document.getElementById("loadingState");

  const postNotFound =
    document.getElementById("postNotFound");

  const postDetail =
    document.getElementById("postDetail");

  const postAuthorImage =
    document.getElementById("postAuthorImage");

  const postAuthorName =
    document.getElementById("postAuthorName");

  const postTime =
    document.getElementById("postTime");

  const postCategory =
    document.getElementById("postCategory");

  const postTitle =
    document.getElementById("postTitle");

  const postLocation =
    document.getElementById("postLocation");

  const postLocationText =
    document.getElementById("postLocationText");

  const postImageContainer =
    document.getElementById("postImageContainer");

  const postImage =
    document.getElementById("postImage");

  const postDescription =
    document.getElementById("postDescription");

  const supportButton =
    document.getElementById("supportButton");

  const supportText =
    document.getElementById("supportText");

  const supportCount =
    document.getElementById("supportCount");

  const shareButton =
    document.getElementById("shareButton");

  const shareMessage =
    document.getElementById("shareMessage");

  const commentForm =
    document.getElementById("commentForm");

  const loginCommentNotice =
    document.getElementById(
      "loginCommentNotice"
    );

  const commentInput =
    document.getElementById("commentInput");

  const commentCharacters =
    document.getElementById(
      "commentCharacters"
    );

  const commentSubmit =
    document.getElementById(
      "commentSubmit"
    );

  const commentError =
    document.getElementById(
      "commentError"
    );

  const commentsList =
    document.getElementById(
      "commentsList"
    );

  const noComments =
    document.getElementById(
      "noComments"
    );

  const commentCount =
    document.getElementById(
      "commentCount"
    );

  const reportButton =
    document.getElementById(
      "reportButton"
    );

  const detailProfileImage =
    document.getElementById(
      "detailProfileImage"
    );


  let currentPost = null;


  const categoryNames = {
    roads: "Roads & Traffic",
    water: "Water & Drainage",
    electricity: "Electricity",
    education: "Education",
    environment: "Environment",
    health: "Health",
    transport: "Transport",
    "public-facilities":
      "Public Facilities",
    other: "Other"
  };


  function getPostId() {

    const params =
      new URLSearchParams(
        window.location.search
      );

    return params.get("id");

  }


  function loadPosts() {

    try {

      const saved =
        localStorage.getItem(
          "civaPosts"
        );

      if (!saved) {
        return [];
      }

      const parsed =
        JSON.parse(saved);

      return Array.isArray(parsed)
        ? parsed
        : [];

    } catch {

      return [];

    }

  }


  function savePosts(posts) {

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


  function escapeHTML(value) {

    const div =
      document.createElement("div");

    div.textContent =
      String(value ?? "");

    return div.innerHTML;

  }


  function formatDate(value) {

    const date =
      new Date(value);

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

      return `${Math.floor(
        seconds / 60
      )}m ago`;

    }

    if (seconds < 86400) {

      return `${Math.floor(
        seconds / 3600
      )}h ago`;

    }

    if (seconds < 604800) {

      return `${Math.floor(
        seconds / 86400
      )}d ago`;

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


  function isLoggedIn() {

    return (
      localStorage.getItem(
        "civaLoggedIn"
      ) === "true"
    );

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


  function getComments() {

    try {

      const saved =
        localStorage.getItem(
          "civaComments"
        );

      const parsed =
        saved
          ? JSON.parse(saved)
          : {};

      return (
        parsed &&
        typeof parsed === "object" &&
        !Array.isArray(parsed)
      )
        ? parsed
        : {};

    } catch {

      return {};

    }

  }


  function saveComments(
    comments
  ) {

    try {

      localStorage.setItem(
        "civaComments",
        JSON.stringify(
          comments
        )
      );

      return true;

    } catch {

      return false;

    }

  }


  function showPost() {

    loadingState.hidden =
      true;

    postNotFound.hidden =
      true;

    postDetail.hidden =
      false;

  }


  function showNotFound() {

    loadingState.hidden =
      true;

    postDetail.hidden =
      true;

    postNotFound.hidden =
      false;

  }


  function updateProfileImage() {

    const user =
      getCurrentUser();

    if (
      !detailProfileImage
    ) {
      return;
    }

    if (
      user &&
      typeof user.profileImage ===
      "string" &&
      user.profileImage.trim()
    ) {

      detailProfileImage.src =
        user.profileImage;

    } else {

      detailProfileImage.src =
        "profile-placeholder.jpg";

    }

  }


  function renderPost() {

    if (!currentPost) {
      showNotFound();
      return;
    }


    postAuthorName.textContent =
      currentPost.authorName ||
      "CIVA User";


    postTime.textContent =
      formatDate(
        currentPost.createdAt
      );


    const category =
      String(
        currentPost.category ||
        "other"
      ).toLowerCase();


    postCategory.textContent =
      categoryNames[ category ] ||
      "Public Issue";


    postTitle.textContent =
      currentPost.title ||
      "Public Problem";


    postDescription.textContent =
      currentPost.description ||
      "No description provided.";


    if (
      currentPost.location
    ) {

      postLocation.hidden =
        false;

      postLocationText.textContent =
        currentPost.location;

    } else {

      postLocation.hidden =
        true;

    }


    if (
      currentPost.authorImage &&
      typeof currentPost.authorImage ===
      "string"
    ) {

      postAuthorImage.src =
        currentPost.authorImage;

    } else {

      postAuthorImage.src =
        "profile-placeholder.jpg";

    }


    if (
      currentPost.image &&
      typeof currentPost.image ===
      "string"
    ) {

      postImage.src =
        currentPost.image;

      postImage.alt =
        currentPost.title ||
        "Public problem image";

      postImageContainer.hidden =
        false;

    } else {

      postImageContainer.hidden =
        true;

    }


    updateSupportUI();
    updateCommentAccess();
    renderComments();
    showPost();

  }


  function updateSupportUI() {

    const count =
      Math.max(
        0,
        Number(
          currentPost.supports
        ) || 0
      );


    supportCount.textContent =
      count;


    const supported =
      getSupportedPosts();


    const alreadySupported =
      supported.includes(
        String(
          currentPost.id
        )
      );


    if (alreadySupported) {

      supportButton.classList.add(
        "supported"
      );

      supportText.textContent =
        "Supported";

      supportButton.setAttribute(
        "aria-label",
        "You supported this post"
      );

    } else {

      supportButton.classList.remove(
        "supported"
      );

      supportText.textContent =
        "Support";

      supportButton.setAttribute(
        "aria-label",
        "Support this public problem"
      );

    }

  }


  function handleSupport() {

    if (!isLoggedIn()) {

      const goToLogin =
        window.confirm(
          "Please sign in to support this public problem."
        );

      if (goToLogin) {

        window.location.href =
          "login.html";

      }

      return;

    }


    const id =
      String(
        currentPost.id
      );


    const supported =
      getSupportedPosts();


    if (
      supported.includes(id)
    ) {
      return;
    }


    currentPost.supports =
      Math.max(
        0,
        Number(
          currentPost.supports
        ) || 0
      ) + 1;


    supported.push(id);


    saveSupportedPosts(
      supported
    );


    const posts =
      loadPosts();


    const index =
      posts.findIndex(
        post =>
          String(post.id) ===
          id
      );


    if (index === -1) {
      return;
    }


    posts[ index ] =
      currentPost;


    if (
      !savePosts(posts)
    ) {
      return;
    }


    updateSupportUI();

  }


  async function sharePost() {

    if (!currentPost) {
      return;
    }


    const url =
      window.location.href;


    const title =
      currentPost.title ||
      "CIVA Public Problem";


    try {

      if (
        navigator.share
      ) {

        await navigator.share({
          title,
          text:
            "View this public problem on CIVA.",
          url
        });

        return;

      }


      if (
        navigator.clipboard &&
        window.isSecureContext
      ) {

        await navigator.clipboard.writeText(
          url
        );

        showShareMessage(
          "Post link copied."
        );

        return;

      }


      window.prompt(
        "Copy this post link:",
        url
      );

    } catch {

    }

  }


  function showShareMessage(
    message
  ) {

    shareMessage.textContent =
      message;


    window.setTimeout(
      () => {

        shareMessage.textContent =
          "";

      },
      2500
    );

  }


  function updateCommentAccess() {

    if (isLoggedIn()) {

      commentForm.hidden =
        false;

      loginCommentNotice.hidden =
        true;

    } else {

      commentForm.hidden =
        true;

      loginCommentNotice.hidden =
        false;

    }

  }


  function renderComments() {

    const allComments =
      getComments();


    const postComments =
      Array.isArray(
        allComments[
        String(
          currentPost.id
        )
        ]
      )
        ? allComments[
        String(
          currentPost.id
        )
        ]
        : [];


    commentsList.innerHTML =
      "";


    commentCount.textContent =
      postComments.length;


    if (!postComments.length) {

      noComments.hidden =
        false;

      return;

    }


    noComments.hidden =
      true;


    const fragment =
      document.createDocumentFragment();


    postComments.forEach(
      comment => {

        const item =
          document.createElement(
            "article"
          );

        item.className =
          "comment-item";


        const header =
          document.createElement(
            "div"
          );

        header.className =
          "comment-header";


        const image =
          document.createElement(
            "img"
          );

        image.className =
          "comment-author-image";

        image.src =
          comment.authorImage ||
          "profile-placeholder.jpg";

        image.alt =
          "";


        const info =
          document.createElement(
            "div"
          );

        info.className =
          "comment-author-info";


        const name =
          document.createElement(
            "strong"
          );

        name.className =
          "comment-author-name";

        name.textContent =
          comment.authorName ||
          "CIVA User";


        const time =
          document.createElement(
            "span"
          );

        time.className =
          "comment-time";

        time.textContent =
          formatDate(
            comment.createdAt
          );


        const text =
          document.createElement(
            "p"
          );

        text.className =
          "comment-text";

        text.textContent =
          comment.text ||
          "";


        info.appendChild(name);
        info.appendChild(time);

        header.appendChild(image);
        header.appendChild(info);

        item.appendChild(header);
        item.appendChild(text);

        fragment.appendChild(item);

      }
    );


    commentsList.appendChild(
      fragment
    );

  }


  function addComment(
    text
  ) {

    const cleanText =
      String(text)
        .trim();


    if (!cleanText) {

      commentError.textContent =
        "Please write a comment.";

      return false;

    }


    if (
      cleanText.length > 500
    ) {

      commentError.textContent =
        "Comment must be 500 characters or less.";

      return false;

    }


    const user =
      getCurrentUser();


    if (!user) {

      commentError.textContent =
        "Please sign in first.";

      return false;

    }


    const allComments =
      getComments();


    const id =
      String(
        currentPost.id
      );


    if (
      !Array.isArray(
        allComments[ id ]
      )
    ) {

      allComments[ id ] = [];

    }


    allComments[ id ].push({

      id:
        `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 9)}`,

      authorName:
        user.name ||
        user.fullName ||
        "CIVA User",

      authorImage:
        user.profileImage ||
        "profile-placeholder.jpg",

      text:
        cleanText,

      createdAt:
        new Date().toISOString()

    });


    if (
      !saveComments(
        allComments
      )
    ) {

      commentError.textContent =
        "Could not save your comment.";

      return false;

    }


    commentError.textContent =
      "";

    commentInput.value =
      "";

    updateCharacterCount();
    renderComments();

    return true;

  }


  function updateCharacterCount() {

    if (!commentInput) {
      return;
    }

    commentCharacters.textContent =
      `${commentInput.value.length}/500`;

  }


  function reportPost() {

    const reports =
      JSON.parse(
        localStorage.getItem(
          "civaReports"
        ) || "[]"
      );


    reports.push({

      id:
        `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,

      postId:
        String(
          currentPost.id
        ),

      createdAt:
        new Date().toISOString(),

      reason:
        "User reported post"

    });


    try {

      localStorage.setItem(
        "civaReports",
        JSON.stringify(
          reports
        )
      );

    } catch {
      return;

    }


    reportButton.textContent =
      "Reported";

    reportButton.disabled =
      true;

  }


  supportButton?.addEventListener(
    "click",
    handleSupport
  );


  shareButton?.addEventListener(
    "click",
    sharePost
  );


  commentInput?.addEventListener(
    "input",
    updateCharacterCount
  );


  commentForm?.addEventListener(
    "submit",
    event => {

      event.preventDefault();

      if (
        addComment(
          commentInput.value
        )
      ) {

        commentSubmit.blur();

      }

    }
  );


  reportButton?.addEventListener(
    "click",
    () => {

      if (!isLoggedIn()) {

        const goToLogin =
          window.confirm(
            "Please sign in before reporting a post."
          );

        if (goToLogin) {
          window.location.href =
            "login.html";
        }

        return;

      }


      const confirmed =
        window.confirm(
          "Report this post if you believe it violates CIVA rules."
        );


      if (confirmed) {
        reportPost();
      }

    }
  );


  const postId =
    getPostId();


  const posts =
    loadPosts();


  currentPost =
    posts.find(
      post =>
        String(post.id) ===
        String(postId)
    ) || null;


  updateCharacterCount();


  if (currentPost) {

    renderPost();

  } else {

    showNotFound();

  }

});