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

const modifyTask = (id) => {
  const card = document.querySelector(`[data-id="${id}"]`).children;
  const title = card.taskTitle.value;
  const sDate = card.startDate.value;
  const eDate = card.endDate.value;
  const requestOptionsPost = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: `{"id":"${id}","taskTitle":"${title}","startDate":"${sDate}","endDate":"${eDate}"}`,
    redirect: 'follow',
  };
  fetch('/modifyTask', requestOptionsPost).catch((err) => console.log(err));
};
