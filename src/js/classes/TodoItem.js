import EventClass from "./EventClass.js";

class TodoItem extends EventClass {
  element;
  onDelete;
  id;
  title;
  status;
  priority;

  /**
   * Represents a TodoItem.
   * @constructor
   * @param {string} title - The title of the TodoItem.
   * @param {Object} options - The options for the TodoItem.
   * @param {HTMLElement} options.template - The template element for the TodoItem.
   * @param {string} options.priority - The priority of the TodoItem.
   */

  constructor(title, { template, priority }) {
    super();
    this.element = template.cloneNode(true);
    this.id = Math.random().toString(36).substr(2, 9);
    this.title = title;
    this.status = 'active';
    this.priority = priority;
    this._createTodoElement();

    return this;
  }

  _createTodoElement() {
    this.element.querySelector('.title').innerText = this.title;
    this.element.querySelector('.priority').innerText = this.priority;
    this.element.querySelector('button.delete')
      .addEventListener('click', () => this.emit("delete", this.id));
    this.element.querySelector('.toggle-checkbox')
      .addEventListener('click', () => this.emit("toggle", this.id));
    this.element.querySelector('button.edit')
      .addEventListener('click', () => this._editTodo());
    this.element.querySelector('button.save')
      .addEventListener('click', () => this._saveTodo());

    // Add drag and drop event listeners
    this.element.setAttribute('draggable', 'true');
    this.element.addEventListener('dragstart', (event) => this.emit('dragstart', this.id)(event));
    this.element.addEventListener('dragend', (event) => this.emit('dragend', this.id)(event));

    return this.element;
  }

   /** assigns events to todo item */
   _assignEventListeners() {
    // this.on('edit', this._editTodo.bind(this));
    this.on('dragstart', this._dragStart.bind(this));
    this.on('dragend', this._dragEnd.bind(this));
  }

  _editTodo() {
    this.element.querySelector('.title').style.display = 'none';
    const editInput = this.element.querySelector('.edit-input');
    editInput.style.display = 'block';
    editInput.value = this.title;
    this.element.querySelector('button.edit').style.display = 'none';
    this.element.querySelector('button.save').style.display = 'block';
  }

  _saveTodo() {
    const editInput = this.element.querySelector('.edit-input');
    this.title = editInput.value;
    this.element.querySelector('.title').innerText = this.title;
    this.element.querySelector('.title').style.display = 'block';
    editInput.style.display = 'none';
    this.element.querySelector('button.edit').style.display = 'block';
    this.element.querySelector('button.save').style.display = 'none';
    this.emit("edit", this.id, this.title);
  }

  /** handle drag start event */
  _dragStart(event) {
    event.dataTransfer.setData('text/plain', this.id);
  }

  /** handle drag end event */
  _dragEnd(event) {
    // Optional: Handle any cleanup after drag ends if necessary
  }
}

export default TodoItem;
