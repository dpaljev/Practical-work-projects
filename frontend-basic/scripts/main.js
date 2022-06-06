// Vratiti done na constructora --- DONE
// Napraviti listu di su svi false --- DONE
// pri checku stavit da false postane true --- DONE .... too many errors... far too many
// home btn pokazuje done == false --- Prepare for trouble,
// done btn prikazune done == true --- Make it double!
// make function that clears html ------ DONE
// make function that creates sorted html  ---- DONE
// AAAAAAAAAAAAAAAAAAA IM GOING INSANE!!!!!!!!! ---- ALWAYS HAVE BEEN
// Make it look nice --- NO
// add checkboxes to home --- DOwOne
//  hide automatically when checked --- DONE
// add notification if i wanna check it --- DONE
// CHANGE: plez no notification, makes the checkbox act weird --- kk, no scary notification
//  so.... make a submit button --- DONE
//  Fix shit so i can check when it in home page --- DONE
//  add shit for inputing new info ---- DONE!!!!!!!!!!!!!!
// if home page has no more tasks display msg that says its empty --- done
//  add X button na done page da se totalno makne --- holy shit ovo je sjebano do kraja --- DONE
// add search bar for tasks, includes ---- Done
// add sort button by time, ascending and onclick it goes to descending ---- DONE
// Fix issue --------DONE
// make it so search auto shows items on key-down... or up... idfk lmao ----- DONE

// on 2nd sort flip sign

const submitButton = document.createElement("div");
submitButton.innerHTML = `
  <div id="sbmitbtn" style= "font-size: 30px; color: black; padding: 20px; margin: auto; background: darkgray; cursor: pointer; height: 90px; width: 150px;";>
    Submit
  </div>
`;

// Color changer for buttons
const doneBtn = document.getElementById("done-btn");
const btnHome = document.getElementById("home-btn");

btnHome.addEventListener("click", function () {
  btnHome.style.backgroundColor = "yellow";
  doneBtn.style.backgroundColor = "gray";
});

doneBtn.addEventListener("click", function () {
  doneBtn.style.backgroundColor = "yellow";
  btnHome.style.backgroundColor = "gray";
});

// Time format
function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

function formatDate(date) {
  return `${[
    padTo2Digits(date.getDate()),
    padTo2Digits(date.getMonth() + 1),
    date.getFullYear(),
  ].join(".")} ${[
    padTo2Digits(date.getHours()),
    padTo2Digits(date.getMinutes()),
  ].join(":")}`;
}

