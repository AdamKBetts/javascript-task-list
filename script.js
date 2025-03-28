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
const taskPrioritySelect = document.getElementById('taskPriority'); // Added reference

// Event listener for clear input button
if (clearInputButton) {
    clearInputButton.addEventListener('click', function() {
        taskInput.value = '';
        taskInput.focus();
    });
}

// Function to save tasks to local storage
function saveTasks() {
    const tasks = Array.from(taskList.querySelectorAll('li')).map(taskItem => {
        const taskSpan = taskItem.querySelector('.task-text');
        const taskText = taskSpan ? taskSpan.textContent : taskItem.querySelector('input[type="text"]').value;
        const isCompleted = taskItem.querySelector('.task-checkbox').checked;
        const priority = taskItem.className.split(' ')[0].replace('-priority', '');
        return { text: taskText, completed: isCompleted, priority: priority };
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from local storage
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        const tasks = JSON.parse(storedTasks);
        tasks.forEach(task => addTaskToDOM(task.text, task.completed, task.priority));
    }
    updateActiveTaskCount();
    updateSelectAllCheckboxState();
    toggleEmptyTaskListMessage();
    updateClearCompletedButtonState();
}

// Function to create a new task item in the DOM
function createTaskListItem(text, completed, priority) {
    const listItem = document.createElement('li');
    listItem.classList.add(priority + '-priority', 'fade-in');

    const checkboxId = `task-${taskIdCounter++}`;

    const checkboxLabel = document.createElement('label');
    checkboxLabel.classList.add('checkbox-label-container');
    checkboxLabel.setAttribute('for', checkboxId);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('task-checkbox');
    checkbox.checked = completed;
    checkbox.id = checkboxId;
    checkboxLabel.appendChild(checkbox);

    const customCheckboxSpan = document.createElement('span');
    customCheckboxSpan.classList.add('custom-checkbox');
    checkboxLabel.appendChild(customCheckboxSpan);

    const taskSpan = document.createElement('span');
    taskSpan.classList.add('task-text');
    taskSpan.textContent = text;
    if (completed) {
        taskSpan.classList.add('completed');
    }

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '🗑️';
    deleteButton.classList.add('delete-btn');

    const editButton = document.createElement('button');
    editButton.textContent = '✏️';
    editButton.classList.add('edit-btn');

    listItem.appendChild(checkboxLabel);
    listItem.appendChild(taskSpan);
    listItem.appendChild(deleteButton);
    listItem.appendChild(editButton);

    // Add event listeners here to keep related code together
    checkbox.addEventListener('change', handleTaskCompletion);
    checkbox.addEventListener('keypress', handleCheckboxEnter);
    deleteButton.addEventListener('click', handleDeleteTask);
    editButton.addEventListener('click', handleEditTask);

    setTimeout(() => listItem.classList.add('loaded'), 10);

    return listItem;
}

// Function to add a task to the DOM
function addTaskToDOM (text, completed, priority = 'medium') {
    const listItem = createTaskListItem(text, completed, priority);
    taskList.appendChild(listItem);
    updateActiveTaskCount();
    updateSelectAllCheckboxState();
    toggleEmptyTaskListMessage();
}

// Function to handle adding a new task
function addTask() {
    const taskText = taskInput.value.trim();
    const taskPriority = taskPrioritySelect.value;

    if(taskText !== '') {
        const isDuplicate = Array.from(taskList.querySelectorAll('li .task-text'))
            .some(existingTask => existingTask.textContent.trim().toLowerCase() === taskText.toLowerCase());
        
        if (isDuplicate) {
            alert("This task is already in your list!");
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
taskInput.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        addTask();
    }
});

// Event listener for clearing completed tasks
clearCompletedButton.addEventListener('click', () => {
    const completedTasks = taskList.querySelectorAll('li .task-checkbox:checked');
    if (completedTasks.length > 0) {
        if (confirm("Are you sure you want to clear all completed tasks?")) {
            completedTasks.forEach(checkbox => checkbox.closest('li').remove());
            updateLocalStorage();
        }
    } else {
        alert("No completed tasks to clear!");
    }
});

// Function to update local storage after DOM changes
function updateLocalStorage() {
    saveTasks();
    updateActiveTaskCount();
    toggleEmptyTaskListMessage();
    updateClearCompletedButtonState();
}

// Event Listeners for filtering tasks
showAllButton.addEventListener('click', () => filterTasks('all'));
showActiveButton.addEventListener('click', () => filterTasks('active'));
showCompletedButton.addEventListener('click', () => filterTasks('completed'));

// Function to filter tasks
function filterTasks(filterType) {
    taskList.querySelectorAll('li').forEach(item => {
        const isCompleted = item.querySelector('.task-checkbox').checked;
        switch (filterType) {
            case 'active':
                item.style.display = isCompleted ? 'none' : 'flex';
                break;
            case 'completed':
                item.style.display = isCompleted ? 'flex' : 'none';
                break;
            default: // 'all'
                item.style.display = 'flex';
                break;
        }
    });
}

// Function to update the count of active tasks
function updateActiveTaskCount() {
    const activeCountSpan = document.getElementById('activeTaskCount');
    const activeTaskCount = taskList.querySelectorAll('.task-checkbox:not(:checked)').length;
    activeCountSpan.textContent = `Active tasks: ${activeTaskCount}`;
}

// Function to handle toggling all tasks
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

// Event listener for select all checkbox
selectAllCheckbox.addEventListener('change', toggleAllTasks);

// Function to update the state of the select all checkbox
function updateSelectAllCheckboxState() {
    const allTaskCheckboxes = taskList.querySelectorAll('.task-checkbox');
    selectAllCheckbox.checked = allTaskCheckboxes.length > 0 && Array.from(allTaskCheckboxes).every(checkbox => checkbox.checked);
}

// Function to toggle the visibility of the empty task list message
function toggleEmptyTaskListMessage() {
    const emptyMessage = document.getElementById('emptyTaskListMessage');
    emptyMessage.style.display = taskList.querySelectorAll('li').length === 0 ? 'block' : 'none';
}

// Function to clear all tasks
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

// Event listener for clear all button
clearAllButton.addEventListener('click', clearAllTasks);

// Function to check if there are any completed tasks
function hasCompletedTasks() {
    return taskList.querySelectorAll('li .task-checkbox:checked').length > 0;
}

// Function to update the state of the clear completed button
function updateClearCompletedButtonState() {
    const clearCompletedButtonElement = document.getElementById('clearCompletedBtn');
    if (clearCompletedButtonElement) {
        clearCompletedButtonElement.disabled = !hasCompletedTasks();
    }
}

// --- Event Handlers (extracted for better organization) ---

function handleTaskCompletion() {
    const currentListItem = this.closest('li');
    const currentTaskSpan = currentListItem.querySelector('.task-text');
    if (currentTaskSpan) {
        currentTaskSpan.classList.toggle('completed');
    }
    saveTasks();
    updateActiveTaskCount();
    updateSelectAllCheckboxState();
    updateClearCompletedButtonState();
}

function handleCheckboxEnter(event) {
    if (event.key === 'Enter') {
        this.checked = !this.checked;
        this.dispatchEvent(new Event('change'));
    }
}

function handleDeleteTask() {
    const listItemToRemove = this.closest('li');
    listItemToRemove.classList.add('fade-out');
    setTimeout(() => {
        listItemToRemove.remove();
        saveTasks();
        updateActiveTaskCount();
        toggleEmptyTaskListMessage();
        updateClearCompletedButtonState();
    }, 300);
}

function handleEditTask() {
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

    saveEditButton.addEventListener('click', () => {
        const saveInputField = currentListItem.querySelector('input[type=text]');
        const newSpan = document.createElement('span');
        newSpan.classList.add('task-text');
        newSpan.textContent = saveInputField.value;
        const checkboxLabelElement = currentListItem.querySelector('.checkbox-label-container');

        if (saveInputField) {
            currentListItem.insertBefore(newSpan, checkboxLabelElement.nextSibling);
            currentListItem.removeChild(saveInputField);
            currentListItem.replaceChild(this, saveEditButton);
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

    inputField.addEventListener('keypress', event => {
        if (event.key === 'Enter') {
            saveEditButton.click();
        }
    });

    currentListItem.removeChild(currentTaskSpan);
    currentListItem.replaceChild(saveEditButton, this);
    currentListItem.insertBefore(inputField, saveEditButton);
}

// Load tasks when the page loads
loadTasks();
filterTasks('all');