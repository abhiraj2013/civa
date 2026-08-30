/* =========================
   CIVA EDIT PROFILE
========================= */

const editForm =
  document.getElementById("editProfileForm");

const nameInput =
  document.getElementById("editName");

const usernameInput =
  document.getElementById("editUsername");

const bioInput =
  document.getElementById("editBio");

const bioCount =
  document.getElementById("bioCount");

const message =
  document.getElementById("editMessage");

const profileImage =
  document.getElementById("editProfileImage");

const changeImageButton =
  document.getElementById("changeProfileImage");

const imageInput =
  document.getElementById("profileImageInput");


/*
 * =========================
 * TEMPORARY PROFILE STORAGE
 * =========================
 */

const EDIT_PROFILE_KEY =
  "civa-edit-profile";


let profileData =
  JSON.parse(
    localStorage.getItem(
      EDIT_PROFILE_KEY
    ) || "{}"
  );


/*
 * =========================
 * LOAD PROFILE
 * =========================
 */

function loadProfile() {

  if (nameInput) {
    nameInput.value =
      profileData.name || "";
  }

  if (usernameInput) {
    usernameInput.value =
      profileData.username || "";
  }

  if (bioInput) {
    bioInput.value =
      profileData.bio || "";
  }

  if (
    profileData.image &&
    profileImage
  ) {
    profileImage.src =
      profileData.image;
  }

  updateBioCount();
}


/*
 * =========================
 * BIO COUNTER
 * =========================
 */

function updateBioCount() {

  if (!bioInput || !bioCount) {
    return;
  }

  bioCount.textContent =
    `${bioInput.value.length}/160`;

}


if (bioInput) {

  bioInput.addEventListener(
    "input",
    updateBioCount
  );

}


/*
 * =========================
 * CHANGE PHOTO
 * =========================
 */

if (changeImageButton && imageInput) {

  changeImageButton.addEventListener(
    "click",
    () => {
      imageInput.click();
    }
  );

}


if (imageInput) {

  imageInput.addEventListener(
    "change",
    () => {

      const file =
        imageInput.files?.[ 0 ];

      if (!file) {
        return;
      }

      if (!file.type.startsWith("image/")) {
        return;
      }

      const reader =
        new FileReader();

      reader.onload = () => {

        const image =
          reader.result;

        if (profileImage) {
          profileImage.src = image;
        }

        profileData.image =
          image;

      };

      reader.readAsDataURL(file);

    }
  );

}


/*
 * =========================
 * SAVE PROFILE
 * =========================
 */

if (editForm) {

  editForm.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      const name =
        nameInput.value.trim();

      const username =
        usernameInput.value.trim();

      const bio =
        bioInput.value.trim();


      if (!name) {

        if (message) {
          message.textContent =
            "Please enter your name.";
        }

        nameInput.focus();

        return;
      }


      profileData.name =
        name.slice(0, 50);

      profileData.username =
        username.slice(0, 30);

      profileData.bio =
        bio.slice(0, 160);


      localStorage.setItem(
        EDIT_PROFILE_KEY,
        JSON.stringify(profileData)
      );
      /* =========================
   SYNC WITH CIVA DATA
========================= */

      if (window.CIVAData) {

        const currentAccount =
          CIVAData.getAccount() || {};

        CIVAData.setAccount({

          ...currentAccount,

          name: profileData.name || "",

          username:
            profileData.username || "",

          bio:
            profileData.bio || "",

          image:
            profileData.image || ""

        });

      }


      if (message) {

        message.textContent =
          "Profile updated successfully.";

      }


      setTimeout(
        () => {

          window.location.href =
            "profile.html";

        },
        600
      );

    }
  );

}


/*
 * =========================
 * FIRST LOAD
 * =========================
 */

loadProfile();