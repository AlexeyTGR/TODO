"use strict";

const tasksLocationBlock = document.getElementById('tasks-location-block');
const newTaskButton = document.getElementById('new-task-button');
const initialTask = document.getElementById('base-task');
const editButton = document.getElementById('edit-button');
const taskFilterMenu = document.getElementById('filter-menu');
const tasksCounter = document.getElementById('task-counter');
const clearAllButton = document.getElementById('clear-all')
let tasksArray = [];
let idCounter = 0;

let savedTasksArray = localStorage.getItem('tasksArray');
if (savedTasksArray) {
  tasksArray = JSON.parse(savedTasksArray);
};
if (localStorage.idCounter) {
  idCounter = parseInt(localStorage.getItem('idCounter'));
};
let filterValue = localStorage.getItem('filterValue');
for (let option of taskFilterMenu) {
  if (option.value === filterValue) {
    option.setAttribute('selected', 'selected');
  };
};

const newTask = (curID, curValue) => {
  curID = idCounter;
  curValue = initialTask.value;
  tasksArray.push({
    id: curID,
    status: 'active',
    value: curValue,
  });
};

const updateTasks = () => {
  tasksArray.forEach((item) => {
    let currentID = item.id;
    let currentStatus = item.status;
    let currentValue = item.value;
    renderTasks(currentID, currentStatus, currentValue);
  });
};

const renderTasks = (curID, curStatus, curValue) => {
  let tempTask = document.getElementsByTagName("template")[0];
  let clon = tempTask.content.cloneNode(true);

  let taskAttributes = clon.querySelector('.task');
  taskAttributes.setAttribute('id', curID);
  taskAttributes.setAttribute('status', curStatus);
  let textareaValue = taskAttributes.querySelector('#task-text');
  textareaValue.value = curValue;
  if (curStatus === 'complete') {
    textareaValue.classList.add('complete-task-decoration');
  };
  showFilteredTask(taskAttributes, curStatus);
  tasksLocationBlock.append(clon);
};

const changeTaskStatus = (event) => {
  let target = event.target.dataset.markTask;
  if (target != undefined) {
    let taskToMark = event.target.closest('.task');
    let taskToMarkID = taskToMark.getAttribute('id');
    let indexOfTaskToMark = tasksArray.findIndex((item) => {
      return item.id === +taskToMarkID;
    });
    let currentStatusValue = tasksArray[indexOfTaskToMark].status;
    if (currentStatusValue === 'complete') {
      tasksArray[indexOfTaskToMark].status = 'active';
    } else {
      tasksArray[indexOfTaskToMark].status = 'complete';
    };
    renderPage();
  };
};

const editTextarea = (event) => {
    let target;
    if (event.type === 'dblclick') {
      target = event.target.dataset.textArea;
    } else if (event.type === 'click') {
      target = event.target.dataset.editText;
    };
    if (target != undefined) {
    let taskToEdit = event.target.closest('.task');
    let taskID = taskToEdit.getAttribute('id');
    let areaToEdit = taskToEdit.querySelector('.task-text');
    areaToEdit.removeAttribute('disabled');
    areaToEdit.focus();
    areaToEdit.addEventListener('blur', () => {
      areaToEdit.setAttribute('disabled', 'disabled');
    });
    areaToEdit.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        areaToEdit.setAttribute('disabled', 'disabled');
      };
      let taskToChangeID = tasksArray.findIndex ((item) => {
        return item.id === +taskID;
      });
      areaToEdit.addEventListener('input', () => {
        tasksArray[taskToChangeID].value = areaToEdit.value;
        saveToLocalStorage();
      });
    });
    };
};

const deleteTask = (event) => {
  let target = event.target.dataset.deleteTaskButton;
  if (target != undefined) {
    let blockToDelete = event.target.closest('.task');
    let blockToDeleteID = blockToDelete.getAttribute('id');
    let indexOfTaskToDelete = tasksArray.findIndex((item) => {
      return item.id === +blockToDeleteID;
    });
    tasksArray.splice(indexOfTaskToDelete, 1);
    renderPage();
  };
};

