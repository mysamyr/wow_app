window.addEventListener("DOMContentLoaded", () => {
  const getWordsForm = document.getElementById("getWords");
  const addForm = document.getElementById("addForm");
  const deleteWordForm = document.getElementById("deleteWord");
  const letters = document.getElementById("letters");
  const result = document.querySelector(".result");
  const count = document.querySelector(".count");

  // const URL = "http://localhost:3000/word";
  const URL = "https://wow-app.onrender.com/word";

  function renderWords({words, length}) {
    words.forEach(word => {
      const p = document.createElement("p");
      p.innerHTML = word;
      result.append(p);
    });
    count.childNodes[1].innerHTML = length;
  }
  function clearForm(form) {
    form[0].value = "";
  }
  function clearResult() {
    result.innerHTML = "";
  }

  getWordsForm.addEventListener("submit", e => {
    e.preventDefault();
    clearResult()
    const usedChars = e.target[0].value.trim().toLowerCase();
    let query = `u=${usedChars}`;
    fetch(`${URL}?${query}`, {
      mode: "cors",
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(res => {
        if (res.message) return alert(res.message);
        renderWords(res);
      });
    addForm[0].focus();
  });
  addForm.addEventListener("submit", e => {
    e.preventDefault();
    fetch(URL, {
      mode: "cors",
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        word: e.target[0].value.trim().toLowerCase()
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
  deleteWordForm.addEventListener("submit", e => {
    e.preventDefault();
    const value = e.target[0].value.trim().toLowerCase();
    fetch(`${URL}${value}`, {
      mode: "cors",
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .catch(error => console.log(error.message));
    clearForm(deleteWordForm);
  });
  letters.focus();
});