let taskIdCounter = Date.now();
// Get references to the HTML elements we need
const taskInput = document.getElementById('newTask');
const addTaskButton = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const clearCompletedButton = document.getElementById('clearCompletedBtn');
const showAllButton = document.getElementById('showAllBtn');
const showActiveButton = document.getElementById('showActiveBtn');
const showCompletedButton = document.getElementById('showCompletedBtn');
const selectAllCheckbox = document.getElementById('selectAllCheckbox');
const clearAllButton = document.getElementById('clearAllBtn');
const clearInputButton = document.getElementById('clearInputBtn');

if (clearInputButton) {
    clearInputButton.addEventListener('click', function() {
        taskInput.value = '';
        taskInput.focus();
    });
}
// Function to save tasks to local storage
function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(taskItem => {
        const taskSpan = taskItem.querySelector('.task-text');
        const taskText = taskSpan ? taskSpan.textContent : taskItem.querySelector('input[type="text"]').value; // Handle edit mode
        const isCompleted = taskItem.querySelector('.task-checkbox').checked;
        const priority = taskItem.className.split(' ')[0].replace('-priority', '');
        tasks.push({ text: taskText, completed: isCompleted, priority: priority });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from local storage
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        const tasks = JSON.parse(storedTasks);
        tasks.forEach(task => {
            addTaskToDOM(task.text, task.completed, task.priority);
        });
    }
    updateActiveTaskCount();
    updateSelectAllCheckboxState();
    toggleEmptyTaskListMessage();
    updateClearCompletedButtonState();
}

// Function to add a task to the DOM (used by loadTasks)
function addTaskToDOM(text, completed, priority = 'medium') {
    const listItem = document.createElement('li');
    listItem.classList.add(priority + '-priority', 'fade-in');

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
        updateActiveTaskCount();
        updateSelectAllCheckboxState();
        updateClearCompletedButtonState();
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
        const listItemToRemove = this.closest('li');
        listItemToRemove.classList.add('fade-out');

        setTimeout(() => {
            listItem.remove();
            saveTasks();
            updateActiveTaskCount();
            toggleEmptyTaskListMessage();
            updateClearCompletedButtonState();
        }, 300);
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
    setTimeout(() => {
        listItem.classList.add('loaded');
    }, 10);
    updateActiveTaskCount();
    updateSelectAllCheckboxState();
    toggleEmptyTaskListMessage();
}

// Function to add a new task to the lsit
function addTask() {
    const taskText = taskInput.value.trim();
    const taskPriority = document.getElementById('taskPriority').value;

    if (taskText !== '') {
        // Check for duplicate tasks
        const existingTasks = taskList.querySelectorAll('li .task-text');
        let isDuplicate = false;
        const newTaskTextLower = taskText.toLowerCase();
        existingTasks.forEach(existingTask => {
            if (existingTask.textContent.trim().toLowerCase() === newTaskTextLower) {
                isDuplicate = true;
            }
        });

        if (isDuplicate) {
            alert("this task is already in your list!");
            return;
        }

        addTaskToDOM(taskText, false, taskPriority);
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
    updateActiveTaskCount();
    toggleEmptyTaskListMessage();
    updateClearCompletedButtonState();
}

showAllButton.addEventListener ('click', () => filterTasks('all'));
showActiveButton.addEventListener('click', () => filterTasks('active'));
showCompletedButton.addEventListener('click', () => filterTasks('completed'));
selectAllCheckbox.addEventListener('change', toggleAllTasks);
clearAllButton.addEventListener('click', clearAllTasks);

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

function updateActiveTaskCount() {
    const activeCountSpan = document.getElementById('activeTaskCount');
    const checkboxes = taskList.querySelectorAll('.task-checkbox');
    let activeTaskCount = 0;
    checkboxes.forEach(checkbox => {
        if (!checkbox.checked) {
            activeTaskCount++;
        }
    });
    activeCountSpan.textContent = `Active tasks: ${activeTaskCount}`;
}

function updateClearCompletedButtonState() {
    const clearCompletedButton = document.getElementById('clearCompletedBtn');
    if (clearCompletedButton) {
        const hasCompleted = hasCompletedTasks();
        clearCompletedButton.disabled = !hasCompleted;
    }
}

function toggleAllTasks() {
    const allTaskCheckboxes = taskList.querySelectorAll('.task-checkbox');
    const isChecked = selectAllCheckbox.checked;

    allTaskCheckboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
        const listItem = checkbox.closest('li');
        const taskSpan = listItem.querySelector('.task-text');
        if (taskSpan) {
            taskSpan.classList.toggle('completed', isChecked);
        }
    });

    saveTasks();
    updateActiveTaskCount();
}

function updateSelectAllCheckboxState() {
    const allTaskCheckboxes = taskList.querySelectorAll('.task-checkbox');
    const allCompleted = Array.from(allTaskCheckboxes).every(checkbox => checkbox.checked);
    selectAllCheckbox.checked = allCompleted;
}

function toggleEmptyTaskListMessage() {
    const emptyMessage = document.getElementById('emptyTaskListMessage');
    const taskListItems = taskList.querySelectorAll('li');
    if (taskListItems.length === 0) {
        emptyMessage.style.display = 'block';
    } else {
        emptyMessage.style.display = 'none';
    }
}

function clearAllTasks() {
    if (confirm("Are you sure you want to clear all tasks? This action cannot be undone.")) {
        taskList.innerHTML = '';
        localStorage.removeItem('tasks');
        updateActiveTaskCount();
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = false;
        }
        toggleEmptyTaskListMessage();
        updateClearCompletedButtonState();
    }
}

function hasCompletedTasks() {
    const completedTasks = taskList.querySelectorAll('li .task-checkbox:checked');
    return completedTasks.length > 0;
}

// Load tasks when the page loads
loadTasks();
filterTasks('all');