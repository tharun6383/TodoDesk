const notStartedSection = document.getElementById('notStartedContent');
const inProgressSection = document.getElementById('inProgressContent');
const completedSection = document.getElementById('completedContent');
const newTaskTitle = document.getElementById('newTaskTitle');
const newTaskStartDate = document.getElementById('newTaskStartDate');
const newTaskEndDate = document.getElementById('newTaskEndDate');
const editTaskTitle = document.getElementById('editTaskTitle');
const editTaskStartDate = document.getElementById('editTaskStartDate');
const editTaskEndDate = document.getElementById('editTaskEndDate');
const newTaskInsertBtn = document.getElementById('newTaskInsertBtn');
const searchBarInput = document.getElementById('searchBar');
const doneBtns = document.getElementsByClassName('doneBtn');
const editBtns = document.getElementsByClassName('saveBtn');
const deleteBtns = document.getElementsByClassName('deleteBtn');
const sortAllBtn = document.getElementById('sortAllBtn');
const sortNotStartedBtn = document.getElementById('sortNotStartedBtn');
const sortInProgressBtn = document.getElementById('sortInProgressBtn');
const sortCompletedBtn = document.getElementById('sortCompletedBtn');
const deletePopup = document.getElementById('delete-popup');
const editPopup = document.getElementById('edit-popup');

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
    editTask();
    deleteTask();
  });
});

sortNotStartedBtn.addEventListener('click', () => {
  userData = [...sortTask(userData, 1, 'notStarted')];
  clearSection(notStartedSection, inProgressSection, completedSection);
  groupTasks(userData).then(() => {
    tickTask();
    editTask();
    deleteTask();
  });
});
sortInProgressBtn.addEventListener('click', () => {
  userData = [...sortTask(userData, 2, 'inProgress')];
  clearSection(notStartedSection, inProgressSection, completedSection);
  groupTasks(userData).then(() => {
    tickTask();
    editTask();
    deleteTask();
  });
});
sortCompletedBtn.addEventListener('click', () => {
  userData = [...sortTask(userData, 1, 'completed')];
  clearSection(notStartedSection, inProgressSection, completedSection);
  groupTasks(userData).then(() => {
    tickTask();
    editTask();
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
    readonly
  />
  <input type="datetime-local" name="startDate" id="startDate" value="${startDate}" readonly/>
  <input type="datetime-local" name="endDate" id="endDate" value="${endDate}" readonly/>
  <img class="doneBtn" src="./images/icons8-checkmark.svg" alt="Done" width="30px" heigth="30px" title="Mark as done" data-tid="${taskid}"/>
  <img class="saveBtn" src="./images/saveIcon.svg" alt="Save" width="26px" heigth="26px" title="Save task" data-sid="${taskid}"/>
  <img class="deleteBtn" src="./images/deleteIcon.svg" alt="Delete" width="28px" heigth="28px" title="Delete task" data-did="${taskid}"/>
</div>`;
};

searchBarInput.addEventListener('input', () => {
  const resultData = [];
  // console.log(searchBarInput.value, userData);
  for (const task of Object.values(userData)) {
    if (task[0].search(searchBarInput.value) != -1) {
      resultData.push(task);
    }
  }
  clearSection(notStartedSection, inProgressSection, completedSection);

  groupTasks(resultData).then(() => {
    tickTask();
    editTask();
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
    editTask();
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
      deletePopup.style.visibility = 'visible';
      deletePopup.style.opacity = '1';
      const id = btn.getAttribute('data-did');
      deletePopup.addEventListener(
        'click',
        function clicked(e) {
          if (e.target.id === 'deleteYes') {
            const requestOptionsPost = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: `{"id":"${id}"}`,
              redirect: 'follow',
            };
            // console.log(requestOptionsPost.body);
            callAPI('/deleteTask', requestOptionsPost)
              .then((result) => loadTasks(result))
              .then(() => {
                deletePopup.removeEventListener('click', clicked, false);
              });
          }
          deletePopup.style.visibility = 'hidden';
          deletePopup.style.opacity = '0';
        },
        false
      );
    });
  });
};

/**save modified task */
const editTask = () => {
  Array.from(editBtns).forEach((btn) => {
    btn.addEventListener('click', () => {
      editPopup.style.visibility = 'visible';
      editPopup.style.opacity = '1';
      const id = btn.getAttribute('data-sid');
      const card = document.querySelector(`[data-id="${id}"]`).children;
      [editTaskTitle.value, editTaskStartDate.value, editTaskEndDate.value] = [
        card.taskTitle.value,
        card.startDate.value,
        card.endDate.value,
      ];
      editPopup.addEventListener(
        'click',
        function clicked(e) {
          if (e.target.id === 'editSaveBtn') {
            const requestOptionsPost = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: `{"id":"${id}","taskTitle":"${editTaskTitle.value}","startDate":"${editTaskStartDate.value}","endDate":"${editTaskEndDate.value}"}`,
              redirect: 'follow',
            };
            // console.log(requestOptionsPost.body);
            callAPI('/modifyTask', requestOptionsPost)
              .then((result) => loadTasks(result))
              .then(() => {
                editPopup.style.visibility = 'hidden';
                editPopup.style.opacity = '0';
                editPopup.removeEventListener('click', clicked, false);
              });
          } else if (e.target.id === 'editCloseBtn') {
            editPopup.style.visibility = 'hidden';
            editPopup.style.opacity = '0';
            editPopup.removeEventListener('click', clicked, false);
          }
        },
        false
      );
    });
  });
};

const requestOptionsGet = {
  method: 'GET',
  redirect: 'follow',
};
callAPI('/userTaskData', requestOptionsGet).then((result) => loadTasks(result));
