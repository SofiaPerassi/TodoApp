import { createDeepObserver } from "../helpers.js"; 
import TodoItem from "./TodoItem.js";

class TodoList {
  template;
  todos;
  statuses = {
    ACTIVE: 'active',
    COMPLETED: 'completed',
  };

  constructor() {
    this._setTodoTemplate();
    this.todos = createDeepObserver([], this._renderAll.bind(this));
    this._loadTodosFromLocalStorage();
    this._assignFormEventListeners();
    this._assignSearchEventListener();
    // this._assignDragAndDropEventListeners();
  }

  /** creates new todoItem instance, sets events and adds it to the todos list */
  addTodo(title, priority) {
    // TODO: Implement the logic to add a new todo item to the list
    if (title) {
      const newTodo = new TodoItem(title, { template: this.template, priority });
      newTodo.on('delete', this.deleteTodo.bind(this));
      newTodo.on('toggle', this.toggleTodoStatus.bind(this));
      newTodo.on('edit', this.editTodo.bind(this));
      // newTodo.on('dragstart', this._handleDragStart.bind(this)); // Handle drag start
      // newTodo.on('dragend', this._handleDragEnd.bind(this)); // Handle drag end
      this.todos.push(newTodo);
      this._saveTodosToLocalStorage();
    }
  }

  /** toggles todo item status based on given id */
  toggleTodoStatus(id) {
    // TODO: Implement the logic to toggle the status of a todo item
    const todo = this.todos.find(todo => todo.id === id);
    if (todo) {
      todo.status = todo.status === this.statuses.ACTIVE ? this.statuses.COMPLETED : this.statuses.ACTIVE;
      this._renderAll();
      this._saveTodosToLocalStorage();
    }  
  }

