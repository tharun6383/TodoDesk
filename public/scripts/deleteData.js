const deleteTask = (id) => {
  const card = document.querySelector(`[data-id="${id}"]`);
  card.remove();
  const requestOptionsPost = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: `{"id":"${id}"}`,
    redirect: 'follow',
  };
  fetch('/deleteTask', requestOptionsPost).catch((err) => console.log(err));
};
