// Task 3
console.log("Page is loaded.");

const BACKEND_ROOT_URL = 'http://localhost:3001';


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

// Task 3.1_v1 Function to render a task
// const renderTask = (task) => {
//     const li = document.createElement('li');
//     li.setAttribute('class', 'list-group-item');
//     li.innerHTML = task;
//     list.append(li);
// }

// Task 3.1_v2 Function to render a task - add delete button
const renderTask = (task) => {
    const li = document.createElement('li');
    li.setAttribute('class', 'list-group-item');

    // Task description
    const taskDescription = document.createElement('span');
    taskDescription.innerHTML = task;

    // Delete button
    const deleteButton = createDeleteButton(task);

    // Append elements to list item
    li.appendChild(taskDescription);
    li.appendChild(deleteButton);

    // Append list item to task list
    list.appendChild(li);
}


// Task 3.2 Function to retrieve tasks from the backend
const getTasks = async () => {
    try {
        const response = await fetch(BACKEND_ROOT_URL);
        const json = await response.json();
        json.forEach(task => {
            renderTask(task.description);
        });
        input.disabled = false;
    } catch (error) {
        alert("Error retrieving tasks: " + error.message);
    }
}


// Task 3.3_v1 Function to save a new task to the backend
// const saveTask = async (task) => {
//     try {
//         const response = await fetch(`${BACKEND_ROOT_URL}/new`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ description: task })
//         });
//         const json = await response.json();
//         return json;
//     } catch (error) {
//         throw new Error("Error saving task: " + error.message);
//     }
// }

// Task 3.3_v2 Function to save a new task to the backend
const saveTask = async (task) => {
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


// Task 3.4_v1 Event listener for Enter key press in the input field 
// input.addEventListener('keypress', async (event) => {
//     if (event.key === 'Enter') {
//         event.preventDefault();
//         const task = input.value.trim();
//         if (task !== '') {
//             try {
//                 await saveTask(task);
//                 renderTask(task);
//                 input.value = '';
//             } catch (error) {
//                 alert("Error saving task: " + error.message);
//             }
//         }
//     }
// });

// Task 3.4_v2 Event listener for Enter key press in the input field
input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        const task = input.value.trim();
        if (task !== '') {
            saveTask(task).then((json) => {
                renderTask(task);
                input.value = '';
            }).catch((error) => {
                alert("Error saving task: " + error.message);
            });
        }
    }
});

// Task 3.My personal Add - Event listener for form submission
document.getElementById('todoForm').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    const task = input.value.trim();
    if (task !== '') {
        saveTask(task).then((json) => {
            renderTask(task);
            input.value = '';
        }).catch((error) => {
            alert("Error saving task: " + error.message);
        });
    }
});

// Task 3.My personal add - Function to delete a task from the backend
const deleteTask = async (taskId) => {
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


