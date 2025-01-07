const formatWord = word => word.trim().toLowerCase();

window.addEventListener('DOMContentLoaded', () => {
  const getWordsForm = document.getElementById('getWords');
  const addForm = document.getElementById('addForm');
  const deleteWordForm = document.getElementById('deleteWord');
  const letters = document.getElementById('letters');
  const result = document.querySelector('.result');
  const count = document.querySelector('.count');

  function renderWords({ words, length }) {
    words.forEach(word => {
      const p = document.createElement('p');
      p.innerHTML = word;
      result.append(p);
    });
    count.childNodes[1].innerHTML = length;
  }
  function clearForm(form) {
    form[0].value = '';
  }
  function clearResult() {
    result.innerHTML = '';
  }

  getWordsForm.addEventListener('submit', e => {
    e.preventDefault();
    clearResult();
    const usedChars = formatWord(e.target[0].value);
    let query = `u=${usedChars}`;
    fetch(`/word?${query}`, {
      mode: 'cors',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(res => {
        if (res.message) return alert(res.message);
        renderWords(res);
      })
      // eslint-disable-next-line no-console
      .catch(err => console.error(err));
    getWordsForm[0].focus();
  });
  addForm.addEventListener('submit', e => {
    e.preventDefault();
    fetch('/word', {
      mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        word: formatWord(e.target[0].value),
      }),
    })
      .then(async response => {
        if (response.status === 400) {
          const body = await response.json();
          alert(body.message);
        }
      })
      // eslint-disable-next-line no-console
      .catch(err => console.error(err));
    clearForm(addForm);
  });
  deleteWordForm.addEventListener('submit', e => {
    e.preventDefault();
    const value = formatWord(e.target[0].value);
    fetch(`/word/${value}`, {
      mode: 'cors',
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(async response => {
        if (response.status === 400) {
          const body = await response.json();
          alert(body.message);
        }
      })
      // eslint-disable-next-line no-console
      .catch(err => console.error(err.message));
    clearForm(deleteWordForm);
    letters.focus();
  });
});
