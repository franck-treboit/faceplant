import apiService from "./api-service.js";

const form = document.getElementById("form_create_style");
const tableBody = document.querySelector(".tabler .body");
const wikiURL = document.getElementById("wikiURL");
const name = document.getElementById("name");

var updateMode = false;
var updateId = null;

function handleEditStyle(evt) {
  updateMode = true;
  updateId = evt.target.getAttribute("data-style-id");

  apiService
    .get(`/styles/${updateId}`)
    .then(apiRes => updateEditForm(apiRes.data))
    .catch(apiErr => console.log(apiErr));
}

function createNewStyle(evt) {
  // evt is the full event (object)
  evt.preventDefault(); // prevent the default page refresh ...
  if (!name.value) return; // prevent empty name insertion

  apiService
    .post("/styles/create", {
      name: name.value,
      wikiURL: wikiURL.value
    })
    .then(apiRes => {
      addTableRow(apiRes.data);
      updateEditForm();
      listenButtons();
    })
    .catch(apiErr => {
      console.error(apiErr);
    });
}

function updateStyle(evt) {
  // do some code here
  const styleId = evt.target.getAttribute("data-style-id");

  evt.preventDefault(); // prevent default page refresh ...
  apiService
    .patch(`/styles/update/${styleId}`, {
      name: name.value,
      wikiURL: wikiURL.value
    })
    .then(apiRes => {
      editTableRow(apiRes.data);
      updateEditForm();
    })
    .catch(apiErr => {
      console.log(apiErr);
    });
}

function updateEditForm(fetchedStyle) {
  wikiURL.value = fetchedStyle ? fetchedStyle.wikiURL : "";
  name.value = fetchedStyle ? fetchedStyle.name : "";
}

function addTableRow(newStyle) {
  const tpl = `<tr>
    <td class="name">${newStyle.name}</td>
      <td>
        <a href="${newStyle.wikiURL}" target="_blank">
            <i class="fa fa-link"></i>
        </a>
    </td>
    <td>
        <a class="btn edit" data-style-id="${newStyle._id}">
            <i class="no-pointer-events fas fa-pen"></i>
        </a>
    </td>
    <td>
        <a href="/delete-style/${newStyle._id}">
            <i class="fa fa-times"></i>
        </a>
    </td>
  </tr>`;
  tableBody.innerHTML += tpl;
}

function editTableRow(updatedStyle) {
  console.log(`[data-row-style-id="${updateId}"]`)
  const row = document.querySelector(`[data-row-style-id="${updateId}"]`);
  const name = row.querySelector(".name");
  const wikiURL = row.querySelector(".wikiURL");
  name.textContent = updatedStyle.name;
  wikiURL.href = updatedStyle.wikiURL;
  updateMode = false;
  updateId = null;
}

form.onsubmit = evt => {
  updateMode ? updateStyle(evt) : createNewStyle(evt);
};

function listenButtons() {
  const editBtns = document.querySelectorAll(".btn.edit");
  editBtns.forEach(btn => {
    btn.onclick = handleEditStyle;
  });
}

listenButtons();
