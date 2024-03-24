// import { response } from 'express';
import { Task } from './Task.js';

class Todos {
  #tasks = [];
  #backend_url = '';

  constructor(url) {
    this.#backend_url = url;
  }

  getTasks() {
    return new Promise((resolve, reject) => {
      fetch(this.#backend_url)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch tasks');
          }
          return response.json();
        })
        .then((json) => {
          this.#readJson(json);
          resolve(this.#tasks);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  addTask = (text) => {
    return new Promise(async (resolve, reject) => {
      const json = JSON.stringify({ description: text });
      fetch(this.#backend_url + '/new', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: json,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to add task');
          }
          return response.json();
        })
        .then((json) => {
          resolve(this.#addToArray(json.id, text));
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  #readJson = (tasksAsJson) => {
    tasksAsJson.forEach((node) => {
      const task = new Task(node.id, node.description);
      this.#tasks.push(task);
    });
  };

  #addToArray = (id, text) => {
    const task = new Task(id, text);
    this.#tasks.push(task);
    return task;
  };

}

export { Todos };