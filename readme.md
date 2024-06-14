# Getting Started

**Make sure you have node installed.**

- run ```npm install``` to install the server dependency.
- run ```npm start``` to start the server.

# Some information

The ```TodoList``` class is doing all of the heavy lifting. <br>
We're getting the html template from the ```#todo-item-template``` element and modifying it in order to create new todo items.

There is a very basic reactivity system in place, where ```_renderAll``` is called when the ```todos``` array is modified.

The ```TodoItem``` class has the ability to emit events which you can listen to.

# Requirements

Don't worry about getting absolutely everything done. <br>
Just do as much as you can.

### Easy

- implement add todo item function.
  - make sure that empty todo items cannot be added to the list (if the input field is empty, the todo shouldn't be added.)
- implement remove todo function.
- implement update todo status function. (toggle status based on the "statuses" class attribute)

- When the "generate" button is clicked, the input field should get filled with a random task. Use ```https://dummyjson.com/todos/random``` to get the task.
  - While the request is still loading, disable the generate button and style it accordingly.

- Make todo list items persist between reloads. (data is not lost on reload)

- The cards don't look too good in the list, add some css to fix that.
- Make the entire list responsive. (it doesn't look good on mobile devices)


### Medium

- make list items editable. (be able to modify the todo list item's text after adding to the list).
- Add priority support to todo items. (low, medium, high priority tags)
  - Add the ability to order and filter based on priority.
- Add the ability to search through the list.
- Add the abillity to drag & drop items from the active to the completed list, and vice-versa.


### Hard

- Add buttons to undo & redo actions. (create, edit, update & delete)
- Rendering optimizations
  > Right now the ```_renderAll()``` function re-renders all items whenever a change in the todos array is detected, which is very inefficient. Optimize the rendering so that only the items that are changed get updated

