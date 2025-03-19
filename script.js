// Get references to the HTML elements we need
const taskInput = document.getElementById('newTask');
const addTaskButton = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

// Function to add a new task to the list
function addTask(){
    const taskText = taskInput.value.trim(); //Get the text from the input and remove leading/trailing whitespace

    if (taskText !== ''){
        // Create a new list item (<li)
        const listItem = document.createElement('li');

        // Create a checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('task-checkbox');

        // Create a span for the task text
        const taskSpan = document.createElement('span');
        taskSpan.classList.add('task-text'); // Add a class for styling if needed
        taskSpan.textContent = taskText;

        // Add event listener to the checkbox
        checkbox.addEventListener('change', function(){
            taskSpan.classList.toggle('completed');
        });

        // Create a delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');

        // Add an event listener to the delete button
        deleteButton.addEventListener('click', function(){
            listItem.remove(); // Remove the task item when the delete button is clicked
            saveTasks(); // Save tasks after deletion
        });

        // Append the task text and delete button to the list item
        listItem.appendChild(checkbox);
        listItem.appendChild(taskSpan);
        listItem.appendChild(deleteButton);

        // Append the new list item to the task list
        taskList.appendChild(listItem);

        // Clear the input field
        taskInput.value = '';
        saveTasks(); // Save tasks after adding
    }
}

// Add an event listener to the "Add" button
addTaskButton.addEventListener('click', addTask);

// Allow adding tasks by pressing Enter in the input field
taskInput.addEventListener('keypress', function(event){
    if (event.key === 'Enter'){
        addTask();
    }
});

// Function to save tasks to local storage
function saveTasks(){
    // Placeholder for now
    console.log('Saving tasks...');
}