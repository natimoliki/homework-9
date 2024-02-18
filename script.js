"use strict";

const postWraper = document.getElementById("postWraper");
const postOverlay = document.getElementById("overLay");
const contentBlock = document.getElementById("content");
const closeOverlay = document.getElementById("close");
const btnAdd = document.getElementById("add");
const addOverlay = document.getElementById("addOverlay");
const form = document.getElementById("formAddOverlay");

function ajax(url, callback) {
  fetch(url, {
    method: "GET",
  })
    .then(function (response) {
      if (response.status !== 200) {
        throw response.status;
      }
      return response.json();
    })
    .then(function (responseData) {
      callback(responseData);
    })
    .catch(function (error) {
      if (error === 404) {
        console.log("Page Not Found");
      } else if (error === 500) {
        console.log("Internal Error");
      }
    });
}

ajax("https://jsonplaceholder.typicode.com/posts", function (data) {
  data.forEach((element) => {
    createComments(element);
  });
});

function createComments(item) {
  const divContainer = document.createElement("div");
  divContainer.classList.add("comments");
  divContainer.setAttribute("data-id", item.id);

  const h3Post = document.createElement("h3");
  h3Post.innerText = item.id;

  const h2Post = document.createElement("h2");
  h2Post.innerText = item.title;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "პოსტის წაშლა";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.setAttribute("data-id", item.id);

  divContainer.appendChild(h3Post);
  divContainer.appendChild(h2Post);
  divContainer.appendChild(deleteBtn);

  deleteBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    const deleteId = e.target.getAttribute("data-id");
    console.log(deleteId);
    const deleteUrl = `https://jsonplaceholder.typicode.com/posts/${deleteId}`;
    console.log(deleteUrl);
    fetch(deleteUrl, {
      method: "DELETE",
    }).then(function (deletedData) {
      console.log(deletedData);
      divContainer.remove();
    });
  });

  divContainer.addEventListener("click", function () {
    console.log(this);
    const postId = this.getAttribute("data-id");
    console.log(postId);
    postOverlay.classList.add("activeOverlay");
    const newUrl = `https://jsonplaceholder.typicode.com/posts/${postId}`;
    console.log(newUrl);
    ajax(newUrl, function (elementNew) {
      overlayInfo(elementNew);
    });
  });

  postWraper.appendChild(divContainer);
}

function overlayInfo(item) {
  const pDescr = document.createElement("p");
  pDescr.innerText = item.body;
  pDescr.classList.add("pdescstyle");

  contentBlock.appendChild(pDescr);
}

closeOverlay.addEventListener("click", function () {
  postOverlay.classList.remove("activeOverlay");
  contentBlock.innerHTML = " ";
});

btnAdd.addEventListener("click", function () {
  addOverlay.classList.add("ActiveAdd");
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log(e.target[0].value);
  let formdataSend = {
    title: e.target[0].value,
    userId: 11,
  };

  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify(formdataSend),
    headers: {
      "content-type": "application/json; charset=UTF-8",
    },
  })
  .then((response) => response.json())
  .then ((SendedObj) => {
    createComments (SendedObj);
    e.target[0].value = '';
    addOverlay.classList.remove('ActiveAdd');
  });
});