// Create the add button
function createAdd() {
  const elementAdd = document.createElement("div");
  elementAdd.innerHTML = `
    <button id="sortingButton" class="sortBtn" onclick="sortBtn()">
      <i class="fa fa-sort-amount-desc"></i>
    </button>
    <input type="text" id="myInput" placeholder="Title...">
    <span onclick="newElement()" class="addBtn">
      Add
    </span>
  `;
  document.getElementById("inputBox").appendChild(elementAdd);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// Adds items when submitted
function newElement() {
  const inputValue = document.getElementById("myInput").value;
  if (inputValue === "") {
    alert("You must write something!");
  } else {
    let randomInt = getRandomInt(9999);
    const newItem = new TodoItem(
      randomInt,
      inputValue,
      formatDate(new Date()),
      false
    );
    items.push(newItem);
    localStorage.setItem("items", JSON.stringify(items));

    wipeHtml();
    generateUi();
    document.getElementById("myInput").value = "";
  }
}

// Sort by date function
// TODO: Needs work
function rotateSort() {
  const sortingBtn = document.getElementById("sortingButton");
  sortingBtn.style.transform = "rotate(180deg)";
}

function sortBtn() {
  const firstElem = new Date(items[0].createdAt).getTime;
  const lastElem = new Date(items[items.length - 1].createdAt).getTime;
  let sortFn = null;

  if (firstElem < lastElem) {
    sortFn = (a, b) => {
      let dateA = new Date(a.createdAt).getTime();
      let dateB = new Date(b.createdAt).getTime();
      return dateA < dateB ? 1 : -1;
    };
  } else {
    sortFn = (a, b) => {
      let dateA = new Date(a.createdAt).getTime();
      let dateB = new Date(b.createdAt).getTime();
      return dateA > dateB ? 1 : -1;
    };
  }

  items.sort(sortFunction);
  localStorage.setItem("items", JSON.stringify(items));

  wipeHtml();
  generateUi();
  rotateSort();
}

// Sort text function
function sortTextBtn() {
  const inputValue = document.getElementById("searchedItems").value;
  const doneElem = items.filter((x) => x.done == false);
  const searchedItems = doneElem.filter((x) =>
    x.description.includes(inputValue)
  );
  wipeHtml();
  createAdd();
  document.getElementById("sbmitbtns").appendChild(submitButton);
  searchedItems.forEach((x) => {
    const element = document.createElement("div");
    element.innerHTML = `
    <div id=${x.id} class = container>
      ${x.description}
      <br>
      <span class="creation">Created on: ${x.createdAt}</span>
      <input class="todo-item-checkbox" type="checkbox" />
    </div>
    `;
    document.getElementById("checkBoxCont").append(element);
  });
  handleCheckboxChanges();
}

// Constructor
class TodoItem {
  constructor(id, description, createdAt, done) {
    this.id = id;
    this.description = description;
    this.createdAt = createdAt;
    this.done = done;
  }
}

// Giving constructor items to work with
let items = JSON.parse(localStorage.getItem("items"));

// Create items
function generateUi() {
  document.getElementById("sbmitbtns").appendChild(submitButton);
  createAdd();

  const doneElem = items.filter((x) => x.done == false);

  if (doneElem == "") {
    const emptySh = document.createElement("div");
    emptySh.innerHTML = `
      <div id="emptyText">
        Ya did everything... now this page is empty... congrats!
      </div>
    `;
    document.getElementById("checkBoxCont").append(emptySh);
  } else {
    doneElem.forEach((x) => {
      const element = document.createElement("div");
      element.innerHTML = `
          <div id=${x.id} class = container>ž
            ${x.description}
            <br>
            <span class="creation">Created on: ${x.createdAt}</span>
            <input class="todo-item-checkbox" type="checkbox" />
          </div>
        `;
      document.getElementById("checkBoxCont").append(element);
    });
    document.getElementById("searchedItems").value = "";
    handleCheckboxChanges();
  }
}

// Function for creating done shit
function createHtmlDone() {
  const doneElem = items.filter((x) => x.done == true);
  doneElem.forEach((x) => {
    const element = document.createElement("div");
    element.innerHTML = `
      <div id=${x.id} class = container> ${x.description}
        <br>
        <span class="creation">Created on: ${x.createdAt}</span>
        <span class="xbtn"> X </span>
      </div>
    `;
    document.getElementById("checkBoxCont").append(element);
  });

  // Click on a close button to hide the current list item
  const close = document.getElementsByClassName("xbtn");

  [...close].forEach((x) => {
    x.addEventListener("click", function () {
      const parentOfBtn = x.parentElement;
      const itemForRemovalIdx = items.findIndex((x) => x.id == parentOfBtn.id);
      if (itemForRemovalIdx !== -1) {
        items.splice(itemForRemovalIdx, 1);
        localStorage.setItem("items", JSON.stringify(items));
        wipeHtml();
        createHtmlDone();
      }
    });
  });
}

// Function for wiping html
function wipeHtml() {
  const allHtmn = document.getElementById("checkBoxCont");
  while (allHtmn.firstChild) {
    allHtmn.removeChild(allHtmn.lastChild);
  }
  const allsbmits = document.getElementById("sbmitbtns");
  while (allsbmits.firstChild) {
    allsbmits.removeChild(allsbmits.lastChild);
  }
  const addbutton = document.getElementById("inputBox");
  while (addbutton.firstChild) {
    addbutton.removeChild(addbutton.lastChild);
  }
}

// Checker and hiding checked items
function handleCheckboxChanges() {
  [...document.getElementsByClassName("todo-item-checkbox")].forEach(
    (todoCheckbox) => {
      todoCheckbox.addEventListener("change", function () {
        if (todoCheckbox.checked) {
          const ident = todoCheckbox.parentElement.id++;
          submitButton.addEventListener("click", function () {
            items.forEach((items) => {
              if (items.id == ident) {
                items.done = true;
              }
            });
            localStorage.setItem("items", JSON.stringify(items));
            wipeHtml();
            generateUi();
          });
        }
      });
    }
  );
}

// Function for sorting for home and done buttons
function generateList(done) {
  if (done) {
    const doneElem = items.filter((x) => x.done == true);
    wipeHtml();
    createHtmlDone();
  } else {
    const doneElem = items.filter((x) => x.done == false);
    wipeHtml();
    generateUi();
  }
}

// Load all when window loads up
window.onload = function () {
  generateUi();

  // Done Button
  const doneButton = document.getElementById("done-btn");
  doneButton.addEventListener("click", function () {
    generateList(true);
  });

  // Home Button
  const homeButton = document.getElementById("home-btn");
  homeButton.addEventListener("click", function () {
    generateList(false);
  });
};
