"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const STORAGE_KEY = "civa-joined-communities";
  const MEMBERS_KEY = "civa-community-members";

  /*
   * =========================
   * COMMUNITY DATA
   * =========================
   */

  const communities = [

    {
      id: "community-local-civic-001",
      name: "Local Civic Issues",
      category: "local",
      description: "Public problems in local areas.",
      image: "profile-placeholder.jpg",
      members: 128
    },

    {
      id: "community-clean-environment-002",
      name: "Clean Environment",
      category: "environment",
      description: "Discuss pollution and environmental issues.",
      image: "profile-placeholder.jpg",
      members: 94
    },

    {
      id: "community-education-003",
      name: "Education Improvement",
      category: "education",
      description: "Share ideas about education and schools.",
      image: "profile-placeholder.jpg",
      members: 76
    },

    {
      id: "community-public-safety-004",
      name: "Public Safety",
      category: "public",
      description: "Discuss public safety concerns and useful solutions.",
      image: "profile-placeholder.jpg",
      members: 63
    },

    {
      id: "community-road-transport-005",
      name: "Road & Transport",
      category: "local",
      description: "Share problems related to roads and transportation.",
      image: "profile-placeholder.jpg",
      members: 51
    },

    {
      id: "community-clean-water-006",
      name: "Clean Water",
      category: "environment",
      description: "Discuss water quality, availability and local concerns.",
      image: "profile-placeholder.jpg",
      members: 47
    },

    {
      id: "community-student-voice-007",
      name: "Student Voice",
      category: "education",
      description: "A place for students to discuss useful public ideas.",
      image: "profile-placeholder.jpg",
      members: 39
    }

  ];


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
        JSON.parse(saved);

      return Array.isArray(parsed)
        ? parsed
        : [];

    } catch {

      return [];

    }

  }


  /*
   * =========================
   * MERGE COMMUNITIES
   * =========================
   */

  const createdCommunities =
    getCreatedCommunities();


  createdCommunities.forEach(
    community => {

      const exists =
        communities.some(
          item =>
            String(item.id) ===
            String(community.id)
        );

      if (!exists) {

        communities.push(
          community
        );

      }

    }
  );


  /*
   * =========================
   * ELEMENTS
   * =========================
   */

  const searchInput =
    document.getElementById(
      "communitySearch"
    );

  const filters =
    document.querySelectorAll(
      ".community-filter"
    );

  const globalGrid =
    document.getElementById(
      "communityGrid"
    );

  const yourGrid =
    document.getElementById(
      "yourCommunityGrid"
    );

  const yourSection =
    document.getElementById(
      "yourCommunitiesSection"
    );

  const yourEmpty =
    document.getElementById(
      "yourCommunityEmpty"
    );

  const globalEmpty =
    document.getElementById(
      "globalCommunityEmpty"
    );

  const yourCount =
    document.getElementById(
      "yourCommunityCount"
    );

  const globalCount =
    document.getElementById(
      "globalCommunityCount"
    );


  /*
   * =========================
   * DETAIL ELEMENTS
   * =========================
   */

  const detailOverlay =
    document.getElementById(
      "communityDetailOverlay"
    );

  const detailClose =
    document.getElementById(
      "communityDetailClose"
    );

  const detailImage =
    document.getElementById(
      "communityDetailImage"
    );

  const detailTitle =
    document.getElementById(
      "communityDetailTitle"
    );

  const detailDescription =
    document.getElementById(
      "communityDetailDescription"
    );

  const detailCategory =
    document.getElementById(
      "communityDetailCategory"
    );

  const detailMembers =
    document.getElementById(
      "communityDetailMembers"
    );

  const detailStatus =
    document.getElementById(
      "communityDetailStatus"
    );

  const detailJoin =
    document.getElementById(
      "communityDetailJoin"
    );


  /*
   * =========================
   * STORAGE STATE
   * =========================
   */

  let joinedCommunities = [];

  let savedMembers = {};


  try {

    const savedJoined =
      JSON.parse(
        localStorage.getItem(
          STORAGE_KEY
        ) || "[]"
      );

    joinedCommunities =
      Array.isArray(savedJoined)
        ? savedJoined
        : [];

  } catch {

    joinedCommunities = [];

  }


  try {

    const savedMemberData =
      JSON.parse(
        localStorage.getItem(
          MEMBERS_KEY
        ) || "{}"
      );

    savedMembers =
      savedMemberData &&
        typeof savedMemberData === "object" &&
        !Array.isArray(savedMemberData)
        ? savedMemberData
        : {};

  } catch {

    savedMembers = {};

  }


  /*
   * =========================
   * CURRENT STATE
   * =========================
   */

  let activeCategory = "all";

  let currentCommunityId = null;


  /*
   * =========================
   * HELPERS
   * =========================
   */

  function isJoined(id) {

    return joinedCommunities.includes(
      String(id)
    );

  }


  function getMembers(community) {

    const id =
      String(
        community.id
      );


    if (
      Object.prototype.hasOwnProperty.call(
        savedMembers,
        id
      )
    ) {

      const saved =
        Number(
          savedMembers[ id ]
        );

      if (
        Number.isFinite(saved) &&
        saved >= 0
      ) {

        return Math.floor(saved);

      }

    }


    const original =
      Number(
        community.members
      );


    return (
      Number.isFinite(original) &&
      original >= 0
    )
      ? Math.floor(original)
      : 0;

  }


  function saveState() {

    try {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          joinedCommunities
        )
      );

      localStorage.setItem(
        MEMBERS_KEY,
        JSON.stringify(
          savedMembers
        )
      );

      return true;

    } catch {

      return false;

    }

  }


  function formatMembers(number) {

    return `${number} ${number === 1
      ? "member"
      : "members"
      }`;

  }


  function escapeHTML(value) {

    return String(
      value ?? ""
    )
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


  function getCategoryName(
    category
  ) {

    const names = {

      local:
        "LOCAL",

      environment:
        "ENVIRONMENT",

      education:
        "EDUCATION",

      public:
        "PUBLIC ISSUES"

    };


    return (
      names[ category ] ||
      "COMMUNITY"
    );

  }


  /*
   * =========================
   * COMMUNITY CARD
   * =========================
   */

  function createCommunityCard(
    community
  ) {

    const article =
      document.createElement(
        "article"
      );


    article.className =
      "community-card";


    article.dataset.communityId =
      String(
        community.id
      );


    article.dataset.category =
      community.category ||
      "";


    article.dataset.name =
      String(
        community.name || ""
      ).toLowerCase();


    const joined =
      isJoined(
        String(
          community.id
        )
      );


    const members =
      getMembers(
        community
      );


    article.innerHTML = `

      <div class="community-card-top">

        <img
          src="${escapeHTML(
      community.image ||
      "community-placeholder.jpg"
    )}"
          alt="${escapeHTML(
      community.name ||
      "Community"
    )}"
          class="community-image"
          width="52"
          height="52">

        <div class="community-card-info">

          <h3>
            ${escapeHTML(
      community.name ||
      "Community"
    )}
          </h3>

          <p>
            ${escapeHTML(
      community.description ||
      "No description available."
    )}
          </p>

        </div>

      </div>


      <div class="community-card-bottom">

        <span class="community-members">

          ${formatMembers(
      members
    )}

        </span>


        <button
          class="community-join-button ${joined
        ? "joined"
        : ""
      }"
          type="button"
          data-community-id="${escapeHTML(
        community.id
      )}">

          ${joined
        ? "Joined"
        : "Join"
      }

        </button>

      </div>

    `;


    /*
     * Card → Details
     */

    article.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            ".community-join-button"
          )
        ) {

          return;

        }


        openDetails(
          community.id
        );

      }
    );


    /*
     * Join button
     */

    const joinButton =
      article.querySelector(
        ".community-join-button"
      );


    if (joinButton) {

      joinButton.addEventListener(
        "click",
        event => {

          event.preventDefault();
          event.stopPropagation();


          joinCommunity(
            community.id
          );

        }
      );

    }


    return article;

  }


  /*
   * =========================
   * GLOBAL COMMUNITIES
   * =========================
   */

  function renderGlobalCommunities() {

    if (!globalGrid) {
      return;
    }


    globalGrid.innerHTML = "";


    const query =
      searchInput
        ? searchInput.value
          .trim()
          .toLowerCase()
        : "";


    const filtered =
      communities.filter(
        community => {

          const categoryMatch =
            activeCategory === "all" ||
            community.category ===
            activeCategory;


          const name =
            String(
              community.name || ""
            ).toLowerCase();


          const description =
            String(
              community.description || ""
            ).toLowerCase();


          const searchMatch =
            !query ||
            name.includes(query) ||
            description.includes(query);


          return (
            categoryMatch &&
            searchMatch
          );

        }
      );


    filtered.forEach(
      community => {

        globalGrid.appendChild(
          createCommunityCard(
            community
          )
        );

      }
    );


    if (globalCount) {

      globalCount.textContent =
        String(
          filtered.length
        );

    }


    if (globalEmpty) {

      globalEmpty.hidden =
        filtered.length !== 0;

    }

  }


  /*
   * =========================
   * YOUR COMMUNITIES
   * =========================
   */

  function renderYourCommunities() {

    if (
      !yourGrid ||
      !yourSection
    ) {

      return;

    }


    yourGrid.innerHTML = "";


    const joined =
      communities.filter(
        community =>
          isJoined(
            community.id
          )
      );


    if (
      yourCount
    ) {

      yourCount.textContent =
        String(
          joined.length
        );

    }


    if (
      joined.length === 0
    ) {

      yourSection.hidden =
        true;


      if (yourEmpty) {

        yourEmpty.hidden =
          false;

      }


      return;

    }


    yourSection.hidden =
      false;


    if (yourEmpty) {

      yourEmpty.hidden =
        true;

    }


    joined.forEach(
      community => {

        yourGrid.appendChild(
          createCommunityCard(
            community
          )
        );

      }
    );

  }


  /*
   * =========================
   * JOIN / LEAVE
   * =========================
   */

  function joinCommunity(id) {

    const community =
      communities.find(
        item =>
          String(
            item.id
          ) ===
          String(id)
      );


    if (!community) {
      return;
    }


    const communityId =
      String(
        community.id
      );


    /*
     * LEAVE
     */

    if (
      isJoined(
        communityId
      )
    ) {

      const index =
        joinedCommunities.indexOf(
          communityId
        );


      if (index !== -1) {

        joinedCommunities.splice(
          index,
          1
        );

      }


      savedMembers[
        communityId
      ] =
        Math.max(
          0,
          getMembers(
            community
          ) - 1
        );


      saveState();


      renderGlobalCommunities();

      renderYourCommunities();


      if (
        currentCommunityId ===
        communityId
      ) {

        updateDetail(
          community
        );

      }


      return;

    }


    /*
     * JOIN
     */

    joinedCommunities.push(
      communityId
    );


    savedMembers[
      communityId
    ] =
      getMembers(
        community
      ) + 1;


    if (!saveState()) {

      joinedCommunities =
        joinedCommunities.filter(
          item =>
            item !== communityId
        );

      delete savedMembers[
        communityId
      ];

      return;

    }


    renderGlobalCommunities();

    renderYourCommunities();


    if (
      currentCommunityId ===
      communityId
    ) {

      updateDetail(
        community
      );

    }

  }


  /*
   * =========================
   * DETAILS
   * =========================
   */

  function openDetails(id) {

    const community =
      communities.find(
        item =>
          String(
            item.id
          ) ===
          String(id)
      );


    if (
      !community ||
      !detailOverlay
    ) {

      return;

    }


    currentCommunityId =
      String(
        community.id
      );


    updateDetail(
      community
    );


    detailOverlay.hidden =
      false;


    document.body.style.overflow =
      "hidden";

  }


  function updateDetail(
    community
  ) {

    const joined =
      isJoined(
        community.id
      );


    if (detailImage) {

      detailImage.src =
        community.image ||
        "community-placeholder.jpg";

      detailImage.alt =
        community.name ||
        "Community";

    }


    if (detailTitle) {

      detailTitle.textContent =
        community.name ||
        "Community";

    }


    if (detailDescription) {

      detailDescription.textContent =
        community.description ||
        "No description available.";

    }


    if (detailCategory) {

      detailCategory.textContent =
        getCategoryName(
          community.category
        );

    }


    if (detailMembers) {

      detailMembers.textContent =
        String(
          getMembers(
            community
          )
        );

    }


    if (detailStatus) {

      detailStatus.textContent =
        joined
          ? "Joined"
          : "Not joined";

    }


    if (detailJoin) {

      detailJoin.textContent =
        joined
          ? "Joined"
          : "Join";


      detailJoin.classList.toggle(
        "joined",
        joined
      );


      detailJoin.dataset.communityId =
        String(
          community.id
        );

    }

  }
  /*
 * =========================
 * CLOSE DETAILS
 * =========================
 */

  function closeDetails() {

    if (!detailOverlay) {
      return;
    }

    detailOverlay.hidden = true;

    currentCommunityId = null;

    document.body.style.overflow = "";

  }


  /*
   * =========================
   * DETAIL JOIN BUTTON
   * =========================
   */

  if (detailJoin) {

    detailJoin.addEventListener(
      "click",
      event => {

        event.preventDefault();
        event.stopPropagation();

        const id =
          detailJoin.dataset.communityId;

        if (!id) {
          return;
        }

        joinCommunity(id);

      }
    );

  }


  /*
   * =========================
   * CLOSE DETAIL
   * =========================
   */

  if (detailClose) {

    detailClose.addEventListener(
      "click",
      closeDetails
    );

  }


  if (detailOverlay) {

    detailOverlay.addEventListener(
      "click",
      event => {

        if (
          event.target ===
          detailOverlay
        ) {

          closeDetails();

        }

      }
    );

  }


  /*
   * =========================
   * ESC KEY
   * =========================
   */

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape" &&
        detailOverlay &&
        !detailOverlay.hidden
      ) {

        closeDetails();

      }

    }
  );


  /*
   * =========================
   * SEARCH
   * =========================
   */

  if (searchInput) {

    searchInput.addEventListener(
      "input",
      renderGlobalCommunities
    );

  }


  /*
   * =========================
   * CATEGORY FILTER
   * =========================
   */

  filters.forEach(
    filter => {

      filter.addEventListener(
        "click",
        () => {

          filters.forEach(
            item => {

              item.classList.remove(
                "active"
              );

            }
          );


          filter.classList.add(
            "active"
          );


          activeCategory =
            filter.dataset.category ||
            "all";


          renderGlobalCommunities();

        }
      );

    }
  );


  /*
   * =========================
   * COMMUNITY TABS
   * =========================
   */

  const yourCommunitiesTab =
    document.getElementById(
      "yourCommunitiesTab"
    );

  const globalCommunitiesTab =
    document.getElementById(
      "globalCommunitiesTab"
    );

  const globalCommunitiesSection =
    document.querySelector(
      ".global-communities-section"
    );


  function showCommunitySection(
    section
  ) {

    if (
      !yourSection ||
      !globalCommunitiesSection
    ) {

      return;

    }


    const showYour =
      section === "your";


    yourSection.hidden =
      !showYour;


    globalCommunitiesSection.hidden =
      showYour;


    if (yourCommunitiesTab) {

      yourCommunitiesTab.classList.toggle(
        "active",
        showYour
      );


      yourCommunitiesTab.setAttribute(
        "aria-selected",
        String(showYour)
      );

    }


    if (globalCommunitiesTab) {

      globalCommunitiesTab.classList.toggle(
        "active",
        !showYour
      );


      globalCommunitiesTab.setAttribute(
        "aria-selected",
        String(!showYour)
      );

    }


    if (showYour) {

      renderYourCommunities();

    }

  }


  /*
   * YOUR COMMUNITIES TAB
   */

  if (yourCommunitiesTab) {

    yourCommunitiesTab.addEventListener(
      "click",
      () => {

        showCommunitySection(
          "your"
        );

      }
    );

  }


  /*
   * GLOBAL COMMUNITIES TAB
   */

  if (globalCommunitiesTab) {

    globalCommunitiesTab.addEventListener(
      "click",
      () => {

        showCommunitySection(
          "global"
        );

      }
    );

  }


  /*
   * =========================
   * INITIAL RENDER
   * =========================
   */

  renderGlobalCommunities();


  /*
   * Global Communities
   * is the default tab.
   */

  if (
    yourSection
  ) {

    yourSection.hidden =
      true;

  }


  if (
    yourEmpty
  ) {

    yourEmpty.hidden =
      false;

  }


  if (
    globalCommunitiesSection
  ) {

    globalCommunitiesSection.hidden =
      false;

  }


  if (
    globalCommunitiesTab
  ) {

    globalCommunitiesTab.classList.add(
      "active"
    );

    globalCommunitiesTab.setAttribute(
      "aria-selected",
      "true"
    );

  }


  if (
    yourCommunitiesTab
  ) {

    yourCommunitiesTab.classList.remove(
      "active"
    );

    yourCommunitiesTab.setAttribute(
      "aria-selected",
      "false"
    );

  }

});