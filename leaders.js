"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const searchInput =
    document.getElementById("leaderSearch");

  const leaderList =
    document.getElementById("leaderList");

  const leaderEmpty =
    document.getElementById("leaderEmpty");

  const refreshButton =
    document.getElementById("leaderRefresh");

  const yourRank =
    document.getElementById("yourLeaderRank");

  const yourRankLink =
    document.getElementById("yourLeaderRankLink");

  const yourCommunityCount =
    document.getElementById("yourCommunityCount");


  if (!leaderList) {
    return;
  }


  /* =========================
     ORIGINAL DEMO LEADERS
  ========================= */

  const demoCards = Array.from(
    leaderList.querySelectorAll(".leader-card")
  );


  /* =========================
     STORAGE
  ========================= */

  function getStoredUser() {

    try {

      const raw =
        localStorage.getItem("civaUserProfile");

      if (!raw) {
        return null;
      }

      const user =
        JSON.parse(raw);

      if (
        !user ||
        typeof user !== "object"
      ) {
        return null;
      }

      return user;

    } catch (error) {

      return null;

    }

  }


  function isLoggedIn() {

    return (
      localStorage.getItem("civaLoggedIn") === "true" &&
      Boolean(getStoredUser())
    );

  }


  /* =========================
     USER DATA
  ========================= */

  function getUserName(user) {

    if (!user) {
      return "";
    }

    return String(
      user.fullName ||
      user.name ||
      user.displayName ||
      user.username ||
      ""
    ).trim();

  }


  function getUsername(user) {

    if (!user) {
      return "";
    }

    if (user.username) {

      let username =
        String(user.username).trim();

      if (!username.startsWith("@")) {
        username = `@${username}`;
      }

      return username;

    }


    const name =
      getUserName(user);

    if (!name) {
      return "@civauser";
    }


    const generated =
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "")
        .slice(0, 20);


    return `@${generated || "civauser"}`;

  }


  function getUserCommunities(user) {

    if (!user) {
      return 0;
    }


    const values = [

      user.communitiesJoined,

      user.communityCount,

      user.joinedCommunities,

      user.communities

    ];


    for (const value of values) {

      if (
        typeof value === "number" &&
        Number.isFinite(value)
      ) {

        return Math.max(
          0,
          Math.floor(value)
        );

      }


      if (Array.isArray(value)) {

        return value.length;

      }

    }


    return 0;

  }


  function getUserImage(user) {

    if (!user) {
      return "profile-placeholder.jpg";
    }


    const image =
      user.profileImage ||
      user.profileImageUrl ||
      user.avatar ||
      user.photoURL ||
      "";


    return image || "profile-placeholder.jpg";

  }


  function formatNumber(number) {

    return new Intl.NumberFormat("en-IN")
      .format(
        Number.isFinite(Number(number))
          ? Number(number)
          : 0
      );

  }


  /* =========================
     CREATE REAL USER CARD
  ========================= */

  function createUserCard(user) {

    const card =
      document.createElement("article");

    card.className =
      "leader-card is-current-user";

    card.dataset.leaderId =
      "current-user";

    card.dataset.realUser =
      "true";

    card.dataset.leaderName =
      getUserName(user);

    card.dataset.communities =
      String(
        getUserCommunities(user)
      );


    const rank =
      document.createElement("div");

    rank.className =
      "leader-rank";

    rank.textContent =
      "#1";


    const avatar =
      document.createElement("div");

    avatar.className =
      "leader-avatar";


    const image =
      document.createElement("img");

    image.src =
      getUserImage(user);

    image.alt =
      getUserName(user) || "Your profile";

    image.width = 56;
    image.height = 56;
    image.loading = "lazy";


    image.onerror = () => {

      image.onerror = null;

      image.src =
        "profile-placeholder.jpg";

    };


    avatar.appendChild(image);


    const details =
      document.createElement("div");

    details.className =
      "leader-details";


    const name =
      document.createElement("h3");

    name.textContent =
      getUserName(user) || "You";


    const username =
      document.createElement("p");

    username.className =
      "leader-username";

    username.textContent =
      getUsername(user);


    const communities =
      document.createElement("p");

    communities.className =
      "leader-communities";


    const strong =
      document.createElement("strong");

    strong.textContent =
      formatNumber(
        getUserCommunities(user)
      );


    communities.appendChild(strong);

    communities.appendChild(
      document.createTextNode(
        " Communities Joined"
      )
    );


    details.appendChild(name);
    details.appendChild(username);
    details.appendChild(communities);


    card.appendChild(rank);
    card.appendChild(avatar);
    card.appendChild(details);


    return card;

  }


  /* =========================
     REAL USER CARD MANAGEMENT
  ========================= */

  let currentUserCard = null;


  function renderCurrentUser() {

    if (currentUserCard) {

      currentUserCard.remove();

      currentUserCard = null;

    }


    if (!isLoggedIn()) {
      return;
    }


    const user =
      getStoredUser();


    if (!user) {
      return;
    }


    currentUserCard =
      createUserCard(user);


    /*
     * Real account appears first.
     */

    leaderList.prepend(
      currentUserCard
    );

  }


  /* =========================
     SORT
  ========================= */

  function sortLeaders() {

    const allCards =
      Array.from(
        leaderList.querySelectorAll(
          ".leader-card"
        )
      );


    const realCards =
      allCards.filter(
        card =>
          card.dataset.realUser === "true"
      );


    const fakeCards =
      allCards.filter(
        card =>
          card.dataset.realUser !== "true"
      );


    /*
     * Real user stays at the top.
     */

    realCards.forEach(
      (card, index) => {

        const rank =
          card.querySelector(
            ".leader-rank"
          );

        if (rank) {

          rank.textContent =
            `#${index + 1}`;

        }

        card.dataset.rank =
          String(index + 1);

        leaderList.appendChild(card);

      }
    );


    /*
     * Demo users remain below
     * the real account.
     */

    fakeCards.sort((a, b) => {

      const aCount =
        Number(
          a.dataset.communities || 0
        );

      const bCount =
        Number(
          b.dataset.communities || 0
        );

      return bCount - aCount;

    });


    fakeCards.forEach(
      (card, index) => {

        const rank =
          card.querySelector(
            ".leader-rank"
          );

        if (rank) {

          /*
           * Demo ranks are independent
           * from the real ranking.
           */

          rank.textContent =
            `Demo #${index + 1}`;

        }


        card.dataset.rank =
          `demo-${index + 1}`;


        leaderList.appendChild(card);

      }
    );

  }


  /* =========================
     SEARCH
  ========================= */

  function searchLeaders() {

    const query =
      String(
        searchInput?.value || ""
      )
        .trim()
        .toLowerCase();


    let visibleCount = 0;


    const cards =
      Array.from(
        leaderList.querySelectorAll(
          ".leader-card"
        )
      );


    cards.forEach(card => {

      const name =
        String(
          card.dataset.leaderName ||
          card.querySelector(
            ".leader-details h3"
          )?.textContent ||
          ""
        )
          .trim()
          .toLowerCase();


      const username =
        String(
          card.querySelector(
            ".leader-username"
          )?.textContent ||
          ""
        )
          .trim()
          .toLowerCase();


      const matches =
        !query ||
        name.includes(query) ||
        username.includes(query);


      card.hidden =
        !matches;


      if (matches) {
        visibleCount++;
      }

    });


    if (leaderEmpty) {

      leaderEmpty.hidden =
        visibleCount !== 0;

    }

  }


  /* =========================
     YOUR RANKING BOX
  ========================= */

  function updateRankingBox() {

    if (
      !yourRank ||
      !yourCommunityCount
    ) {
      return;
    }


    if (!isLoggedIn()) {

      yourRank.textContent =
        "Create an account to see your ranking";


      yourCommunityCount.textContent =
        "Create your CIVA account to start participating.";


      if (yourRankLink) {

        yourRankLink.href =
          "signup.html";

      }


      return;

    }


    const user =
      getStoredUser();


    const name =
      getUserName(user) || "You";


    const communities =
      getUserCommunities(user);


    /*
     * In the frontend-only MVP,
     * the real account is the only
     * real account available to rank.
     */

    yourRank.textContent =
      `#1 — ${name}`;


    yourCommunityCount.textContent =
      `${formatNumber(communities)} Communities Joined`;


    if (yourRankLink) {

      yourRankLink.href =
        "account.html";

    }

  }


  /* =========================
     REFRESH
  ========================= */

  function refreshLeaderboard() {

    if (!refreshButton) {
      return;
    }


    refreshButton.classList.add(
      "is-loading"
    );


    refreshButton.disabled =
      true;


    setTimeout(() => {

      renderCurrentUser();

      sortLeaders();

      searchLeaders();

      updateRankingBox();


      refreshButton.classList.remove(
        "is-loading"
      );


      refreshButton.disabled =
        false;

    }, 350);

  }


  /* =========================
     EVENTS
  ========================= */

  if (searchInput) {

    searchInput.addEventListener(
      "input",
      searchLeaders
    );

  }


  if (refreshButton) {

    refreshButton.addEventListener(
      "click",
      refreshLeaderboard
    );

  }


  /* =========================
     INITIAL LOAD
  ========================= */

  renderCurrentUser();

  sortLeaders();

  searchLeaders();

  updateRankingBox();

});