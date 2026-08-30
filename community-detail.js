"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const content =
    document.getElementById(
      "communityContent"
    );

  const notFound =
    document.getElementById(
      "communityNotFound"
    );

  const communityImage =
    document.getElementById(
      "communityImage"
    );

  const communityCategory =
    document.getElementById(
      "communityCategory"
    );

  const communityName =
    document.getElementById(
      "communityName"
    );

  const communityDescription =
    document.getElementById(
      "communityDescription"
    );

  const communityLocation =
    document.getElementById(
      "communityLocation"
    );

  const communityMembers =
    document.getElementById(
      "communityMembers"
    );

  const communityPosts =
    document.getElementById(
      "communityPosts"
    );

  const communityAbout =
    document.getElementById(
      "communityAbout"
    );

  const communityRules =
    document.getElementById(
      "communityRules"
    );

  const communityLeaderImage =
    document.getElementById(
      "communityLeaderImage"
    );

  const communityLeaderName =
    document.getElementById(
      "communityLeaderName"
    );

  const communityPostCount =
    document.getElementById(
      "communityPostCount"
    );

  const communityPostsList =
    document.getElementById(
      "communityPostsList"
    );

  const joinButton =
    document.getElementById(
      "joinCommunityButton"
    );

  const shareButton =
    document.getElementById(
      "shareCommunityButton"
    );

  const reportButton =
    document.getElementById(
      "reportCommunityButton"
    );

  const actionMessage =
    document.getElementById(
      "communityActionMessage"
    );


  if (
    !content ||
    !notFound ||
    !communityName ||
    !communityPostsList
  ) {
    return;
  }


  /*
   * =========================
   * COMMUNITY STORAGE
   * =========================
   */

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


  /*
   * =========================
   * POSTS
   * =========================
   */

  function getPosts() {

    const possibleKeys = [
      "civaPosts",
      "civaPostsData"
    ];


    for (
      const key of possibleKeys
    ) {

      try {

        const saved =
          localStorage.getItem(
            key
          );

        if (!saved) {
          continue;
        }


        const parsed =
          JSON.parse(saved);


        if (
          Array.isArray(parsed)
        ) {

          return parsed;

        }

      } catch {

        // Try next supported key.

      }

    }


    return [];

  }


  /*
   * =========================
   * COMMUNITY ID
   * =========================
   */

  function getCommunityId() {

    const params =
      new URLSearchParams(
        window.location.search
      );


    return String(
      params.get("id") || ""
    ).trim();

  }


  /*
   * =========================
   * USER
   * =========================
   */

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


  function getUserId() {

    const user =
      getUser();


    if (!user) {
      return "";
    }


    return String(
      user.id ||
      user.uid ||
      user.email ||
      ""
    )
      .trim()
      .toLowerCase();

  }


  function isLoggedIn() {

    return (
      localStorage.getItem(
        "civaLoggedIn"
      ) === "true"
    );

  }


  /*
   * =========================
   * HELPERS
   * =========================
   */

  function safeText(
    value,
    fallback = ""
  ) {

    const text =
      String(
        value ?? ""
      ).trim();


    return text || fallback;

  }


  function formatCategory(
    value
  ) {

    const categories = {

      roads:
        "Roads & Traffic",

      water:
        "Water & Drainage",

      electricity:
        "Electricity",

      education:
        "Education",

      environment:
        "Environment",

      transport:
        "Transport",

      "public-facilities":
        "Public Facilities",

      other:
        "Other",

      local:
        "Local Issues",

      public:
        "Public Issues"

    };


    return (
      categories[ value ] ||
      safeText(
        value,
        "Community"
      )
    );

  }


  function formatDate(
    value
  ) {

    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return "";

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


  /*
   * =========================
   * SHOW / HIDE
   * =========================
   */

  function showNotFound() {

    content.hidden = true;

    notFound.hidden = false;

  }


  function showContent() {

    notFound.hidden = true;

    content.hidden = false;

  }


  /*
   * =========================
   * IMAGE
   * =========================
   */

  function updateCommunityImage(
    community
  ) {

    if (!communityImage) {
      return;
    }


    const image =
      safeText(
        community.image,
        "community-placeholder.jpg"
      );


    communityImage.src =
      image;


    communityImage.onerror =
      () => {

        communityImage.onerror =
          null;

        communityImage.src =
          "community-placeholder.jpg";

      };

  }


  /*
   * =========================
   * LEADER
   * =========================
   */

  function updateLeader(
    community
  ) {

    if (
      !communityLeaderImage ||
      !communityLeaderName
    ) {

      return;

    }


    const image =
      safeText(
        community.creatorImage,
        "profile-placeholder.jpg"
      );


    communityLeaderImage.src =
      image;


    communityLeaderImage.onerror =
      () => {

        communityLeaderImage.onerror =
          null;

        communityLeaderImage.src =
          "profile-placeholder.jpg";

      };


    communityLeaderName.textContent =
      safeText(
        community.creatorName,
        "CIVA Leader"
      );

  }


  /*
   * =========================
   * MEMBER COUNT
   * =========================
   */

  function getMemberIds(
    community
  ) {

    if (
      !Array.isArray(
        community.memberIds
      )
    ) {

      community.memberIds = [];

    }


    return community.memberIds;

  }


  function getMemberCount(
    community
  ) {

    const memberIds =
      getMemberIds(
        community
      );


    /*
     * Keep stored member count
     * compatible with old data.
     */

    const stored =
      Number(
        community.members
      );


    if (
      Number.isFinite(stored) &&
      stored >= memberIds.length
    ) {

      return Math.floor(
        stored
      );

    }


    return memberIds.length;

  }


  function updateMembers(
    community
  ) {

    const count =
      getMemberCount(
        community
      );


    if (communityMembers) {

      communityMembers.textContent =
        `${count} ${count === 1
          ? "member"
          : "members"
        }`;

    }

  }


  /*
   * =========================
   * JOIN STATUS
   * =========================
   */

  function isCommunityJoined(
    community
  ) {

    const userId =
      getUserId();


    if (!userId) {
      return false;
    }


    const memberIds =
      getMemberIds(
        community
      );


    return memberIds.includes(
      userId
    );

  }


  function updateJoinButton(
    community
  ) {

    if (!joinButton) {
      return;
    }


    const joined =
      isCommunityJoined(
        community
      );


    joinButton.textContent =
      joined
        ? "Joined"
        : "Join Community";


    joinButton.classList.toggle(
      "joined",
      joined
    );

  }


  /*
   * =========================
   * COMMUNITY POSTS
   * =========================
   */

  function getCommunityPosts(
    community
  ) {

    const posts =
      getPosts();


    return posts.filter(
      post => {

        const postCommunityId =
          String(
            post.communityId ||
            post.community ||
            ""
          ).trim();


        return (
          postCommunityId ===
          String(
            community.id
          ).trim()
        );

      }
    );

  }


  function renderPosts(
    posts
  ) {

    if (communityPostCount) {

      communityPostCount.textContent =
        String(
          posts.length
        );

    }


    if (communityPosts) {

      communityPosts.textContent =
        `${posts.length} ${posts.length === 1
          ? "post"
          : "posts"
        }`;

    }


    if (!communityPostsList) {
      return;
    }


    if (!posts.length) {

      communityPostsList.innerHTML = `

        <div class="empty-community-posts">

          <img
            src="post-placeholder.jpg"
            alt=""
            class="empty-post-image">

          <h3>
            No posts yet
          </h3>

          <p>
            This community does not have
            any posts yet.
          </p>

        </div>

      `;

      return;

    }


    const fragment =
      document.createDocumentFragment();


    posts.forEach(
      post => {

        const article =
          document.createElement(
            "article"
          );


        article.className =
          "community-post";


        const title =
          document.createElement(
            "h3"
          );


        title.textContent =
          safeText(
            post.title ||
            post.heading,
            "Community Post"
          );


        const text =
          document.createElement(
            "p"
          );


        text.textContent =
          safeText(
            post.content ||
            post.description ||
            post.text,
            "No post description available."
          );


        const meta =
          document.createElement(
            "div"
          );


        meta.className =
          "community-post-meta";


        const author =
          safeText(
            post.authorName ||
            post.creatorName,
            "CIVA User"
          );


        const date =
          formatDate(
            post.createdAt ||
            post.date
          );


        meta.textContent =
          date
            ? `${author} • ${date}`
            : author;


        article.appendChild(
          title
        );


        article.appendChild(
          text
        );


        article.appendChild(
          meta
        );


        fragment.appendChild(
          article
        );

      }
    );


    communityPostsList.innerHTML =
      "";


    communityPostsList.appendChild(
      fragment
    );

  }
  /*
 * =========================
 * LOAD COMMUNITY
 * =========================
 */

  function loadCommunity(community) {

    if (communityName) {

      communityName.textContent =
        safeText(
          community.name,
          "Community"
        );

    }


    if (communityCategory) {

      communityCategory.textContent =
        formatCategory(
          community.category
        );

    }


    if (communityDescription) {

      communityDescription.textContent =
        safeText(
          community.description,
          "No description available."
        );

    }


    if (communityAbout) {

      communityAbout.textContent =
        safeText(
          community.description,
          "No additional information available."
        );

    }


    if (communityRules) {

      communityRules.textContent =
        safeText(
          community.rules,
          "No community rules have been added yet."
        );

    }


    const location =
      safeText(
        community.location
      );


    if (communityLocation) {

      communityLocation.textContent =
        location
          ? `📍 ${location}`
          : "Location not specified";

    }


    updateCommunityImage(
      community
    );


    updateLeader(
      community
    );


    updateMembers(
      community
    );


    const posts =
      getCommunityPosts(
        community
      );


    renderPosts(
      posts
    );


    updateJoinButton(
      community
    );


    showContent();

  }


  /*
   * =========================
   * JOIN / LEAVE
   * =========================
   */

  function joinCommunity(
    community
  ) {

    if (!isLoggedIn()) {

      if (actionMessage) {

        actionMessage.textContent =
          "Please sign in to join this community.";

      }


      window.setTimeout(
        () => {

          window.location.href =
            "login.html";

        },
        700
      );


      return;

    }


    const userId =
      getUserId();


    if (!userId) {

      if (actionMessage) {

        actionMessage.textContent =
          "Your account information is incomplete.";

      }


      return;

    }


    const memberIds =
      getMemberIds(
        community
      );


    const index =
      memberIds.indexOf(
        userId
      );


    /*
     * Leave community
     */

    if (index !== -1) {

      memberIds.splice(
        index,
        1
      );


      const currentMembers =
        Number(
          community.members
        );


      community.members =
        Number.isFinite(
          currentMembers
        )
          ? Math.max(
            0,
            Math.floor(
              currentMembers
            ) - 1
          )
          : memberIds.length;


      if (actionMessage) {

        actionMessage.textContent =
          "You left the community.";

      }

    }


    /*
     * Join community
     */

    else {

      memberIds.push(
        userId
      );


      const currentMembers =
        Number(
          community.members
        );


      community.members =
        Number.isFinite(
          currentMembers
        )
          ? Math.floor(
            currentMembers
          ) + 1
          : memberIds.length;


      if (actionMessage) {

        actionMessage.textContent =
          "You joined the community.";

      }

    }


    /*
     * Save updated community
     */

    const communities =
      getCommunities();


    const communityIndex =
      communities.findIndex(
        item =>
          String(
            item.id
          ).trim() ===
          String(
            community.id
          ).trim()
      );


    if (
      communityIndex === -1
    ) {

      if (actionMessage) {

        actionMessage.textContent =
          "Could not find this community.";

      }


      return;

    }


    communities[
      communityIndex
    ] = community;


    const saved =
      saveCommunities(
        communities
      );


    if (!saved) {

      if (actionMessage) {

        actionMessage.textContent =
          "Could not save this change on this device.";

      }


      return;

    }


    /*
     * Sync with community.html
     */

    syncCommunityJoinState(
      community
    );


    updateMembers(
      community
    );


    updateJoinButton(
      community
    );

  }


  /*
   * =========================
   * SYNC COMMUNITY PAGE
   * =========================
   */

  function syncCommunityJoinState(
    community
  ) {

    const userId =
      getUserId();


    if (!userId) {
      return;
    }


    let joined =
      [];


    try {

      const saved =
        localStorage.getItem(
          "civa-joined-communities"
        );


      const parsed =
        saved
          ? JSON.parse(saved)
          : [];


      if (
        Array.isArray(parsed)
      ) {

        joined = parsed;

      }

    } catch {

      joined = [];

    }


    const memberIds =
      getMemberIds(
        community
      );


    const isJoined =
      memberIds.includes(
        userId
      );


    const index =
      joined.indexOf(
        community.id
      );


    if (
      isJoined &&
      index === -1
    ) {

      joined.push(
        community.id
      );

    }


    if (
      !isJoined &&
      index !== -1
    ) {

      joined.splice(
        index,
        1
      );

    }


    try {

      localStorage.setItem(
        "civa-joined-communities",
        JSON.stringify(
          joined
        )
      );


      /*
       * Keep member count
       * synchronized as well.
       */

      const savedMembers =
        JSON.parse(
          localStorage.getItem(
            "civa-community-members"
          ) || "{}"
        );


      if (
        savedMembers &&
        typeof savedMembers === "object"
      ) {

        savedMembers[
          community.id
        ] =
          Number(
            community.members
          ) || 0;


        localStorage.setItem(
          "civa-community-members",
          JSON.stringify(
            savedMembers
          )
        );

      }

    } catch {

      // Local synchronization failed.

    }

  }


  /*
   * =========================
   * SHARE
   * =========================
   */

  async function shareCommunity(
    community
  ) {

    const shareUrl =
      window.location.href;


    if (
      navigator.share
    ) {

      try {

        await navigator.share({

          title:
            safeText(
              community.name,
              "CIVA Community"
            ),

          text:
            safeText(
              community.description,
              "View this CIVA community."
            ),

          url:
            shareUrl

        });


        return;

      } catch {

        // User cancelled sharing.

      }

    }


    try {

      await navigator.clipboard.writeText(
        shareUrl
      );


      if (actionMessage) {

        actionMessage.textContent =
          "Community link copied.";

      }

    } catch {

      if (actionMessage) {

        actionMessage.textContent =
          "Sharing is not available on this device.";

      }

    }

  }


  /*
   * =========================
   * REPORT
   * =========================
   */

  function reportCommunity() {

    if (!isLoggedIn()) {

      if (actionMessage) {

        actionMessage.textContent =
          "Please sign in to report a community.";

      }


      return;

    }


    const confirmed =
      window.confirm(
        "Report this community for violating CIVA rules?"
      );


    if (!confirmed) {
      return;
    }


    try {

      const reports =
        JSON.parse(
          localStorage.getItem(
            "civaCommunityReports"
          ) || "[]"
        );


      const list =
        Array.isArray(
          reports
        )
          ? reports
          : [];


      list.push({

        communityId:
          communityId,

        reporterId:
          getUserId(),

        createdAt:
          new Date().toISOString()

      });


      localStorage.setItem(
        "civaCommunityReports",
        JSON.stringify(
          list
        )
      );


      if (actionMessage) {

        actionMessage.textContent =
          "Report saved. Review will be connected to the backend.";

      }

    } catch {

      if (actionMessage) {

        actionMessage.textContent =
          "Could not save the report on this device.";

      }

    }

  }


  /*
   * =========================
   * START
   * =========================
   */

  const communityId =
    getCommunityId();


  if (!communityId) {

    showNotFound();

    return;

  }


  const communities =
    getCommunities();


  const community =
    communities.find(
      item =>
        String(
          item.id
        ).trim() ===
        communityId
    );


  if (!community) {

    showNotFound();

    return;

  }


  loadCommunity(
    community
  );


  /*
   * JOIN BUTTON
   */

  if (joinButton) {

    joinButton.addEventListener(
      "click",
      () => {

        joinCommunity(
          community
        );

      }
    );

  }


  /*
   * SHARE BUTTON
   */

  if (shareButton) {

    shareButton.addEventListener(
      "click",
      () => {

        shareCommunity(
          community
        );

      }
    );

  }


  /*
   * REPORT BUTTON
   */

  if (reportButton) {

    reportButton.addEventListener(
      "click",
      reportCommunity
    );

  }

});