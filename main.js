const formEl = document.querySelector('#create-todo-item');
const inputEl = document.querySelector('.js-add-todo');
const listEl = document.querySelector('.js-todo-list');

let allTodos = [];

// Restore from localStorage
if (localStorage.getItem('todo')) {
    allTodos = JSON.parse(localStorage.getItem('todo'));

    for (const item of allTodos) {
        addTodoToList(item);
    }
}

/**
 * @param {*} todoItemText 
 */
function addTodoToList(todoItem) {
    const html = `
        <li class="list-group-item d-flex justify-content-between align-items-center ">
            <input 
                class="form-check-input me-1" 
                type="checkbox" 
                value="" 
                id="${todoItem.id}" 
            >
            <input 
                class="form-control form-control-sm me-1" 
                type="text" 
                value="${todoItem.text}" 
                id="${todoItem.id}-text"
            >
            <select 
                class="form-select form-select-sm me-1" 
                id="${todoItem.id}-status"
            >
                <option value="active" ${todoItem.status === "active" ? "selected" : ""}>Active</option>
                <option value="completed" ${todoItem.status === "completed" ? "selected" : ""}>Completed</option>
            </select>
            <button class="btn btn-sm btn-danger" data-taskId="${todoItem.id}">Del</button>
        </li>
    `;
    listEl.innerHTML += html;
    inputEl.value = '';
}


/**
 * @param {*} target
 */
function completeTask(target) {
    const taskId = Number(target.id);


    allTodos.forEach((todoItem) => {
        if (todoItem.id === taskId) {
            todoItem.status = 'completed';
        }
    });

    localStorage.setItem('todo', JSON.stringify(allTodos));
}

/**
 * @param {*} target
 */
function removeTask(target) {
    const taskId = Number(target.getAttribute('data-taskId'));
    const parent = target.parentElement;

    allTodos.forEach((todoItem) => {
        if (todoItem.id === taskId) {
            allTodos.splice(allTodos.indexOf(todoItem), 1);
        }
    });

    localStorage.setItem('todo', JSON.stringify(allTodos));

    parent.remove();
}

formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const todoItemText = inputEl.value;

    const existingTodoItem = allTodos.filter((item) => item.text === todoItemText);

    if (!existingTodoItem.length) { 
        const todoItem = {
            id: new Date().getTime(),
            text: todoItemText,
            status: 'active'
        };

        addTodoToList(todoItem);

        allTodos.push(todoItem);

        localStorage.setItem('todo', JSON.stringify(allTodos));
    } else {
        alert('This todo is already in the list');
    }
});


listEl.addEventListener('click', (e) => {
    if (e.target.tagName === 'INPUT') {
   
        completeTask(e.target);
    } else if (e.target.tagName === 'BUTTON') {

        removeTask(e.target);
    }
});


listEl.addEventListener('click', (e) => {
    if (e.target.tagName === 'INPUT') {
        
        completeTask(e.target);
    } else if (e.target.tagName === 'LABEL') {
     
        const taskId = Number(e.target.getAttribute('for'));
        const listItem = e.target.parentElement;
        const todoText = listItem.querySelector('.form-check-label');
        
      
        const inputField = document.createElement('input');
        
        inputField.type = 'text';
        inputField.value = todoText.textContent;
        listItem.replaceChild(inputField, todoText);

    
        inputField.addEventListener('blur', () => {
            const newText = inputField.value;
            
            allTodos.forEach((todoItem) => {
                if (todoItem.id === taskId) {
                    todoItem.text = newText;
                }
            });

          
            localStorage.setItem('todo', JSON.stringify(allTodos));

        
            const updatedTodoText = document.createElement('label');
            updatedTodoText.className = 'form-check-label';
            updatedTodoText.setAttribute('for', taskId);
            updatedTodoText.textContent = newText;
            listItem.replaceChild(updatedTodoText, inputField);
        });
    } else if (e.target.tagName === 'BUTTON') {k
        removeTask(e.target);
    }
});
function editTask(taskId) {
    const listItem = document.getElementById(taskId);
    const todoText = listItem.querySelector('.form-check-label');
    const checkbox = listItem.querySelector('input[type="checkbox"]');

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = todoText.textContent;
    listItem.replaceChild(inputField, todoText);

    const saveButton = listItem.querySelector('.save-btn');
    saveButton.addEventListener('click', () => {
        const newText = inputField.value;
        const newStatus = checkbox.checked ? 'completed' : 'active';
        localStorage.setItem('todo', JSON.stringify(allTodos));

        allTodos.forEach((todoItem) => {
            if (todoItem.id === taskId) {
                todoItem.text = newText;
                todoItem.status = newStatus;
            }
        });
        localStorage.setItem('todo', JSON.stringify(allTodos));

        
        
    });

}