  /** deletes todo item based on given id */
  deleteTodo(id) {
    // TODO: Implement the logic to delete a todo item from the list
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
      this.todos.splice(index, 1);
      this._renderAll();
      this._saveTodosToLocalStorage();
    }  
  }

  /** edits todo item based on given id */
  editTodo(id, newTitle){
    const todo = this.todos.find(todo => todo.id === id);
    console.log(todo);
    if (todo) {
      // todo.title = newTitle;
      console.log(todo)
      this._renderAll();
      this._saveTodosToLocalStorage();
    }
  }

  // Generates a random task and puts it on the input field to be added 
  async generateTodo(){
    try {
      const response = await fetch('https://dummyjson.com/todos/random');
      const data = await response.json();
      const input = document.getElementById('todo-input');
      input.value = data.todo    
    } catch (error) {
      console.error('Error fetching random todo:', error);
    }
  }

  //  Saves the todos array to local storage
   _saveTodosToLocalStorage() {
    const todosData = this.todos.map(todo => ({
      id: todo.id,
      title: todo.title,
      status: todo.status,
      priority: todo.priority
    }));
    localStorage.setItem('todos', JSON.stringify(todosData));
  }

  // Loads the todos array from local storage 
  _loadTodosFromLocalStorage() {
    const todosData = JSON.parse(localStorage.getItem('todos') || '[]');
    todosData.forEach(todoData => {
      const todo = new TodoItem(todoData.title, { template: this.template, priority: todoData.priority });
      todo.id = todoData.id; // Restore the original id
      todo.status = todoData.status;
      todo.on('delete', this.deleteTodo.bind(this));
      todo.on('toggle', this.toggleTodoStatus.bind(this));
      todo.on('edit', this.editTodo.bind(this));
      // todo.on('dragstart', this._handleDragStart.bind(this)); // Handle drag start
      // todo.on('dragend', this._handleDragEnd.bind(this)); // Handle drag end
      this.todos.push(todo);
    });
    this._renderAll();
  }

  /** Sets todoItem template html */
  _setTodoTemplate() {
    const templateElement = document.getElementById('todo-item-template');
    templateElement.removeAttribute('id');
    this.template = templateElement.cloneNode(true);
    templateElement.remove();
  }

  /** populates given list element with given todo items */
  _render(listElement, todos) {
    listElement.innerHTML = '';
    todos.forEach(todo => {
      listElement.appendChild(todo.element);
    });
  }

  // renders all todos based on their status
  _renderAll() {
    Object.values(this.statuses).forEach(status => {
      const filteredTodos = this.todos.filter(todo => todo.status === status);
      const statusElement = document.querySelector(`#${status}-list .list-container`);
      this._render(statusElement, filteredTodos);
    });
  }
  
  /** assigns event listeners to form elements */
  _assignFormEventListeners() {
    const addTodoHandler = () => {
      const priority = document.getElementById('todo-priority').value;
      this.addTodo(input.value, priority);      
      input.value = '';
    };

    // Find required elements
    const input = document.getElementById('todo-input');
    const addButton = document.getElementById('add_button');

    // Add event listeners to input field
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        addTodoHandler();
      }
    });
    addButton.addEventListener('click', addTodoHandler);
    
    // TODO: When the "Generate" button is clicked, fetch a random task and add it to the input field
    const generateButton = document.getElementById('generate_button');

    generateButton.addEventListener('click', this.generateTodo);

    // const priorityFilter = document.getElementById('priority-filter');
    // priorityFilter.addEventListener('change', (e) => {
    //   const priority = e.target.value;
    //   if (priority !== 'all') {
    //     this.filterTodosByPriority(priority);
    //   } else {
    //     this._renderAll();
    //   }
    // });

    // const sortByPriorityButton = document.getElementById('sort-by-priority');
    // sortByPriorityButton.addEventListener('click', () => {
    //   this.sortTodosByPriority();
    // });
  }

  /** assigns event listener to search input */
  _assignSearchEventListener() {
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      this._searchTodos(query);
    });
  }
  
  // Filters todos based on search query 
  _searchTodos(query) {
    Object.values(this.statuses).forEach(status => {
      const filteredTodos = this.todos.filter(todo => todo.status === status && todo.title.toLowerCase().includes(query));
      const statusElement = document.querySelector(`#${status}-list .list-container`);
      this._render(statusElement, filteredTodos);
    });
  }

  /** Filters todos based on priority */
  // filterTodosByPriority(priority) {
  //   const filteredTodos = this.todos.filter(todo => todo.priority === priority);
  //   this._renderAll(filteredTodos);
  // }

  // /** Sorts todos by priority */
  // sortTodosByPriority() {
  //   const sortedTodos = [...this.todos].sort((a, b) => {
  //     if (a.priority === 'high') return -1;
  //     if (b.priority === 'high') return 1;
  //     if (a.priority === 'medium' && b.priority === 'low') return -1;
  //     if (a.priority === 'low' && b.priority === 'medium') return 1;
  //     return 0;
  //   });
  //   this._renderAll(sortedTodos);
  // }

  // _assignDragAndDropEventListeners() {
  //   const activeList = document.querySelector('#active-list .list-container');
  //   const completedList = document.querySelector('#completed-list .list-container');

  //   activeList.addEventListener('dragover', this._handleDragOver.bind(this));
  //   activeList.addEventListener('drop', this._handleDrop.bind(this));

  //   completedList.addEventListener('dragover', this._handleDragOver.bind(this));
  //   completedList.addEventListener('drop', this._handleDrop.bind(this));
  // }

  // _handleDragOver(event) {
  //   event.preventDefault();
  // }

  // _handleDrop(event) {
  //   event.preventDefault();
  //   const todoId = event.dataTransfer.getData('text/plain');
  //   const newStatus = event.currentTarget.closest('ul').id.includes('active') ? this.statuses.ACTIVE : this.statuses.COMPLETED;
  //   this._updateTodoStatus(todoId, newStatus);
  // }

  // _handleDragStart(event) {
  //   event.dataTransfer.setData('text/plain', event.target.id);
  // }

  // _updateTodoStatus(id, newStatus) {
  //   const todo = this.todos.find(todo => todo.id === id);
  //   if (todo) {
  //     todo.status = newStatus;
  //     this._renderAll();
  //     this._saveTodosToLocalStorage();
  //   }
  // }

}

export default TodoList;
