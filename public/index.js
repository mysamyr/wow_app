const addForm = document.getElementById("addForm");
const getWordsForm = document.getElementById("getWords");
const deleteWordForm = document.getElementById("deleteWord");
const letters = document.querySelector(".letters");
const result = document.querySelector(".result");
const use = new Set();

function renderWords(words) {
  words.forEach(word => {
    const p = document.createElement("p");
    p.innerHTML = word;
    result.append(p);
  });
}
function clearForm(form) {
  form[0].value = "";
}
function clearResult() {
  result.innerHTML = "";
}

addForm.addEventListener("submit", e => {
  e.preventDefault();
  // console.log(e.srcElement[0].value);
  fetch("http://localhost:3000/", {
    mode: "cors",
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      word: e.srcElement[0].value.trim().toLowerCase()
    }),
  })
    .then(async response => {
      if (response.status === 400) {
        const body = await response.json();
        alert(body.message);
      }
    });
  clearForm(addForm);
});
getWordsForm.addEventListener("submit", e => {
  e.preventDefault();
  clearResult()
  const value = e.srcElement[0].value.split("");
  const usedChars = [...use];
  let query = "";
  if (value.length) {
    query += `l=${value.length}`;
    value.forEach((char, index) => {
      if (char !== "-") {
        query += `&${index}=${char}`;
      }
    });
    query += "&";
  }
  if (usedChars.length) {
    query += `u=${usedChars.join("")}`;
  }
  fetch(`http://localhost:3000/?${query}`, {
    mode: "cors",
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(res => {
      if (res.message) return alert(res.message);
      renderWords(res.words);
    })
    .catch(error => console.log(error.message));
});
deleteWordForm.addEventListener("submit", e => {
  e.preventDefault();
  const value = e.srcElement[0].value.trim().toLowerCase();
  fetch(`http://localhost:3000/${value}`, {
    mode: "cors",
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .catch(error => console.log(error.message));
  clearForm(deleteWordForm);
});
letters.childNodes.forEach(element => {
  if (element.nodeName === "INPUT") {
    element.addEventListener("click", e => {
      const {checked, value} = e.target;
      if (checked) {
        use.add(value);
      } else {
        use.delete(value);
      }
    });
  }
});
