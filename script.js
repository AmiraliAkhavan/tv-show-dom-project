const userCardTemplate = document.querySelector("[data-user-template]");
const container = document.querySelector(".container");
const searchInput = document.querySelector("[data-search]");
const dropdown = document.querySelector("[dropdown]");
const episodeCount = document.querySelector(".epiCount h4");
const allDropDown = document.querySelector("[allDropDown]");

function padWithZero(num, targetLength) {
  if (targetLength < 3) return String(num).padStart(targetLength, "0");
}

function html(ele) {
  const epis = padWithZero(ele.number, String(ele.number).length + 1);
  const seas = padWithZero(ele.season, String(ele.season).length + 1);
  const html = `<div class="card" style="width: 19rem">
  <img src="${ele.image.medium}" class="card-img-top" alt="Image of ${ele.name} episode"/>
  <div><h5 class= "h5 text-center">${ele.name}</h5></div>
  <div class="card-body summary">${ele.summary}</div>
  <div class="text-center">
  <p>S${seas}E${epis}</p>
  <button class ="Card-btn"><b><a href="${ele.url}" target="_blank">More Info</a></b></button>
  </div>
  </div>`;
  container.innerHTML += html;
}
const Epiname = [];
const liArray = [];

const getData = async () => {
  const request = await axios.get("https://api.tvmaze.com/shows/527/episodes");
  request.data.forEach((ele) => {
    html(ele);
  });
  search(request.data);
  episodDropdown(request.data);
};

getData();

function search(element) {
  searchInput.addEventListener("input", (e) => {
    container.innerHTML = "";
    const epiCount = element.filter((ele) => {
      return (
        ele.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        ele.summary.toLowerCase().includes(e.target.value.toLowerCase())
      );
    });
    epiCount.forEach((ele) => {
      html(ele);
    });
    if (epiCount.length > 0) {
      episodeCount.innerHTML = `${epiCount.length} ${
        epiCount.length > 1 ? `episodes` : `episode`
      } found `;
    } else {
      episodeCount.innerHTML = `Nothing found`;
    }
    if (e.target.value === "") {
      episodeCount.textContent = null;
    }
  });
}

function episodDropdown(data) {
  data.forEach((ele) => {
    Epiname.push(ele.name);
  });

  allDropDown.addEventListener("click", () => {
    container.innerHTML = "";
    data.forEach((ele) => {
      html(ele);
    });
  });

  data.forEach((ele) => {
    const seas = padWithZero(ele.season, String(2).length + 1);
    const epis = padWithZero(ele.number, String(2).length + 1);
    const li = document.createElement("li");
    li.classList += "dropdown-item";
    liArray.push(li);
    li.textContent = `S${seas} E${epis}-${ele.name}`;
    dropdown.append(li);
  });

  data.forEach((ele, i) => {
    liArray[i].addEventListener("click", (e) => {
      if (Epiname.includes(e.target.textContent.slice(8))) {
        container.innerHTML = "";
        html(ele);
      }
    });
  });
}
