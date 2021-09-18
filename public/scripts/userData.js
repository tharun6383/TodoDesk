const notStartedSection = document.getElementById('notStartedContent');
const inProgressSection = document.getElementById('inProgressContent');
const completedSection = document.getElementById('completedContent');
const newTaskTitle = document.getElementById('newTaskTitle');
const newTaskStartDate = document.getElementById('newTaskStartDate');
const newTaskEndDate = document.getElementById('newTaskEndDate');
const newTaskInsertBtn = document.getElementById('newTaskInsertBtn');

const searchBarInput = document.getElementById('searchBar');
const doneBtns = document.getElementsByClassName('doneBtn');
const saveBtns = document.getElementsByClassName('saveBtn');
const deleteBtns = document.getElementsByClassName('deleteBtn');
const sortAllBtn = document.getElementById('sortAllBtn');
const sortNotStartedBtn = document.getElementById('sortNotStartedBtn');
const sortInProgressBtn = document.getElementById('sortInProgressBtn');
const sortCompletedBtn = document.getElementById('sortCompletedBtn');
const deletePopup = document.getElementById('delete-popup');

import { clearSection, highlightCard, sortTask, callAPI } from './util.js';

let userData = [];
let intervalFunction = '';

sortAllBtn.addEventListener('click', () => {
  userData = [...sortTask(userData, 1, 'notStarted')];
  userData = [...sortTask(userData, 2, 'inProgress')];
  userData = [...sortTask(userData, 1, 'completed')];
  clearSection(notStartedSection, inProgressSection, completedSection);
  groupTasks(userData).then(() => {
    tickTask();
    saveTask();
    deleteTask();
  });
});

sortNotStartedBtn.addEventListener('click', () => {
  userData = [...sortTask(userData, 1, 'notStarted')];
  clearSection(notStartedSection, inProgressSection, completedSection);
  groupTasks(userData).then(() => {
    tickTask();
    saveTask();
    deleteTask();
  });
});
sortInProgressBtn.addEventListener('click', () => {
  userData = [...sortTask(userData, 2, 'inProgress')];
  clearSection(notStartedSection, inProgressSection, completedSection);
  groupTasks(userData).then(() => {
    tickTask();
    saveTask();
    deleteTask();
  });
});
sortCompletedBtn.addEventListener('click', () => {
  userData = [...sortTask(userData, 1, 'completed')];
  clearSection(notStartedSection, inProgressSection, completedSection);
  groupTasks(userData).then(() => {
    tickTask();
    saveTask();
    deleteTask();
  });
});

/**Insert tasks into DOM */
const insertCard = (section, taskid, taskData) => {
  const [taskTitle, startDate, endDate, status] = taskData;
  section.innerHTML += `<div class="taskCard" data-id=${taskid}>
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
  <img class="doneBtn" src="./images/icons8-checkmark.svg" alt="Done" width="30px" heigth="30px" data-tid="${taskid}"/>
  <img class="saveBtn" src="./images/saveIcon.svg" alt="Save" width="26px" heigth="26px" data-sid="${taskid}"/>
  <img class="deleteBtn" src="./images/deleteIcon.svg" alt="Delete" width="28px" heigth="28px" data-did="${taskid}"/>
</div>`;
};

searchBarInput.addEventListener('input', () => {
  const resultData = [];
  console.log(searchBarInput.value, userData);
  for (const task of Object.values(userData)) {
    if (task[0].search(searchBarInput.value) != -1) {
      resultData.push(task);
    }
  }
  clearSection(notStartedSection, inProgressSection, completedSection);

  groupTasks(resultData).then(() => {
    tickTask();
    saveTask();
    deleteTask();
    highlightCard(notStartedSection, inProgressSection);
  });
});

/**group tasks based on its status */
const groupTasks = async (data) => {
  return data.forEach((taskData) => {
    const [, , , status, taskid] = taskData;
    if (status === 'notStarted') insertCard(notStartedSection, taskid, taskData);
    else if (status === 'inProgress') insertCard(inProgressSection, taskid, taskData);
    else insertCard(completedSection, taskid, taskData);
  });
};

/**necessary function call for displaying tasks */
const loadTasks = async (data) => {
  // console.log(data);
  userData = [];
  for (const [key, value] of Object.entries(data)) {
    userData.push([...value, key]);
  }
  clearInterval(intervalFunction);
  clearSection(notStartedSection, inProgressSection, completedSection);

  groupTasks(userData).then(() => {
    tickTask();
    saveTask();
    deleteTask();
    highlightCard(notStartedSection, inProgressSection);
    intervalFunction = setInterval(() => {
      highlightCard(notStartedSection, inProgressSection);
    }, 1000);
  });
};

/**EventListner for creating new task button */
newTaskInsertBtn.addEventListener('click', () => {
  if (newTaskTitle.value && newTaskStartDate.value && newTaskEndDate.value) {
    const requestOptionsPost = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: `["${newTaskTitle.value}","${newTaskStartDate.value}","${newTaskEndDate.value}","notStarted"]`,
      redirect: 'follow',
    };
    callAPI('/newTask', requestOptionsPost).then((result) => loadTasks(result));
    [newTaskTitle.value, newTaskStartDate.value, newTaskEndDate.value] = ['', '', ''];
  } else {
    window.alert('Insufficient data');
  }
});

/**to move tasks between buckets */
const tickTask = () => {
  Array.from(doneBtns).forEach((btn) => {
    btn.addEventListener('click', () => {
      const requestOptionsPost = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: `{"id":"${btn.getAttribute('data-tid')}"}`,
        redirect: 'follow',
      };
      callAPI('/tickTask', requestOptionsPost).then((result) => loadTasks(result));
    });
  });
};

/**delete task when clicked */
const deleteTask = () => {
  Array.from(deleteBtns).forEach((btn) => {
    btn.addEventListener('click', () => {
      // console.log(deletePopup);
      deletePopup.style.visibility = 'visible';
      deletePopup.style.opacity = '1';
      deletePopup.addEventListener('click', (e) => {
        if (e.target.id === 'deleteYes') {
          const requestOptionsPost = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: `{"id":"${btn.getAttribute('data-did')}"}`,
            redirect: 'follow',
          };
          callAPI('/deleteTask', requestOptionsPost).then((result) => loadTasks(result));
        }
        deletePopup.style.visibility = 'hidden';
        deletePopup.style.opacity = '0';
      });
    });
  });
};

/**save modified task */
const saveTask = () => {
  Array.from(saveBtns).forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-sid');
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
      callAPI('/modifyTask', requestOptionsPost).then((result) => loadTasks(result));
    });
  });
};

const requestOptionsGet = {
  method: 'GET',
  redirect: 'follow',
};
callAPI('/userTaskData', requestOptionsGet).then((result) => loadTasks(result));
