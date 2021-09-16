const notStartedSection = document.getElementById('notStartedContent');
const inProgressSection = document.getElementById('inProgressContent');
const completedSection = document.getElementById('completedContent');
const newTaskTitle = document.getElementById('newTaskTitle');
const newTaskStartDate = document.getElementById('newTaskStartDate');
const newTaskEndDate = document.getElementById('newTaskEndDate');
const newTaskInsertBtn = document.getElementById('newTaskInsertBtn');

const intervalFunction = '';

const highlightCard = () => {
  Array.from(mainSection.children).forEach((card) => {
    console.log(card);
    const currentDate = new Date();
    const dueDate = new Date('2022-06-12T19:30');
    if (currentDate > dueDate) {
    }
  });
};

const insertCard = (section, taskid, taskData) => {
  const [taskTitle, startDate, endDate, status] = taskData;
  section.innerHTML += `<div class="taskCard">
  <input
    type="text"
    name="taskTitle"
    id="taskTitle"
    placeholder="Title"
    maxlength="30"
    value="${taskTitle}"
  />
  <input type="datetime-local" name="startDate" id="startDate" value="${startDate}"/>
  <input type="datetime-local" name="endDate" id="endDate" value="${endDate}"/>
  <img src="./images/icons8-checkmark.svg" alt="Done" width="30px" heigth="30px" data-id=${taskid} />
  <img src="./images/saveIcon.svg" alt="Save" width="26px" heigth="26px" data-id=${taskid}/>
  <img src="./images/deleteIcon.svg" alt="Delete" width="28px" heigth="28px" data-id=${taskid}/>
</div>`;
};

const loadTasks = (data) => {
  clearInterval(intervalFunction);
  notStartedSection.innerHTML = '';
  inProgressSection.innerHTML = '';
  completedSection.innerHTML = '';
  for (const [taskid, taskData] of Object.entries(data)) {
    console.log(typeof taskData, taskData);
    const [, , , status] = taskData;
    if (status === 'notStarted') insertCard(notStartedSection, taskid, taskData);
    else if (status === 'inProgress') insertCard(inProgressSection, taskid, taskData);
    else insertCard(completedSection, taskid, taskData);
  }
  // intervalFunction = setInterval(() => highlightCard(), 1000 * 30);
};

newTaskInsertBtn.addEventListener('click', () => {
  if (newTaskTitle.value && newTaskStartDate.value && newTaskStartDate.value) {
    const requestOptionsPost = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: `["${newTaskTitle.value}","${newTaskStartDate.value}","${newTaskStartDate.value}","notStarted"]`,
      redirect: 'follow',
    };
    fetch('/newTask', requestOptionsPost)
      .then((response) => response.json())
      .then((result) => loadTasks(result))
      .catch((err) => console.log(err));
  } else {
    window.alert('Insufficient data');
  }
});

const requestOptionsGet = {
  method: 'GET',
  redirect: 'follow',
};

const callAPI = async (url) => {
  return fetch(url, requestOptionsGet)
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

callAPI('/userTaskData').then((result) => loadTasks(result));
