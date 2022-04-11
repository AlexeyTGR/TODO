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

const savedTasksArray = localStorage.getItem('tasksArray');
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

const newTask = () => {
  tasksArray.push({
    id: idCounter,
    status: 'active',
    value: initialTask.value,
  });
};

const updateTasks = () => {
  tasksArray.forEach((item) => {
    const currentID = item.id;
    const currentStatus = item.status;
    const currentValue = item.value;
    renderTasks(currentID, currentStatus, currentValue);
  });
};

const renderTasks = (curID, curStatus, curValue) => {
  const tempTask = document.getElementsByTagName("template")[0];
  const clon = tempTask.content.cloneNode(true);

  const taskAttributes = clon.querySelector('.task');
  taskAttributes.setAttribute('id', curID);
  taskAttributes.setAttribute('status', curStatus);
  let textareaValue = taskAttributes.querySelector('#task-text');
  textareaValue.value = curValue;
  if (curStatus === 'complete') {
    textareaValue.classList.add('complete-task-decoration');
    const checkbox = taskAttributes.querySelector('#checkbox-icon');
    checkbox.setAttribute('src', 'icons/checked.png')
  };
  showFilteredTask(taskAttributes, curStatus);
  tasksLocationBlock.append(clon);
};

const changeTaskStatus = (event) => {
  const target = event.target.dataset.markTask;
  if (target != undefined) {
    const taskToMark = event.target.closest('.task');
    let taskToMarkID = taskToMark.getAttribute('id');
    const indexOfTaskToMark = tasksArray.findIndex((item) => {
      return item.id === +taskToMarkID;
    });
    const currentStatusValue = tasksArray[indexOfTaskToMark].status;
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
    const taskToEdit = event.target.closest('.task');
    let taskID = taskToEdit.getAttribute('id');
    const areaToEdit = taskToEdit.querySelector('.task-text');
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
  const target = event.target.dataset.deleteTaskButton;
  if (target != undefined) {
    const blockToDelete = event.target.closest('.task');
    let blockToDeleteID = blockToDelete.getAttribute('id');
    const indexOfTaskToDelete = tasksArray.findIndex((item) => {
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
    newTask();
    renderPage();
    initialTask.value = null;
  };
};

const saveToLocalStorage = () => {
  const tasksArrayJSON = JSON.stringify(tasksArray);
  filterValue = taskFilterMenu.value;
  localStorage.setItem('tasksArray', tasksArrayJSON);
  localStorage.setItem('idCounter', idCounter);
  localStorage.setItem('filterValue', filterValue);
};

const changeTasksCounter = () => {
  let currentTasksQuantity = 0;
  tasksArray.forEach((item) => {
    if (item.status === 'active') {
      currentTasksQuantity++;
    }
  })
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
