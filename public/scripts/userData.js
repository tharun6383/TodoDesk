const mainSection = document.getElementById('mainSection');
const htmlBody = document.getElementsByTagName('BODY')[0];
const notStartedBtn = document.getElementById('notStarted');
const inProgressBtn = document.getElementById('inProgress');
const completedBtn = document.getElementById('completed');
const BGCOLOR_1 = '#FEFFAF',
  BGCOLOR_2 = '#FFF1A7',
  BGCOLOR_3 = '#C6FF9A';

const loadTasks = (data, bgColor) => {
  console.log(typeof data, data);
  mainSection.innerHTML = '';
  for (const [taskid, taskData] of Object.entries(data)) {
    const [taskTitle, startDate, endDate] = taskData;
    htmlBody.style.backgroundColor = bgColor;
    mainSection.innerHTML += `<div class="taskCard" data-id="${taskid}">
  <input type="text" name="taskTitle" id="taskTitle" placeholder="Title" maxlength="60" value="${taskTitle}"/>
  <input type="datetime-local" name="startDate" id="startDate" value="${startDate}"/>
  <input type="datetime-local" name="endDate" id="endDate" value="${endDate}"/>
  <img src="./images/icons8-checkmark.svg" alt="Done" width="30px" heigth="30px" />
  <img src="./images/saveIcon.svg" alt="Save" width="26px" heigth="26px" />
  <img src="./images/deleteIcon.svg" alt="Delete" width="28px" heigth="28px" />
</div>`;
  }
};

const requestOptionsGet = {
  method: 'GET',
  redirect: 'follow',
};

const callAPI = async (url) => {
  return fetch(url, requestOptionsGet)
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

callAPI('/notStartedData').then((result) => loadTasks(result, BGCOLOR_1));
notStartedBtn.addEventListener('click', () => {
  callAPI('/notStartedData').then((result) => loadTasks(result, BGCOLOR_1));
});
inProgressBtn.addEventListener('click', () => {
  callAPI('/inProgressData').then((result) => loadTasks(result, BGCOLOR_2));
});
completedBtn.addEventListener('click', () => {
  callAPI('/completedData').then((result) => loadTasks(result, BGCOLOR_3));
});
