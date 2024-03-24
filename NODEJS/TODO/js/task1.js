//Task 1: The code for my to-do
document.addEventListener('DOMContentLoaded', function() {
  const taskList = document.querySelector('ul');
  const input = document.querySelector('input');

  let taskCounter = 1;

  // Clear localStorage when the page is loaded
  localStorage.clear();

  function loadTasks() {
      const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
      savedTasks.forEach(task => {
          const newTaskItem = document.createElement('li');
          newTaskItem.classList.add('list-group-item');
          newTaskItem.textContent = task;
          taskList.appendChild(newTaskItem);
          taskCounter++;
      });
  }

  loadTasks();

  const todoForm = document.getElementById('todoForm');
  todoForm.addEventListener('submit', function(event) {
      event.preventDefault();
      addTask();
  });

  input.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
          event.preventDefault();
          addTask();
      }
  });

  function addTask() {
      const taskInput = input.value.trim();
      if (taskInput !== '') {
          const currentTime = new Date().toLocaleTimeString();
          const taskContent = `${taskCounter}. ${taskInput} - ${currentTime}`;
          const newTaskItem = document.createElement('li');
          newTaskItem.classList.add('list-group-item');
          newTaskItem.textContent = taskContent;
          taskList.appendChild(newTaskItem);

          const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
          savedTasks.push(taskContent);
          localStorage.setItem('tasks', JSON.stringify(savedTasks));

          taskCounter++;
          input.value = '';
      }
  }
});


