const taskInput = document.getElementById('taskInput');
        const dueDateInput = document.getElementById('dueDateInput');
        const addTaskBtn = document.getElementById('addTaskBtn');
        const taskList = document.getElementById('taskList');

        addTaskBtn.addEventListener('click', () => {
            const description = taskInput.value;
            const dueDate = dueDateInput.value;
            if (description.trim() !== '' && dueDate !== '') {
                addTask(description, dueDate);
                updateTaskList();
                taskInput.value = '';
                dueDateInput.value = '';
            }
        });

        function addTask(description, dueDate) {
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            tasks.push({ description, dueDate, completed: false, completedDate: null });
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }

        function updateTaskList() {
            taskList.innerHTML = '';
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            const currentDate = new Date();
            tasks.forEach((task, index) => {
                const dueDate = new Date(task.dueDate);
                const isOverdue = dueDate < currentDate && !task.completed;

                const li = document.createElement('li');
                li.innerHTML = `
                    <input class="w3-check" type="checkbox" id="check-${index}" ${task.completed ? 'checked' : ''}>
                    <span><span class="w3-font-bold">${task.description}</span> <i>(Data de Previsão: ${task.dueDate})</i></span>
                    <span>${isOverdue ? '<span class="w3-tag w3-red w3-round">Atrasada</span>' : ''}</span>
                    <button class="w3-button w3-round w3-blue" id="edit-${index}"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="w3-button w3-round w3-text-red w3-hover-red" id="delete-${index}"><i class="fa-solid fa-trash"></i></button>
                `;
                taskList.appendChild(li);

                const checkbox = document.getElementById(`check-${index}`);
                checkbox.addEventListener('change', () => {
                    tasks[index].completed = checkbox.checked;
                    tasks[index].completedDate = checkbox.checked ? new Date().toISOString() : null;
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                    updateTaskList();
                });

                const editBtn = document.getElementById(`edit-${index}`);
                editBtn.addEventListener('click', () => {
                    const newDescription = prompt('Digite a nova descrição:', tasks[index].description);
                    if (newDescription !== null) {
                        tasks[index].description = newDescription;
                        localStorage.setItem('tasks', JSON.stringify(tasks));
                        updateTaskList();
                    }
                });

                const deleteBtn = document.getElementById(`delete-${index}`);
                deleteBtn.addEventListener('click', () => {
                    tasks.splice(index, 1);
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                    updateTaskList();
                });
            });
        }

        updateTaskList();