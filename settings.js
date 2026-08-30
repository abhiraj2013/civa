/* =========================
   CIVA SETTINGS
========================= */

const clearLocalDataButton =
  document.getElementById(
    "clearLocalDataButton"
  );

const settingsMessage =
  document.getElementById(
    "settingsMessage"
  );


/*
 * =========================
 * CLEAR LOCAL DATA
 * =========================
 *
 * IMPORTANT:
 * Abhi ye sirf temporary/local
 * CIVA data clear karega.
 *
 * Final account connection ke time
 * is list ko existing storage keys
 * ke according update karenge.
 */

if (clearLocalDataButton) {

  clearLocalDataButton.addEventListener(
    "click",
    () => {

      const confirmed =
        window.confirm(
          "Clear locally saved CIVA data from this browser?"
        );

      if (!confirmed) {
        return;
      }


      /*
       * Temporary edit-profile data
       */

      localStorage.removeItem(
        "civa-edit-profile"
      );


      /*
       * Existing community data
       */

      localStorage.removeItem(
        "civa-joined-communities"
      );

      localStorage.removeItem(
        "civa-community-members"
      );


      /*
       * Show result
       */

      if (settingsMessage) {

        settingsMessage.textContent =
          "Local CIVA data cleared.";

      }

    }
  );

}