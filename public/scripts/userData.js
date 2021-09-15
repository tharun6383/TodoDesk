const requestOptionsGet = {
  method: 'GET',
  redirect: 'follow',
};
fetch('/userData', requestOptionsGet)
  .then((response) => response.text())
  .then((response) => console.log(response))
  .catch((err) => console.log(err));
