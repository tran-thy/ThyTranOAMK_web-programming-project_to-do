console.log("Page is loaded.");

// Task 3
const BACKEND_ROOT_URL = 'http://localhost:3001';

// Task 4
import { Todos } from "./class/Todos.js";
const todos = new Todos(BACKEND_ROOT_URL);

const list = document.querySelector('ul');
const input = document.querySelector('input');

// Task 3.My personal add - Function to create a delete button
const createDeleteButton = (task) => {
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'x';
    deleteButton.setAttribute('class', 'delete-btn');
    deleteButton.addEventListener('click', () => {
        deleteTask(task);
    });
    return deleteButton;
}

// Task 4
input.disabled = true;

// Task 4.1 Function to render a task - add delete button
const renderTask = (task) => {
    const li = document.createElement('li');
    li.setAttribute('class', 'list-group-item');

    // Task description
    const taskDescription = document.createElement('span');
    taskDescription.innerHTML = task.getText(); // Using getText method to get the task description

    // Delete button using createDeleteButton function
    const deleteButton = createDeleteButton(task);

    // Append elements to list item
    li.appendChild(taskDescription);
    li.appendChild(deleteButton); // Append delete button to the list item

    // Append list item to task list
    list.appendChild(li);
}

// Task 4.2 Function to retrieve tasks from the backend
const getTasks = () => {
    todos.getTasks().then((tasks) => {
        tasks.forEach(task => {
            renderTask(task);
        });
        input.disabled = false;
        console.log('Data is fetched during initial loading');
    }).catch((error) => {
        alert("Error retrieving tasks: " + error.message);
    });
}

// Task 3.3_v2 Function to save a new task to the backend
const saveTask = async(task) => {
    try {
        const json = JSON.stringify({ description: task });
        const response = await fetch(BACKEND_ROOT_URL + '/new', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: json
        });
        return response.json();
    } catch (error) {
        throw new Error("Error saving task: " + error.message);
    }
};


// Task 4 Update addEventListener so it uses method implemented on Todos class - enter
input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        const task = input.value.trim();
        if (task !== '') {
            todos.addTask(task).then((task) => {
                renderTask(task);
                input.value = '';
                input.focus();
            }).catch((error) => {
                alert("Error saving task: " + error.message);
            });
        }
    }
});


// Task 4 Update addEventListener so it uses method implemented on Todos class - form submission
document.getElementById('todoForm').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    const task = input.value.trim();
    if (task !== '') {
        todos.addTask(task).then((task) => {
            renderTask(task);
            input.value = '';
            input.focus();
        }).catch((error) => {
            alert("Error saving task: " + error.message);
        });
    }
});


// Task 3.My personal add - Function to delete a task from the backend
const deleteTask = async(taskId) => {
    try {
        const response = await fetch(BACKEND_ROOT_URL + '/delete', {
            method: 'delete', // Use DELETE method
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: taskId }) // Send task ID
        });
        const json = await response.json();
        if (json.success) {
            // Remove task from UI
            const taskItem = list.querySelector(`li[data-id="${taskId}"]`);
            taskItem.remove();
        } else {
            throw new Error("Error deleting task");
        }
    } catch (error) {
        alert("Error deleting task: " + error.message);
    }
};

// Task 3 Call getTasks function after DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    getTasks();
});