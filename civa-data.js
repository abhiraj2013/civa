/* =========================
   CIVA DATA LAYER
   MVP FOUNDATION
========================= */

(function() {

  "use strict";


  /* =========================
     MAIN STORAGE
  ========================= */

  const STORAGE_KEY =
    "civaData";


  /* =========================
     DEFAULT DATA
  ========================= */

  const defaultData = {
    account: null,

    posts: [],

    supports: [],

    comments: {},

    communities: [],

    joinedCommunities: [],

    news: []

  };


  /* =========================
     LOAD DATA
  ========================= */

  function loadData() {

    try {

      const saved =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (!saved) {

        return {
          ...defaultData
        };

      }

      const parsed =
        JSON.parse(saved);


      return {
        ...defaultData,
        ...parsed
      };

    } catch (error) {

      console.error(
        "CIVA data could not be loaded:",
        error
      );

      return {
        ...defaultData
      };

    }

  }


  /* =========================
     SAVE DATA
  ========================= */

  function saveData(data) {

    try {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
      );

      return true;

    } catch (error) {

      console.error(
        "CIVA data could not be saved:",
        error
      );

      return false;

    }

  }


  /* =========================
     GET DATA
  ========================= */

  function getData() {

    return loadData();

  }


  /* =========================
     UPDATE DATA
  ========================= */

  function updateData(updates) {

    const current =
      loadData();

    const updated = {
      ...current,
      ...updates
    };

    saveData(updated);

    return updated;

  }


  /* =========================
     CURRENT ACCOUNT
  ========================= */

  function getAccount() {

    return loadData().account;

  }


  function setAccount(account) {

    updateData({
      account: account
    });

  }


  /* =========================
     CLEAR ACCOUNT
  ========================= */

  function clearAccount() {

    updateData({
      account: null
    });

  }


  /* =========================
     PUBLIC CIVA API
  ========================= */

  window.CIVAData = {

    getData,

    saveData,

    updateData,

    getAccount,

    setAccount,

    clearAccount

  };


})();