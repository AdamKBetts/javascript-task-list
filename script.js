// Get references to the HTML elements we need
const taskInput = document.getElementById('newTask');
const addTaskButton = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

// Function to save tasks to local storage
function saveTasks() {
    const tasks = ``;
    taskList.querySelectorAll('li').forEach(taskItem => {
        const taskText = taskItem.querySelector('.task-text').textContent;
        const isCompleted = taskItem.querySelector('.task-checkbox').checked;
        tasks.push({text: taskText, completed: isCompleted});
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from storage
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if(storedTasks){
        const tasks = JSON.parse(storedTasks);
        tasks.forEach(task => {
            addTaskToDOM(task.text, task.completed);
        });
    }
}

// Function to add a task to the DOM (used by loadTasks)
function addTaskToDOM(text, completed){
    const listItem = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('task-checkbox');
    checkbox.checked = completed;

    const taskSpan = document.createElement('span');
    taskSpan.classList.add('task-text');
    taskSpan.textContent = text;
    if (completed){
        taskSpan.classList.add('completed');
    }

    checkbox.addEventListener('change', function(){
        taskSpan.classList.toggle('completed');
        saveTasks();
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-btn');
    deleteButton.addEventListener('click', function() {
        listItem.remove();
        saveTasks();
    });

    listItem.appendChild(checkbox);
    listItem.appendChild(taskSpan);
    listItem.appendChild(deleteButton);
    listItem.appendChild(listItem);
}

// Function to add a new task to the list
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        addTaskToDOM(taskText, false); // Initially not completed
        taskInput.value = '';
        saveTasks();
    }
}

// Add event listener tp the "Add" button
addTaskButton.addEventListener('click', addTask);

// Allow adding tasks by pressing Enter
taskInput.addEventListener('keypress', function(event){
    if (event.key === 'Enter'){
        addTask();
    }
});

// Load tasks when the page loads
loadTasks();