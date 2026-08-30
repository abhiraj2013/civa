"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const searchInput =
    document.getElementById("creatorSearch");

  const creatorList =
    document.getElementById("creatorList");

  const creatorEmpty =
    document.getElementById("creatorEmpty");

  const refreshButton =
    document.getElementById("creatorRefresh");

  const yourRanking =
    document.getElementById("yourRanking");

  const yourRank =
    document.getElementById("yourRank");

  const yourRankLink =
    document.getElementById("yourRankLink");

  const yourSupportCount =
    document.getElementById("yourSupportCount");


  if (!creatorList) {
    return;
  }


  /* =========================
     ACCOUNT DATA
  ========================= */

  function getCurrentUser() {

    const loggedIn =
      localStorage.getItem("civaLoggedIn") === "true";

    if (!loggedIn) {
      return null;
    }


    try {

      const saved =
        localStorage.getItem("civaUserProfile");

      if (!saved) {
        return null;
      }


      const profile =
        JSON.parse(saved);


      if (
        !profile ||
        typeof profile !== "object"
      ) {
        return null;
      }


      return profile;

    } catch (error) {

      console.warn(
        "CIVA profile could not be read.",
        error
      );

      return null;
    }
  }


  /* =========================
     LOCAL USER ID
  ========================= */

  function getCurrentUserId() {

    let userId =
      localStorage.getItem("civaUserId");


    if (userId) {
      return userId;
    }


    const user =
      getCurrentUser();


    if (!user) {
      return null;
    }


    /*
     * Create a stable ID for this
     * frontend-only account.
     */

    userId =
      "user-" +
      btoa(
        user.email || user.fullName || Date.now()
      )
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, 24);


    try {

      localStorage.setItem(
        "civaUserId",
        userId
      );

    } catch (error) {

      console.warn(
        "Could not save CIVA user ID.",
        error
      );
    }


    return userId;
  }


  /* =========================
     FAKE CREATOR CHECK
  ========================= */

  function isFakeCreator(card) {

    return (
      card.dataset.fake === "true" ||
      card.dataset.demo === "true"
    );
  }


  /* =========================
     GET SUPPORT
  ========================= */

  function getSupport(card) {

    const value =
      Number(card.dataset.support || 0);


    return Number.isFinite(value)
      ? value
      : 0;
  }


  /* =========================
     GET NAME
  ========================= */

  function getName(card) {

    return (
      card.dataset.creatorName ||
      card.querySelector("h3")?.textContent ||
      ""
    ).trim();
  }


  /* =========================
     FORMAT NUMBER
  ========================= */

  function formatNumber(number) {

    return new Intl.NumberFormat(
      "en-IN"
    ).format(number);
  }


  /* =========================
     EXISTING DEMO CREATORS
  ========================= */

  let creatorCards =
    Array.from(
      creatorList.querySelectorAll(
        ".creator-card"
      )
    );


  /* =========================
     CREATE REAL USER CARD
  ========================= */

  function createUserCreatorCard() {

    const user =
      getCurrentUser();


    if (!user) {
      return null;
    }


    const userId =
      getCurrentUserId();


    if (!userId) {
      return null;
    }


    /*
     * Prevent duplicate user card.
     */

    const existing =
      creatorList.querySelector(
        `[data-creator-id="${CSS.escape(userId)}"]`
      );


    if (existing) {
      return existing;
    }


    const card =
      document.createElement("article");


    card.className =
      "creator-card";


    card.dataset.creatorId =
      userId;


    card.dataset.creatorName =
      user.fullName || "CIVA User";


    /*
     * Frontend MVP currently has no
     * cross-device support database.
     * Therefore the user's real local
     * support starts at 0 until support
     * data is connected.
     */

    card.dataset.support = "0";


    const avatar =
      user.profileImage ||
      "profile-placeholder.jpg";


    const safeName =
      user.fullName ||
      "CIVA User";


    card.innerHTML = `
            <div class="creator-rank">
                #
            </div>

            <div class="creator-avatar">

                <img
                    src="${escapeAttribute(avatar)}"
                    alt="${escapeAttribute(safeName)}"
                    width="56"
                    height="56"
                    loading="lazy">

            </div>

            <div class="creator-details">

                <h3>
                    ${escapeHTML(safeName)}
                </h3>

                <p class="creator-username">
                    @civauser
                </p>

                <p class="creator-support">
                    <strong>0</strong> Supports
                </p>

            </div>
        `;


    creatorList.prepend(card);


    return card;
  }


  /* =========================
     SAFE HTML HELPERS
  ========================= */

  function escapeHTML(value) {

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  function escapeAttribute(value) {

    return escapeHTML(value);
  }


  /* =========================
     LOGIN / CREATE ACCOUNT UI
  ========================= */

  function updateAccountState() {

    const user =
      getCurrentUser();


    if (!user) {

      if (yourRank) {

        yourRank.textContent =
          "Create an account to see your ranking";

      }


      if (yourSupportCount) {

        yourSupportCount.textContent =
          "Create your CIVA account to join the creator leaderboard.";

      }


      if (yourRankLink) {

        yourRankLink.href =
          "signup.html";

      }


      if (yourRanking) {

        yourRanking.classList.remove(
          "is-logged-in"
        );

      }


      return;
    }


    /*
     * Account exists.
     */

    if (yourRankLink) {

      yourRankLink.removeAttribute(
        "href"
      );

    }


    if (yourRanking) {

      yourRanking.classList.add(
        "is-logged-in"
      );

    }
  }


  /* =========================
     SORT REAL CREATORS
  ========================= */

  function sortCreators() {

    creatorCards =
      Array.from(
        creatorList.querySelectorAll(
          ".creator-card"
        )
      );


    /*
     * Real users first.
     * Fake/demo creators stay below.
     */

    creatorCards.sort((a, b) => {

      const fakeA =
        isFakeCreator(a);

      const fakeB =
        isFakeCreator(b);


      if (fakeA !== fakeB) {

        return fakeA
          ? 1
          : -1;
      }


      return (
        getSupport(b) -
        getSupport(a)
      );
    });


    creatorCards.forEach(
      (card, index) => {

        const rankElement =
          card.querySelector(
            ".creator-rank"
          );


        if (rankElement) {

          rankElement.textContent =
            `#${index + 1}`;
        }


        creatorList.appendChild(
          card
        );
      }
    );
  }


  /* =========================
     SEARCH
  ========================= */

  function filterCreators() {

    const query =
      searchInput
        ? searchInput.value
          .trim()
          .toLowerCase()
        : "";


    let visibleCount = 0;


    creatorCards.forEach(card => {

      const name =
        getName(card)
          .toLowerCase();


      const username =
        (
          card.querySelector(
            ".creator-username"
          )?.textContent || ""
        )
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


    if (creatorEmpty) {

      creatorEmpty.hidden =
        visibleCount !== 0;

    }
  }


  /* =========================
     YOUR RANKING
  ========================= */

  function updateYourRanking() {

    const user =
      getCurrentUser();


    if (!user) {

      updateAccountState();

      return;
    }


    /*
     * Make sure current account
     * actually exists in leaderboard.
     */

    const userCard =
      createUserCreatorCard();


    if (!userCard) {
      return;
    }


    sortCreators();


    creatorCards =
      Array.from(
        creatorList.querySelectorAll(
          ".creator-card"
        )
      );


    const userId =
      getCurrentUserId();


    const userIndex =
      creatorCards.findIndex(card => {

        return (
          card.dataset.creatorId ===
          userId
        );

      });


    if (userIndex === -1) {

      if (yourRank) {

        yourRank.textContent =
          "Your ranking is not available yet";

      }


      if (yourSupportCount) {

        yourSupportCount.textContent =
          "Your creator profile will appear here.";

      }


      return;
    }


    const support =
      getSupport(
        creatorCards[ userIndex ]
      );


    const rank =
      userIndex + 1;


    if (yourRank) {

      yourRank.textContent =
        `#${rank}`;

    }


    if (yourSupportCount) {

      yourSupportCount.textContent =
        `${formatNumber(support)} Supports`;

    }


    if (yourRankLink) {

      yourRankLink.removeAttribute(
        "href"
      );

    }
  }


  /* =========================
     REFRESH
  ========================= */

  function refreshCreators() {

    if (!refreshButton) {
      return;
    }


    refreshButton.classList.add(
      "is-loading"
    );


    refreshButton.disabled =
      true;


    setTimeout(() => {

      updateYourRanking();

      sortCreators();

      filterCreators();


      refreshButton.classList.remove(
        "is-loading"
      );


      refreshButton.disabled =
        false;

    }, 300);
  }


  /* =========================
     EVENTS
  ========================= */

  if (searchInput) {

    searchInput.addEventListener(
      "input",
      filterCreators
    );
  }


  if (refreshButton) {

    refreshButton.addEventListener(
      "click",
      refreshCreators
    );
  }


  /* =========================
     INITIALIZE
  ========================= */

  updateAccountState();


  if (getCurrentUser()) {

    createUserCreatorCard();

  }


  sortCreators();

  filterCreators();

  updateYourRanking();

  sortCreators();

  filterCreators();

});
/* =========================
   YOUR CREATOR PROFILE
========================= */

(function() {

  const yourCreatorName =
    document.getElementById("yourCreatorName");

  const yourCreatorRank =
    document.getElementById("yourCreatorRank");

  const profileLink =
    document.getElementById("yourCreatorProfileLink");

  if (!yourCreatorName || !yourCreatorRank) {
    return;
  }


  function getCurrentUser() {

    try {

      const stored =
        localStorage.getItem("civaUserProfile");

      if (!stored) {
        return null;
      }

      return JSON.parse(stored);

    } catch (error) {

      return null;

    }

  }


  const user =
    getCurrentUser();


  if (!user) {

    yourCreatorName.textContent =
      "Create an account to appear here";

    yourCreatorRank.textContent =
      "Create a CIVA account to see your creator profile.";

    if (profileLink) {
      profileLink.href = "signup.html";
    }

    return;

  }


  const name =
    String(
      user.fullName ||
      user.name ||
      "CIVA Creator"
    ).trim();


  yourCreatorName.textContent =
    name;


  const creatorCards =
    Array.from(
      document.querySelectorAll(".creator-card")
    );


  const userCard =
    creatorCards.find(card => {

      const cardName =
        String(
          card.dataset.creatorName ||
          card.querySelector("h3")?.textContent ||
          ""
        )
          .trim()
          .toLowerCase();

      return (
        cardName === name.toLowerCase()
      );

    });


  if (userCard) {

    const rankElement =
      userCard.querySelector(".creator-rank");

    const rank =
      rankElement
        ? rankElement.textContent.trim()
        : "—";


    yourCreatorRank.textContent =
      `${rank} Creator on CIVA`;

  } else {

    yourCreatorRank.textContent =
      "Your creator profile is ready.";

  }


  if (profileLink) {
    profileLink.href =
      "profile.html";
  }

})();