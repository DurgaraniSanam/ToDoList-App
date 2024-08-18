document.addEventListener("DOMContentLoaded", function () {
    const listContainer = document.getElementById("list-container");

    // Load tasks from localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => {
            addTaskToDOM(task.title, task.desc, task.date, task.completed);
        });
        sortTasks(); // Sort tasks by date after loading
    }

    // Save tasks to localStorage
    function saveTasks() {
        const tasks = [];
        document.querySelectorAll("#list-container tr").forEach(tr => {
            const title = tr.children[0].textContent;
            const desc = tr.children[1].textContent;
            const date = tr.children[2].textContent;
            const completed = tr.classList.contains("completed");
            tasks.push({ title, desc, date, completed });
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Add a task to the DOM
    function addTaskToDOM(title, desc, date, completed = false) {
        const tr = document.createElement("tr");

        // Create the title, description, date, and action cells
        tr.innerHTML = `
            <td>${title}</td>
            <td>${desc}</td>
            <td>${date}</td>
            <td class="action-cell"><img src="images/${completed ? 'checked' : 'unchecked'}.png" class="checkbox-icon" alt="Checkbox"></td>
            <td class="delete-cell"><img src="images/delete.jpg" class="delete-icon" alt="Delete"></td>
        `;

        // Apply completed class if the task is marked as completed
        if (completed) {
            tr.classList.add("completed");
        }

        // Append the new row to the task list
        listContainer.appendChild(tr);

        // Add event listeners for checking/unchecking and deleting
        const checkboxIcon = tr.querySelector(".checkbox-icon");
        const deleteIcon = tr.querySelector(".delete-icon");

        checkboxIcon.addEventListener("click", function () {
            const isChecked = checkboxIcon.getAttribute("src") === "images/unchecked.png";
            checkboxIcon.setAttribute("src", `images/${isChecked ? 'checked' : 'unchecked'}.png`);
            tr.classList.toggle("completed");
            saveTasks(); // Save the updated tasks list
        });

        deleteIcon.addEventListener("click", function () {
            tr.remove();
            saveTasks(); // Save the updated tasks list
        });
    }

    // Sort tasks by date in ascending order
    function sortTasks() {
        const rowsArray = Array.from(document.querySelectorAll("#list-container tr"));
        rowsArray.sort((a, b) => {
            const dateA = new Date(a.children[2].textContent);
            const dateB = new Date(b.children[2].textContent);
            return dateA - dateB;
        });
        rowsArray.forEach(row => listContainer.appendChild(row)); // Reorder rows
    }

    // Function to add a new task
    function addTask() {
        const title = document.getElementById("input-title").value;
        const desc = document.getElementById("input-desc").value;
        const date = document.getElementById("input-date").value;

        if (title && desc && date) {
            addTaskToDOM(title, desc, date);
            sortTasks(); // Sort tasks after adding a new one
            saveTasks(); // Save the updated tasks list

            // Clear the input fields
            document.getElementById("input-title").value = "";
            document.getElementById("input-desc").value = "";
            document.getElementById("input-date").value = "";
        } else {
            alert("Please fill in all fields");
        }
    }

    // Attach addTask function to the add button
    document.querySelector(".addtask button").addEventListener("click", addTask);

    // Load existing tasks from localStorage when the page loads
    loadTasks();
});
