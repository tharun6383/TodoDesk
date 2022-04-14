const notStartedSection = document.getElementById('notStartedContent');
const inProgressSection = document.getElementById('inProgressContent');
const completedSection = document.getElementById('completedContent');
const newTaskTitle = document.getElementById('newTaskTitle');
const newTaskStartDate = document.getElementById('newTaskStartDate');
const newTaskEndDate = document.getElementById('newTaskEndDate');
const newTaskInsertBtn = document.getElementById('newTaskInsertBtn');
const editTaskTitle = document.getElementById('editTaskTitle');
const editTaskStartDate = document.getElementById('editTaskStartDate');
const editTaskEndDate = document.getElementById('editTaskEndDate');
const searchBarInput = document.getElementById('searchBar');
const doneBtns = document.getElementsByClassName('doneBtn');
const editBtns = document.getElementsByClassName('editBtn');
const deleteBtns = document.getElementsByClassName('deleteBtn');
const sortAllBtn = document.getElementById('sortAllBtn');
const sortNotStartedBtn = document.getElementById('sortNotStartedBtn');
const sortInProgressBtn = document.getElementById('sortInProgressBtn');
const sortCompletedBtn = document.getElementById('sortCompletedBtn');
const deletePopup = document.getElementById('delete-popup');
const editPopup = document.getElementById('edit-popup');
const profileBtn = document.getElementById('profileBtn');
let mainSection = document.getElementById('mainSection');
let mySidenav = document.getElementById('mySidenav');
const sidenavCloseBtn = document.getElementById('sidenavCloseBtn');
const sidenavArrowBtn = document.getElementById('sidenavArrowBtn');

import {
  clearSection,
  highlightCard,
  sortTask,
  callAPI,
  enableDisablePopup,
} from './util.js';

let userData = [];
let intervalFunction = '';
const requestOptionsPost = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: '',
  redirect: 'follow',
};

/**to load and display sorted data */
const loadTasksAfterSort = () => {
  clearSection(notStartedSection, inProgressSection, completedSection);
  groupTasks(userData).then(() => {
    tickTask();
    editTask();
    deleteTask();
  });
};
sortAllBtn.addEventListener('click', () => {
  userData = [...sortTask(userData, 1, 'notStarted')];
  userData = [...sortTask(userData, 2, 'inProgress')];
  userData = [...sortTask(userData, 1, 'completed')];
  loadTasksAfterSort();
});

sortNotStartedBtn.addEventListener('click', () => {
  userData = [...sortTask(userData, 1, 'notStarted')];
  loadTasksAfterSort();
});
sortInProgressBtn.addEventListener('click', () => {
  userData = [...sortTask(userData, 2, 'inProgress')];
  loadTasksAfterSort();
});
sortCompletedBtn.addEventListener('click', () => {
  userData = [...sortTask(userData, 1, 'completed')];
  loadTasksAfterSort();
});

/**Insert tasks into DOM */
const insertCard = (section, taskid, taskData) => {
  const [taskTitle, startDate, endDate, status] = taskData;
  section.innerHTML += `<div class="taskCard" data-id=${taskid} draggable="true" ondragstart="drag(event)">
  <input type="text" name="taskTitle" id="taskTitle" placeholder="Title" maxlength="30" value="${taskTitle}" readonly />
  <input type="datetime-local" name="startDate" id="startDate" value="${startDate}" readonly/>
  <input type="datetime-local" name="endDate" id="endDate" value="${endDate}" readonly/>
  <svg class="doneBtn" data-tid="${taskid}"><use xlink:href="#tickIconSVG" /></svg>
  <svg class="editBtn" data-sid="${taskid}"><use xlink:href="#editIconSVG" /></svg>
  <svg class="deleteBtn" data-did="${taskid}"><use xlink:href="#deleteIconSVG" /></svg>
</div>`;
};

/**group tasks based on its status */
const groupTasks = async (data) => {
  return data.forEach((taskData) => {
    const [, , , status, taskid] = taskData;
    if (status === 'notStarted')
      insertCard(notStartedSection, taskid, taskData);
    else if (status === 'inProgress')
      insertCard(inProgressSection, taskid, taskData);
    else insertCard(completedSection, taskid, taskData);
  });
};

