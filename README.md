# My Task List

## Description

This project is a simple and intuitive to-do list web application that allows users to manage their tasks effectively. You can add, complete, edit, delete, and filter your tasks to stay organized. The application also features local storage persistence, so your tasks are saved even after you close your browser.

## Features

- **Add New Tasks:** Easily add new tasks with a description and priority level (Low, Medium, High).
- **Clear Input:** Quickly clear the input field after adding a task.
- **Mark Tasks as Complete:** Toggle the completion status of tasks with a checkbox. Completed tasks are visually marked.
- **Edit Tasks:** Modify the text of existing tasks.
- **Delete Tasks:** Remove tasks from the list.
- **Filter Tasks:** View all tasks, only active tasks, or only completed tasks.
- **Clear Completed Tasks:** Remove all tasks that have been marked as complete.
- **Clear All Tasks:** Remove all tasks from the list (with confirmation).
- **Select All:** Quickly mark all tasks as complete or active.
- **Priority Levels:** Assign a priority (Low, Medium, High) to each task, visually indicated by a colored left border.
- **Local Storage Persistence:** Your tasks are saved in your browser's local storage, so they persist across sessions.
- **Modern and Clean UI:** A user-friendly interface with a focus on clarity and ease of use, styled with a tech-savvy aesthetic.

## How to Use

To use the Task List application, simply open the `index.html` file in your web browser.

1.  **Adding Tasks:** Type your task into the "Add new task..." input field. Select the priority from the dropdown (optional). Click the "Add" button or press Enter.
2.  **Clearing Input:** Click the "X" button next to the input field to clear it.
3.  **Completing Tasks:** Click the checkbox next to a task to mark it as complete. The task text will be struck through.
4.  **Editing Tasks:** Click the "✏️" button next to a task. The task text will become an editable input field. Modify the text and click the "Save" button (💾) or press Enter to save your changes.
5.  **Deleting Tasks:** Click the "🗑️" button next to a task to remove it.
6.  **Filtering Tasks:** Use the "Show All", "Show Active", and "Show Completed" buttons to filter the task list.
7.  **Clearing Completed Tasks:** Click the "Clear Completed Tasks" button to remove all completed tasks (requires confirmation).
8.  **Clearing All Tasks:** Click the "Clear All Tasks" button to remove all tasks from the list (requires confirmation).
9.  **Selecting All Tasks:** Check the "Select All" checkbox to mark all tasks as complete. Uncheck it to mark all as active.

## File Structure

- `index.html`: The main HTML file containing the structure of the application.
- `style.css`: The CSS file containing all the styling rules for the application.
- `script.js`: The JavaScript file containing the application's logic and functionality.

## Refactoring and Improvements

During the development process, the following key improvements were made:

- **JavaScript Refactoring:** The JavaScript code was reorganized into functions for better readability and maintainability. Event listeners were grouped, and logic was encapsulated in specific functions.
- **CSS Enhancement:** The CSS was tidied up using logical sections and CSS variables for consistent styling and easy customization of colors. A modern and clean user interface with a tech-inspired dark theme was implemented.
- **Removal of `@extend`:** The non-standard `@extend` rule was replaced with standard CSS practices using multiple class names in the HTML for better compatibility.
- **Accessibility Improvements:** Focus styles were enhanced for better keyboard navigation.

## Technologies Used

- HTML
- CSS
- JavaScript

## Further Improvements (Optional)

Here are some ideas for potential future enhancements:

- **Drag and Drop Reordering:** Allow users to reorder tasks by dragging and dropping them.
- **Due Dates and Reminders:** Add the ability to set due dates and receive reminders for tasks.
- **Task Categories or Tags:** Implement a system for categorizing tasks.
- **More Advanced Styling Options:** Allow users to customize the appearance with different themes.
- **Undo/Redo Functionality:** Implement the ability to undo or redo actions.
- **Cloud Synchronization:** Enable task synchronization across multiple devices.
