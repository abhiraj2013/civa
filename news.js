"use strict";

document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     ELEMENTS
  ========================= */

  const searchInput =
    document.getElementById("newsSearch");

  const filters =
    document.querySelectorAll(".news-filter");

  const newsGrid =
    document.querySelector(".news-grid");

  const emptyMessage =
    document.getElementById("newsEmpty");

  const refreshButton =
    document.getElementById("newsRefresh");

  const publishNewsBtn =
    document.getElementById("publishNewsBtn");


  let currentCategory = "all";


  /* =========================
     SAFE HTML
  ========================= */

  function escapeHTML(value) {

    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  }


  /* =========================
     LOAD SAVED NEWS
  ========================= */

  function loadSavedNews() {

    if (!newsGrid) return;

    let savedNews = [];

    try {

      const data =
        JSON.parse(
          localStorage.getItem("civaNews") || "[]"
        );

      if (Array.isArray(data)) {
        savedNews = data;
      }

    } catch {

      savedNews = [];

    }


    savedNews.forEach(news => {

      if (!news || !news.id) return;


      const alreadyExists =
        newsGrid.querySelector(
          `[data-news-id="${CSS.escape(news.id)}"]`
        );


      if (alreadyExists) return;


      const card =
        document.createElement("article");

      card.className = "news-card";
      card.dataset.newsId = news.id;
      card.dataset.category =
        news.category || "all";

      card.dataset.search =
        [
          news.title,
          news.content,
          news.category,
          news.author
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();


      const imageHTML =
        news.image
          ? `
            <div class="news-image-wrapper">
              <img
                src="${escapeHTML(news.image)}"
                alt="${escapeHTML(news.title || "News image")}"
                class="news-image"
                loading="lazy"
              >
            </div>
          `
          : "";


      const category =
        news.category || "News";


      const author =
        news.author || "CIVA User";


      const dateText =
        news.createdAt
          ? formatNewsDate(news.createdAt)
          : "Recently";


      card.innerHTML = `
        <a
          href="#"
          class="news-card-link"
          aria-label="${escapeHTML(news.title || "Open news")}"
        >

          ${imageHTML}

          <div class="news-card-body">

            <span class="news-card-category">
              ${escapeHTML(category)}
            </span>

            <p class="news-card-meta">
              ${escapeHTML(author)} · ${escapeHTML(dateText)}
            </p>

            <h3>
              ${escapeHTML(news.title || "Untitled news")}
            </h3>

            <p class="news-card-text">
              ${escapeHTML(news.content || "")}
            </p>

          </div>

        </a>
      `;


      newsGrid.prepend(card);

    });

  }


  /* =========================
     DATE FORMAT
  ========================= */

  function formatNewsDate(date) {

    const parsedDate =
      new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Recently";
    }

    return parsedDate.toLocaleDateString(
      undefined,
      {
        day: "numeric",
        month: "short",
        year: "numeric"
      }
    );

  }


  /* =========================
     FILTER NEWS
  ========================= */

  function filterNews() {

    const searchText =
      searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    const cards =
      document.querySelectorAll(".news-card");

    let visibleCount = 0;


    cards.forEach(card => {

      const category =
        (card.dataset.category || "").toLowerCase();

      const searchData =
        (card.dataset.search || "").toLowerCase();

      const title =
        card.querySelector("h3")
          ?.textContent
          .toLowerCase() || "";

      const text =
        card.querySelector(".news-card-text")
          ?.textContent
          .toLowerCase() || "";


      const categoryMatch =
        currentCategory === "all" ||
        category === currentCategory;


      const searchMatch =
        !searchText ||
        searchData.includes(searchText) ||
        title.includes(searchText) ||
        text.includes(searchText);


      const visible =
        categoryMatch && searchMatch;


      card.hidden = !visible;


      if (visible) {
        visibleCount++;
      }

    });


    if (emptyMessage) {

      emptyMessage.hidden =
        visibleCount !== 0;

    }

  }


  /* =========================
     FILTER BUTTONS
  ========================= */

  filters.forEach(filter => {

    filter.addEventListener("click", () => {

      currentCategory =
        filter.dataset.category || "all";


      filters.forEach(item => {
        item.classList.remove("active");
      });


      filter.classList.add("active");


      filterNews();

    });

  });


  /* =========================
     SEARCH
  ========================= */

  if (searchInput) {

    searchInput.addEventListener(
      "input",
      filterNews
    );

  }


  /* =========================
     REFRESH
  ========================= */

  if (refreshButton) {

    refreshButton.addEventListener(
      "click",
      () => {

        refreshButton.classList.add(
          "is-loading"
        );


        setTimeout(() => {

          loadSavedNews();
          filterNews();

          refreshButton.classList.remove(
            "is-loading"
          );

        }, 500);

      }
    );

  }


  /* =========================
     NEWS LINKS
  ========================= */

  document.addEventListener(
    "click",
    event => {

      const link =
        event.target.closest(
          ".news-card-link"
        );


      if (!link) return;


      const href =
        link.getAttribute("href");


      if (!href || href === "#") {
        event.preventDefault();
      }

    }
  );


  /* =========================
     CREATE NEWS BUTTON
  ========================= */

  if (publishNewsBtn) {

    publishNewsBtn.addEventListener(
      "click",
      () => {

        window.location.href =
          "create-news.html";

      }
    );

  }


  /* =========================
     INITIALIZE
  ========================= */

  loadSavedNews();

  filterNews();

});
/* Advanced News Search */
document.addEventListener("DOMContentLoaded", () => {

  const search = document.getElementById("newsSearch");

  if (!search) return;

  search.addEventListener("input", () => {

    const query = search.value
      .trim()
      .toLowerCase();

    document.querySelectorAll(".news-card").forEach(card => {

      const text = card.textContent
        .toLowerCase();

      const matches = !query || text.includes(query);

      card.hidden = !matches;

    });

  });

});