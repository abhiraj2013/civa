"use strict";

document.addEventListener("DOMContentLoaded", () => {

  /*
   * =========================
   * PROFILE ELEMENTS
   * =========================
   */

  const profilePage =
    document.getElementById("profilePage");

  const profileAvatar =
    document.getElementById("profileAvatar");

  const profileEmail =
    document.getElementById("profileEmail");

  const profileTitle =
    document.getElementById("profileTitle");

  const profileName =
    document.getElementById("profileName");

  const profileEmailDetail =
    document.getElementById("profileEmailDetail");

  const profileDob =
    document.getElementById("profileDob");

  const profileJoined =
    document.getElementById("profileJoined");

  const changePhotoButton =
    document.getElementById("changePhotoButton");

  const profilePhotoInput =
    document.getElementById("profilePhotoInput");

  const editProfileButton =
    document.getElementById("editProfileButton");

  const editDetailsButton =
    document.getElementById("editDetailsButton");

  const signOutButton =
    document.getElementById("signOutButton");

  const profileMessage =
    document.getElementById("profileMessage");


  /*
   * =========================
   * ACTIVITY ELEMENTS
   * =========================
   */

  const postCount =
    document.getElementById("postCount");

  const supportCount =
    document.getElementById("supportCount");

  const communityCount =
    document.getElementById("communityCount");

  const joinCount =
    document.getElementById("joinCount");


  /*
   * =========================
   * POSTS ELEMENTS
   * =========================
   */

  const postsPanel =
    document.getElementById("postsPanel");

  const postsEmpty =
    document.getElementById("postsEmpty");


  /*
   * =========================
   * DEFAULT IMAGE
   * =========================
   */

  const defaultProfileImage =
    "default-profile.png";


  /*
   * =========================
   * MESSAGE
   * =========================
   */

  function showMessage(message, type) {

    if (!profileMessage) {
      return;
    }

    profileMessage.textContent =
      message;

    profileMessage.className =
      `profile-message show ${type}`;

  }


  function hideMessage() {

    if (!profileMessage) {
      return;
    }

    profileMessage.textContent =
      "";

    profileMessage.className =
      "profile-message";

  }


  /*
   * =========================
   * GET USER
   * =========================
   */

  function getUser() {

    try {

      const savedUser =
        localStorage.getItem(
          "civaUserProfile"
        );

      if (!savedUser) {
        return null;
      }

      const user =
        JSON.parse(savedUser);

      if (
        !user ||
        typeof user !== "object"
      ) {
        return null;
      }

      return user;

    } catch {

      return null;

    }

  }


  /*
   * =========================
   * LOGIN CHECK
   * =========================
   */

  function isLoggedIn() {

    return (
      localStorage.getItem(
        "civaLoggedIn"
      ) === "true"
    );

  }


  function redirectToLogin() {

    window.location.href =
      "login.html";

  }


  /*
   * =========================
   * DATE FORMAT
   * =========================
   */

  function formatDate(dateString) {

    if (!dateString) {
      return "—";
    }

    const date =
      new Date(dateString);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "—";
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );

  }


  /*
   * =========================
   * CURRENT USER IDENTIFIER
   * =========================
   */

  function getCurrentUserIdentifier() {

    const user =
      getUser();

    if (!user) {
      return "";
    }

    const identifier =
      user.id ||
      user.email ||
      user.uid ||
      "";

    return String(
      identifier
    )
      .trim()
      .toLowerCase();

  }


  /*
   * =========================
   * LOAD PROFILE
   * =========================
   */

  function loadProfile() {

    if (!isLoggedIn()) {

      redirectToLogin();

      return;

    }


    const user =
      getUser();


    if (!user) {

      localStorage.removeItem(
        "civaLoggedIn"
      );

      redirectToLogin();

      return;

    }


    /*
     * Basic user information
     */

    const name =
      typeof user.fullName === "string"
        ? user.fullName.trim()
        : "";

    const email =
      typeof user.email === "string"
        ? user.email.trim()
        : "";

    const dob =
      typeof user.dateOfBirth === "string"
        ? user.dateOfBirth.trim()
        : "";


    /*
     * Edited profile information
     */

    let editedProfile = {};

    try {

      const savedEditedProfile =
        localStorage.getItem(
          "civa-edit-profile"
        );

      if (savedEditedProfile) {

        const parsed =
          JSON.parse(
            savedEditedProfile
          );

        if (
          parsed &&
          typeof parsed === "object"
        ) {
          editedProfile = parsed;
        }

      }

    } catch {

      editedProfile = {};

    }


    const finalName =
      typeof editedProfile.name === "string" &&
        editedProfile.name.trim()
        ? editedProfile.name.trim()
        : name;


    const finalImage =
      editedProfile.image ||
      user.profileImage ||
      defaultProfileImage;


    /*
     * Profile title
     */

    if (profileTitle) {

      profileTitle.textContent =
        finalName ||
        "Your Profile";

    }


    /*
     * Profile name
     */

    if (profileName) {

      profileName.textContent =
        finalName ||
        "—";

    }


    /*
     * Header email
     */

    if (profileEmail) {

      profileEmail.textContent =
        email ||
        "—";

    }


    /*
     * Detail email
     */

    if (profileEmailDetail) {

      profileEmailDetail.textContent =
        email ||
        "—";

    }


    /*
     * Date of birth
     */

    if (profileDob) {

      profileDob.textContent =
        dob ||
        "—";

    }


    /*
     * Joined date
     */

    if (profileJoined) {

      profileJoined.textContent =
        formatDate(
          user.createdAt
        );

    }


    /*
     * Profile image
     */

    if (profileAvatar) {

      profileAvatar.src =
        finalImage;

      profileAvatar.alt =
        finalName
          ? `${finalName} profile photo`
          : "Profile photo";

    }


    /*
     * Load activity
     */

    loadActivity();

    loadMyPosts();

  }


  /*
   * =========================
   * GET ALL POSTS
   * =========================
   */

  function getAllPosts() {

    try {

      const savedPosts =
        localStorage.getItem(
          "civaPosts"
        );

      if (!savedPosts) {
        return [];
      }

      const parsed =
        JSON.parse(
          savedPosts
        );

      return Array.isArray(parsed)
        ? parsed
        : [];

    } catch {

      return [];

    }

  }


  /*
   * =========================
   * GET CURRENT USER POSTS
   * =========================
   */

  function getCurrentUserPosts() {

    const user =
      getUser();


    if (
      !user ||
      typeof user.email !== "string"
    ) {
      return [];
    }


    const currentEmail =
      user.email
        .trim()
        .toLowerCase();


    if (!currentEmail) {
      return [];
    }


    const posts =
      getAllPosts();


    return posts.filter(
      post => {

        if (
          !post ||
          typeof post.authorEmail !== "string"
        ) {
          return false;
        }

        return (
          post.authorEmail
            .trim()
            .toLowerCase() ===
          currentEmail
        );

      }
    );

  }


  /*
   * =========================
   * LOAD MY POSTS
   * =========================
   */

  function loadMyPosts() {

    if (!postsPanel) {
      return;
    }


    /*
     * Remove previously rendered
     * profile post cards.
     */

    postsPanel
      .querySelectorAll(
        ".profile-post-card"
      )
      .forEach(
        card => card.remove()
      );


    const myPosts =
      getCurrentUserPosts();


    /*
     * No posts
     */

    if (
      myPosts.length === 0
    ) {

      if (postsEmpty) {

        postsEmpty.hidden =
          false;

        postsEmpty.style.display =
          "";

      }

      return;

    }


    /*
     * Posts exist
     */

    if (postsEmpty) {

      postsEmpty.hidden =
        true;

      postsEmpty.style.display =
        "none";

    }


    /*
     * Create post cards
     */

    myPosts.forEach(
      post => {

        const card =
          document.createElement(
            "article"
          );

        card.className =
          "profile-post-card";

        if (post.id) {

          card.dataset.postId =
            String(post.id);

        }


        const title =
          document.createElement(
            "h3"
          );

        title.textContent =
          post.title ||
          "Untitled post";


        const description =
          document.createElement(
            "p"
          );

        description.textContent =
          post.description ||
          "";


        const meta =
          document.createElement(
            "small"
          );

        let metaText =
          post.category ||
          "Public issue";


        if (post.location) {

          metaText +=
            ` • ${post.location}`;

        }


        meta.textContent =
          metaText;


        card.appendChild(
          title
        );

        card.appendChild(
          description
        );

        card.appendChild(
          meta
        );


        postsPanel.appendChild(
          card
        );

      }
    );

  }


  /*
   * =========================
   * GET JOINED COMMUNITIES
   * =========================
   */

  function getJoinedCommunities() {

    try {

      const saved =
        localStorage.getItem(
          "civa-joined-communities"
        );

      if (!saved) {
        return [];
      }

      const parsed =
        JSON.parse(
          saved
        );

      return Array.isArray(parsed)
        ? parsed
        : [];

    } catch {

      return [];

    }

  }


  /*
   * =========================
   * GET CREATED COMMUNITIES
   * =========================
   */

  function getCreatedCommunities() {

    try {

      const saved =
        localStorage.getItem(
          "civaCommunities"
        );

      if (!saved) {
        return [];
      }

      const parsed =
        JSON.parse(
          saved
        );

      return Array.isArray(parsed)
        ? parsed
        : [];

    } catch {

      return [];

    }

  }


  /*
   * =========================
   * CHECK COMMUNITY OWNER
   * =========================
   */

  function isCurrentUserCommunity(
    community
  ) {

    if (
      !community ||
      typeof community !== "object"
    ) {
      return false;
    }


    const currentUserId =
      getCurrentUserIdentifier();


    if (!currentUserId) {
      return false;
    }


    const creatorId =
      String(
        community.creatorId ||
        community.leaderId ||
        ""
      )
        .trim()
        .toLowerCase();


    return (
      creatorId ===
      currentUserId
    );

  }


  /*
   * =========================
   * SUPPORT COUNT
   * =========================
   */

  function getSupportCount() {

    const value =
      Number(
        localStorage.getItem(
          "civa-support-count"
        )
      );


    if (
      Number.isFinite(value) &&
      value >= 0
    ) {
      return value;
    }


    return 0;

  }


  /*
   * =========================
   * LOAD ACTIVITY
   * =========================
   */

  function loadActivity() {

    const myPosts =
      getCurrentUserPosts();


    const joinedCommunities =
      getJoinedCommunities();


    const createdCommunities =
      getCreatedCommunities();


    const myCreatedCommunities =
      createdCommunities.filter(
        isCurrentUserCommunity
      );


    /*
     * Post count
     */

    if (postCount) {

      postCount.textContent =
        myPosts.length;

    }


    /*
     * Joined community count
     */

    if (joinCount) {

      joinCount.textContent =
        joinedCommunities.length;

    }


    /*
     * Support count
     */

    if (supportCount) {

      supportCount.textContent =
        getSupportCount();

    }


    /*
     * Created community count
     */

    if (communityCount) {

      communityCount.textContent =
        myCreatedCommunities.length;

    }

  }
  /*
 * =========================
 * PROFILE PHOTO
 * =========================
 */

  if (
    changePhotoButton &&
    profilePhotoInput
  ) {

    changePhotoButton.addEventListener(
      "click",
      () => {

        profilePhotoInput.click();

      }
    );


    profilePhotoInput.addEventListener(
      "change",
      () => {

        const file =
          profilePhotoInput.files?.[ 0 ];


        if (!file) {
          return;
        }


        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/webp"
        ];


        if (
          !allowedTypes.includes(
            file.type
          )
        ) {

          profilePhotoInput.value =
            "";

          showMessage(
            "Please choose a JPG, PNG or WebP image.",
            "error"
          );

          return;

        }


        if (
          file.size >
          2 * 1024 * 1024
        ) {

          profilePhotoInput.value =
            "";

          showMessage(
            "Profile image must be 2 MB or smaller.",
            "error"
          );

          return;

        }


        const reader =
          new FileReader();


        reader.onload = () => {

          try {

            const user =
              getUser();


            if (!user) {

              redirectToLogin();

              return;

            }


            user.profileImage =
              reader.result;


            localStorage.setItem(
              "civaUserProfile",
              JSON.stringify(user)
            );


            /*
             * Update image immediately
             */

            if (profileAvatar) {

              profileAvatar.src =
                reader.result;

            }


            showMessage(
              "Profile photo updated.",
              "success"
            );


          } catch {

            showMessage(
              "The photo could not be saved on this device.",
              "error"
            );

          }

        };


        reader.readAsDataURL(file);

      }
    );

  }


  /*
   * =========================
   * CONTENT TABS
   * =========================
   */

  const contentTabs =
    document.querySelectorAll(
      ".content-tab"
    );


  const contentPanels =
    document.querySelectorAll(
      ".content-panel"
    );


  contentTabs.forEach(
    tab => {

      tab.addEventListener(
        "click",
        () => {

          const target =
            tab.dataset.content;


          if (!target) {
            return;
          }


          /*
           * Remove active state
           */

          contentTabs.forEach(
            item => {

              item.classList.remove(
                "active"
              );

              item.setAttribute(
                "aria-selected",
                "false"
              );

            }
          );


          contentPanels.forEach(
            panel => {

              panel.classList.remove(
                "active"
              );

              panel.hidden =
                true;

            }
          );


          /*
           * Activate clicked tab
           */

          tab.classList.add(
            "active"
          );


          tab.setAttribute(
            "aria-selected",
            "true"
          );


          const targetPanel =
            document.querySelector(
              `[data-panel="${target}"]`
            );


          if (targetPanel) {

            targetPanel.classList.add(
              "active"
            );

            targetPanel.hidden =
              false;

          }

        }
      );

    }
  );


  /*
   * =========================
   * EDIT PROFILE
   * =========================
   */

  function editProfile() {

    /*
     * MVP:
     * Profile editing UI will be
     * connected later.
     */

    showMessage(
      "Profile editing will be connected here.",
      "success"
    );

  }


  if (editProfileButton) {

    editProfileButton.addEventListener(
      "click",
      editProfile
    );

  }


  if (editDetailsButton) {

    editDetailsButton.addEventListener(
      "click",
      editProfile
    );

  }


  /*
   * =========================
   * SIGN OUT
   * =========================
   */

  if (signOutButton) {

    signOutButton.addEventListener(
      "click",
      () => {

        const confirmed =
          window.confirm(
            "Are you sure you want to sign out?"
          );


        if (!confirmed) {
          return;
        }


        localStorage.removeItem(
          "civaLoggedIn"
        );


        window.location.href =
          "login.html";

      }
    );

  }


  /*
   * =========================
   * INITIAL PROFILE LOAD
   * =========================
   */

  loadProfile();

});