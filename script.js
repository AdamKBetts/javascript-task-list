let taskIdCounter = Date.now();
// Get references to the HTML elements we need
const taskInput = document.getElementById('newTask');
const addTaskButton = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const clearCompletedButton = document.getElementById('clearCompletedBtn');
const showAllButton = document.getElementById('showAllBtn');
const showActiveButton = document.getElementById('showActiveBtn');
const showCompletedButton = document.getElementById('showCompletedBtn');

// Function to save tasks to local storage
function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(taskItem => {
        const taskSpan = taskItem.querySelector('.task-text');
        const taskText = taskSpan ? taskSpan.textContent : taskItem.querySelector('input[type="text"]').value; // Handle edit mode
        const isCompleted = taskItem.querySelector('.task-checkbox').checked;
        tasks.push({ text: taskText, completed: isCompleted });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from local storage
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        const tasks = JSON.parse(storedTasks);
        tasks.forEach(task => {
            addTaskToDOM(task.text, task.completed);
        });
    }
}

// Function to add a task to the DOM (used by loadTasks)
function addTaskToDOM(text, completed) {
    const listItem = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('task-checkbox');
    checkbox.checked = completed;
    checkbox.id = `task-${taskIdCounter++}`;

    const customCheckboxSpan = document.createElement('span');
    customCheckboxSpan.classList.add('custom-checkbox');

    const checkboxLabel = document.createElement('label');
    checkboxLabel.classList.add('checkbox-label-container');
    checkboxLabel.setAttribute('for', checkbox.id);

    checkboxLabel.appendChild(checkbox);
    checkboxLabel.appendChild(customCheckboxSpan);

    const taskSpan = document.createElement('span');
    taskSpan.classList.add('task-text');
    taskSpan.textContent = text;
    if (completed) {
        taskSpan.classList.add('completed');
    }

    checkbox.addEventListener('change', function() {
        const currentListItem = this.closest('li');
        const currentTaskSpan = currentListItem.querySelector('.task-text');
        if (currentTaskSpan) {
            currentTaskSpan.classList.toggle('completed');
        }
        saveTasks();
    });

    checkbox.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            this.checked = !this.checked;
            this.dispatchEvent(new Event('change'));
        }
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '🗑️';
    deleteButton.classList.add('delete-btn');
    deleteButton.addEventListener('click', function() {
        listItem.remove();
        saveTasks();
    });

    // Create an edit button
    const editButton = document.createElement('button');
    editButton.textContent = '✏️';
    editButton.classList.add('edit-btn');

    const saveEditButton = document.createElement('button');
    saveEditButton.textContent = 'Save';
    saveEditButton.classList.add('save-edit-btn');

    editButton.addEventListener('click', function(){
        const currentListItem = this.parentNode;
        const currentTaskSpan = currentListItem.querySelector('.task-text');
        const currentText = currentTaskSpan.textContent;
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.value = currentText;
        inputField.classList.add('edit-input');

        const checkbox = currentListItem.querySelector('.task-checkbox');
        const isCurrentlyCompleted = checkbox.checked;

        const saveEditButton = document.createElement('button');
        saveEditButton.textContent = 'Save';
        saveEditButton.classList.add('save-edit-btn');

        saveEditButton.addEventListener('click', function() {
            const saveInputField = currentListItem.querySelector('input[type=text]');
            const newSpan = document.createElement('span');
            newSpan.classList.add('task-text');
            newSpan.textContent = saveInputField.value;
            const checkboxLabelElement = currentListItem.querySelector('.checkbox-label-container');

            if (saveInputField) {
                currentListItem.insertBefore(newSpan, checkboxLabelElement.nextSibling);
                currentListItem.removeChild(saveInputField);
                currentListItem.replaceChild(editButton, this);
                saveTasks();

                const checkbox = currentListItem.querySelector('.task-checkbox');
                const taskSpan = currentListItem.querySelector('.task-text');
                checkbox.checked = isCurrentlyCompleted;
                if (isCurrentlyCompleted) {
                    taskSpan.classList.add('completed');
                } else {
                    taskSpan.classList.remove('completed');
                }
            }
        });

        inputField.addEventListener('keypress', function(event){
            if (event.key === 'Enter'){
                saveEditButton.click();
            }
        });

        currentListItem.removeChild(currentTaskSpan);
        currentListItem.replaceChild(saveEditButton, editButton);
        currentListItem.insertBefore(inputField, saveEditButton);
    });

    listItem.appendChild(checkboxLabel);
    listItem.appendChild(taskSpan);
    listItem.appendChild(deleteButton);
    listItem.appendChild(editButton);
    taskList.appendChild(listItem);
}

// Function to add a new task to the lsit
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        addTaskToDOM(taskText, false);
        taskInput.value = '';
        saveTasks();
        taskInput.focus();
    }
}

// Add event listener to the "Add" button
addTaskButton.addEventListener('click', addTask);

// Allow adding tasks by pressing Enter
taskInput.addEventListener('keypress', function(event){
    if (event.key === 'Enter'){
        addTask();
    }
});

clearCompletedButton.addEventListener('click', function(){
    const completedTasks = taskList.querySelectorAll('li');
    const completedToRemove = [];

    completedTasks.forEach(listItem => {
        const checkbox = listItem.querySelector('.task-checkbox');
        if (checkbox && checkbox.checked){
            completedToRemove.push(listItem);
        }
    });

    if (completedToRemove.length > 0) {
        if (confirm("Are you sure you want to clear all completed tasks?")) {
            completedToRemove.forEach(listItem => {
                listItem.remove();
            });
            updateLocalStorage();
        }
    } else {
        alert("No completed tasks to clear!");
    }
});

function updateLocalStorage() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(taskItem => {
        const taskSpan = taskItem.querySelector('.task-text');
        const isCompleted = taskItem.querySelector('.task-checkbox').checked;
        tasks.push({ text: taskSpan.textContent, completed: isCompleted });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

showAllButton.addEventListener ('click', () => filterTasks('all'));
showActiveButton.addEventListener('click', () => filterTasks('active'));
showCompletedButton.addEventListener('click', () => filterTasks('completed'));

function filterTasks(filterType) {
    const taskListItems = taskList.querySelectorAll('li');
    taskListItems.forEach(item => {
        const isCompleted = item.querySelector('.task-checkbox').checked;
        switch (filterType) {
            case 'active':
                item.style.display = isCompleted ? 'none' : 'flex';
                break;
            case 'completed':
                item.style.display = isCompleted ? 'flex' : 'none';
                break;
            case 'all':
            default:
                item.style.display = 'flex';
                break;
        }
    });
}

// Load tasks when the page loads
loadTasks();
filterTasks('all');