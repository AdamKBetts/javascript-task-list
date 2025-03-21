// Get references to the HTML elements we need
const taskInput = document.getElementById('newTask');
const addTaskButton = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

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
    checkbox.id = `task-${Date.now()}`;

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

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-btn');
    deleteButton.addEventListener('click', function() {
        listItem.remove();
        saveTasks();
    });

    // Create an edit button
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('edit-btn');

    const saveEditButton = document.createElement('button');
    saveEditButton.textContent = 'Save';
    saveEditButton.classList.add('save-edit-btn');

    editButton.addEventListener('click', function() {
        const currentListItem = this.parentNode;
        const currentTaskSpan = currentListItem.querySelector('.task-text');
        const currentText = currentTaskSpan.textContent;
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.value = currentText;

        saveEditButton.addEventListener('click', function() {
            const saveListItem = this.parentNode;
            const saveInputField = saveListItem.querySelector('input[type="text"]');
            const newSpan = document.createElement('span');
            newSpan.classList.add('task-text');
            newSpan.textContent = saveInputField.value;
            const checkboxLabelElement = saveListItem.querySelector('.checkbox-label-container'); // Get the label element

            if (saveInputField) {
                saveListItem.insertBefore(newSpan, checkboxLabelElement.nextSibling); // Insert newSpan after the label
                saveListItem.removeChild(saveInputField);
                saveListItem.replaceChild(editButton, this); // Use 'this' to refer to the clicked save button
                saveTasks(); // Ensure tasks are saved after editing
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

// Load tasks when the page loads
loadTasks();