/**necessary function call for displaying tasks */
const loadTasks = async (data) => {
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
    const requestOptions = { ...requestOptionsPost };
    requestOptions.body = `["${newTaskTitle.value}","${newTaskStartDate.value}","${newTaskEndDate.value}","notStarted"]`;
    callAPI('/newTask', requestOptions).then((result) => loadTasks(result));
    [newTaskTitle.value, newTaskStartDate.value, newTaskEndDate.value] = [
      '',
      '',
      '',
    ];
  } else {
    window.alert('Insufficient data');
  }
});

searchBarInput.addEventListener('input', () => {
  const resultData = [];
  for (const task of Object.values(userData)) {
    if (
      task[0].toLowerCase().search(searchBarInput.value.toLowerCase()) != -1
    ) {
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

/**to move tasks between buckets */
const tickTask = () => {
  Array.from(doneBtns).forEach((btn) => {
    btn.addEventListener('click', () => {
      const requestOptions = { ...requestOptionsPost };
      requestOptions.body = `{"id":"${btn.getAttribute('data-tid')}"}`;
      callAPI('/tickTask', requestOptions).then((result) => loadTasks(result));
    });
  });
};

/**delete task when clicked */
const deleteTask = () => {
  Array.from(deleteBtns).forEach((btn) => {
    btn.addEventListener('click', () => {
      enableDisablePopup(deletePopup, 'enable');
      const id = btn.getAttribute('data-did');
      deletePopup.addEventListener(
        'click',
        function clicked(e) {
          if (e.target.id === 'deleteYes') {
            const requestOptions = { ...requestOptionsPost };
            requestOptions.body = `{"id":"${id}"}`;
            callAPI('/deleteTask', requestOptions)
              .then((result) => loadTasks(result))
              .then(() => {
                deletePopup.removeEventListener('click', clicked, false);
              });
          }
          deletePopup.removeEventListener('click', clicked, false);
          enableDisablePopup(deletePopup, 'disable');
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
      enableDisablePopup(editPopup, 'enable');
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
            const requestOptions = { ...requestOptionsPost };
            requestOptions.body = `{"id":"${id}","taskTitle":"${editTaskTitle.value}","startDate":"${editTaskStartDate.value}","endDate":"${editTaskEndDate.value}"}`;
            callAPI('/modifyTask', requestOptions)
              .then((result) => loadTasks(result))
              .then(() => {
                enableDisablePopup(editPopup, 'disable');
                editPopup.removeEventListener('click', clicked, false);
              });
          } else if (e.target.id === 'editCloseBtn') {
            enableDisablePopup(editPopup, 'disable');
            editPopup.removeEventListener('click', clicked, false);
          }
        },
        false
      );
    });
  });
};

notStartedSection.addEventListener('drop', (e) => {
  e.preventDefault();
  const id = e.dataTransfer.getData('text');
  dragDropTask(id, 'notStarted');
});
inProgressSection.addEventListener('drop', (e) => {
  e.preventDefault();
  const id = e.dataTransfer.getData('text');
  dragDropTask(id, 'inProgress');
});
completedSection.addEventListener('drop', (e) => {
  e.preventDefault();
  const id = e.dataTransfer.getData('text');
  dragDropTask(id, 'completed');
});

/**function for handling Drag drop tasks */
const dragDropTask = (id, section) => {
  userData[id][3] = section;
  clearSection(notStartedSection, inProgressSection, completedSection);
  const requestOptions = { ...requestOptionsPost };
  requestOptions.body = `{"id":"${id}","section":"${section}"}`;
  fetch('/dragDropTask', requestOptions).catch((err) => console.log(err));
  groupTasks(userData).then(() => {
    tickTask();
    editTask();
    deleteTask();
  });
};

const requestOptionsGet = {
  method: 'GET',
  redirect: 'follow',
};
callAPI('/userTaskData', requestOptionsGet).then((result) => loadTasks(result));

const openCloseSideNav = () => {
  let isOpen = parseInt(mySidenav.style.width) > 0 ? true : false;
  mainSection.style.marginLeft = mySidenav.style.width = isOpen
    ? '0px'
    : '250px';
  sidenavArrowBtn.style.transform = isOpen
    ? 'translateX(55%) rotate(0deg)'
    : 'translateX(55%) rotate(180deg)';
};

profileBtn.addEventListener('click', () => {
  openCloseSideNav();
});

sidenavCloseBtn.addEventListener('click', () => {
  openCloseSideNav();
});

sidenavArrowBtn.addEventListener('click', () => {
  openCloseSideNav();
});
