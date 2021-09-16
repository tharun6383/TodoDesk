const title = document.getElementById('newTaskTitle');
const StartDate = document.getElementById('newTaskStartDate');
const EndDate = document.getElementById('newTaskEndDate');
const InsertBtn = document.getElementById('newTaskInsertBtn');

newTaskInsertBtn.addEventListener('click', () => {
  title.value = '';
  StartDate.value = '';
  EndDate.value = '';
});
