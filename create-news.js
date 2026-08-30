"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const form =
    document.getElementById(
      "createNewsForm"
    );

  const titleInput =
    document.getElementById(
      "newsTitle"
    );

  const contentInput =
    document.getElementById(
      "newsContent"
    );

  const imageInput =
    document.getElementById(
      "newsImage"
    );

  const imagePreview =
    document.getElementById(
      "newsImagePreview"
    );


  if (!form) {
    return;
  }


  /* =========================
     ACCOUNT CHECK
  ========================= */

  function isLoggedIn() {

    const possibleKeys = [
      "civaLoggedIn",
      "isLoggedIn",
      "civa-account",
      "civaAccount"
    ];


    for (const key of possibleKeys) {

      const value =
        localStorage.getItem(key);


      if (
        value === "true" ||
        value === "loggedIn" ||
        value === "1"
      ) {

        return true;

      }


      if (!value) {
        continue;
      }


      try {

        const data =
          JSON.parse(value);


        if (
          data &&
          (
            data.loggedIn === true ||
            data.isLoggedIn === true
          )
        ) {

          return true;

        }

      } catch {

        /* Normal string value */

      }

    }


    return false;

  }


  /* =========================
     IMAGE PREVIEW
  ========================= */

  if (imageInput) {

    imageInput.addEventListener(
      "change",
      () => {

        const file =
          imageInput.files?.[ 0 ];


        if (!file) {

          if (imagePreview) {

            imagePreview.src =
              "";

            imagePreview.style.display =
              "none";

          }

          return;

        }


        if (
          !file.type.startsWith(
            "image/"
          )
        ) {

          alert(
            "Please select a valid image."
          );

          imageInput.value =
            "";

          return;

        }


        const reader =
          new FileReader();


        reader.onload =
          event => {

            if (!imagePreview) {
              return;
            }


            imagePreview.src =
              event.target.result;

            imagePreview.style.display =
              "block";

          };


        reader.readAsDataURL(file);

      }
    );

  }


  /* =========================
     PUBLISH NEWS
  ========================= */

  form.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      /* Account required */

      if (!isLoggedIn()) {

        const createAccount =
          confirm(
            "You need a CIVA account to publish news.\n\nCreate or login to your account?"
          );


        if (createAccount) {

          window.location.href =
            "account.html";

        }

        return;

      }


      const title =
        titleInput
          ? titleInput.value.trim()
          : "";


      const content =
        contentInput
          ? contentInput.value.trim()
          : "";


      const imageFile =
        imageInput?.files?.[ 0 ] ||
        null;


      /* Validation */

      if (!title) {

        alert(
          "Please enter the news title."
        );

        if (titleInput) {
          titleInput.focus();
        }

        return;

      }


      if (!content) {

        alert(
          "Please enter the news content."
        );

        if (contentInput) {
          contentInput.focus();
        }

        return;

      }


      /* Unique ID */

      const newsId =
        "news-" +
        Date.now() +
        "-" +
        Math.random()
          .toString(36)
          .slice(2, 8);


      /* Save with image */

      if (imageFile) {

        if (
          !imageFile.type.startsWith(
            "image/"
          )
        ) {

          alert(
            "Please select a valid image."
          );

          return;

        }


        const reader =
          new FileReader();


        reader.onload =
          event => {

            saveNews(
              newsId,
              title,
              content,
              event.target.result
            );

          };


        reader.onerror =
          () => {

            alert(
              "The image could not be processed. Please try again."
            );

          };


        reader.readAsDataURL(
          imageFile
        );


        return;

      }


      /* Save without image */

      saveNews(
        newsId,
        title,
        content,
        ""
      );

    }
  );


  /* =========================
     SAVE NEWS
  ========================= */

  function saveNews(
    newsId,
    title,
    content,
    image
  ) {

    let existingNews = [];


    try {

      const stored =
        JSON.parse(
          localStorage.getItem(
            "civaNews"
          ) || "[]"
        );


      if (Array.isArray(stored)) {

        existingNews =
          stored;

      }

    } catch {

      existingNews =
        [];

    }


    const newNews = {

      id: newsId,

      title: title,

      content: content,

      image: image,

      author: "CIVA User",

      createdAt:
        new Date().toISOString()

    };


    existingNews.unshift(
      newNews
    );


    try {

      localStorage.setItem(
        "civaNews",
        JSON.stringify(
          existingNews
        )
      );

    } catch {

      alert(
        "This news could not be saved. The browser may be out of storage space."
      );

      return;

    }


    alert(
      "Your news has been published successfully!"
    );


    window.location.href =
      "news.html";

  }

});