const showFilteredTask = (element, value) => {
  const curretnFilter = taskFilterMenu.value;
  switch (curretnFilter) {
    case 'active':
      if (value == 'complete') {
        element.classList.add('hidden-task');
      };
      break;
    case 'complete':
      if (value === 'active') {
        element.classList.add('hidden-task');
      };
      break;
  };
};

const renderPage = () => {
  changeTasksCounter();
  clearTasksLocationBlock();
  updateTasks();
  saveToLocalStorage();
};

const clearTasksLocationBlock = () => {
  tasksLocationBlock.innerHTML = '';
};

const clearAll = () => {
  clearTasksLocationBlock();
  tasksArray = [];
  saveToLocalStorage();
}

const makeNewTask = () => {
  const clearEmptySpaces = initialTask.value.replaceAll(/\n/g, '');
  if (initialTask.value && clearEmptySpaces) {
    idCounter++;
    updateTasks();
    newTask(idCounter);
    renderPage();
    initialTask.value = null;
  };
};

const saveToLocalStorage = () => {
  let tasksArrayJSON = JSON.stringify(tasksArray);
  filterValue = taskFilterMenu.value;
  localStorage.setItem('tasksArray', tasksArrayJSON);
  localStorage.setItem('idCounter', idCounter);
  localStorage.setItem('filterValue', filterValue);
};

const changeTasksCounter = () => {
  let currentTasksQuantity = tasksArray.length;
  tasksCounter.textContent = currentTasksQuantity;
};

renderPage();

newTaskButton.addEventListener('click', makeNewTask);
clearAllButton.addEventListener('click', clearAll);
document.addEventListener('click', deleteTask);
document.addEventListener('click', changeTaskStatus);
document.addEventListener('click', editTextarea);
document.addEventListener('dblclick', editTextarea);
taskFilterMenu.addEventListener('change', renderPage);
initialTask.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    makeNewTask();
  };
});

        //////////////////////////////////////////////////////


        // const showDropdownMenu = (event) => {

        //     let editButton = event.target.dataset.editTaskButton;
        //     if (editButton != undefined) {
        //         let dropDownList = event.target.parentNode.querySelector('.dropdown-menu');
        //         dropDownList.style.visibility = 'visible'
        //         dropDownList.addEventListener('mouseout', hideDropdownMenu)
        //     }
        // }

        // let currentElemForDropdownMenu = null;

        // function hideDropdownMenu(event) {
        //     let dropdownMenu = event.target.parentNode.querySelector('.dropdown-menu');
        //     dropdownMenu.onmouseover = function(event) {
        //         // if (currentElemForDropdownMenu) return
        //         let target = event.target.closest('div');
        //         if (!target) return;
        //         currentElemForDropdownMenu = target;
        //     }

        //     if (!currentElemForDropdownMenu) return;
        //     let relatedTarget = event.relatedTarget;

        //     while (relatedTarget) {
        //         if (relatedTarget == currentElemForDropdownMenu) return;

        //         relatedTarget = relatedTarget.parentNode;
        //     }
        //     dropdownMenu.style.visibility = 'hidden';
        //     currentElemForDropdownMenu = null;
        // }
        // const markComplete = (event) => {
        //         let target = event.target.dataset.markTask;
        //         if (target != undefined) {
        //             let taskToMark = event.target.parentNode.parentNode.previousSibling.querySelector('.task-text');

        //             taskToMark.style.textDecoration('line-through')
        //         }
        //     }
        // const deleteTask = (event) => {
        //     let target = event.target.dataset.deleteTaskButton;
        //     if (target != undefined) {
        //         let taskToDelete = event.target.parentNode.parentNode.parentNode;
        //         taskToDelete.remove();
        //     }
        // }

        // document.addEventListener('click', showDropdownMenu);
        // document.addEventListener('keydown', (event) => {
        //     if (event.code == 'Enter') createNewTask()
        // })
        // document.addEventListener('click', deleteTask)
        // document.addEventListener('click', markComplete)
