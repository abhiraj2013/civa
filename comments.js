const commentForm =
  document.getElementById("commentForm");

const commentInput =
  document.getElementById("commentInput");

const commentsList =
  document.getElementById("commentsList");

const noComments =
  document.getElementById("noComments");


// Post ID URL se lena
const params =
  new URLSearchParams(window.location.search);

const postId =
  params.get("id") || "default-post";


// LocalStorage key
const storageKey =
  `civa-comments-${postId}`;


// Comments load karo
let comments =
  JSON.parse(
    localStorage.getItem(storageKey)
  ) || [];


// Comments display
function renderComments() {

  commentsList.innerHTML = "";


  if (comments.length === 0) {

    noComments.hidden = false;
    return;

  }


  noComments.hidden = true;


  comments.forEach((comment) => {

    const article =
      document.createElement("article");

    article.className =
      "comment-card";


    article.innerHTML = `

            <div class="comment-user">

                <img
                    src="profile-placeholder.jpg"
                    alt="Profile">

                <div>

                    <strong>
                        ${escapeHTML(comment.user)}
                    </strong>

                    <span class="comment-time">
                        ${escapeHTML(comment.time)}
                    </span>

                </div>

            </div>


            <p class="comment-text">
                ${escapeHTML(comment.text)}
            </p>

        `;


    commentsList.appendChild(article);

  });

}


// New comment
commentForm.addEventListener(
  "submit",
  function(event) {

    event.preventDefault();


    const text =
      commentInput.value.trim();


    if (!text) return;


    const newComment = {

      user: "CIVA User",

      text: text,

      time: new Date()
        .toLocaleString()

    };


    comments.unshift(newComment);


    localStorage.setItem(
      storageKey,
      JSON.stringify(comments)
    );


    commentInput.value = "";


    renderComments();

  }
);


// Basic HTML protection
function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}


// First load
renderComments();