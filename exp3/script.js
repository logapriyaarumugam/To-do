let tasks = [
    { id: 1, text: "Read Maths for AI SA", date: "", priority: "High", completed: false },
    { id: 2, text: "Submit Maths for AI Experiments", date: "", priority: "High", completed: false },
    { id: 3, text: "Java Module 1", date: "", priority: "Medium", completed: false },
    { id: 4, text: "Read Prompt SA", date: "", priority: "Medium", completed: false },
    { id: 5, text: "Cloth Folding", date: "", priority: "Low", completed: false }
];

let filter = "all";

if (localStorage.getItem("taskNest")) {
    tasks = JSON.parse(localStorage.getItem("taskNest"));
}

function saveTasks() {
    localStorage.setItem("taskNest", JSON.stringify(tasks));
}

function addTask() {
    let text = document.getElementById("taskInput").value.trim();
    let date = document.getElementById("taskDate").value;
    let priority = document.getElementById("priority").value;

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        id: Date.now(),
        text: text,
        date: date,
        priority: priority,
        completed: false
    });

    document.getElementById("taskInput").value = "";
    document.getElementById("taskDate").value = "";

    saveTasks();
    displayTasks();
}

function displayTasks() {
    let list = document.getElementById("taskList");
    list.innerHTML = "";

    let filtered = tasks.filter(task => {
        if (filter === "pending") return !task.completed;
        if (filter === "completed") return task.completed;
        return true;
    });

    if (filtered.length === 0) {
        list.textContent = "No tasks found!";
    }

    filtered.forEach(task => {
        let card = document.createElement("div");
        card.className = "task-card";

        if (task.completed) {
            card.classList.add("done");
        }

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.onchange = function() {
            task.completed = checkbox.checked;
            saveTasks();
            displayTasks();
        };

        let details = document.createElement("div");
        details.className = "task-details";

        let title = document.createElement("strong");
        title.textContent = task.text;

        let info = document.createElement("small");
        info.textContent =
            "Due: " + (task.date || "Not set") +
            " | Priority: " + task.priority;

        details.append(title, info);

        let actions = document.createElement("div");
        actions.className = "actions";

        let edit = document.createElement("button");
        edit.textContent = "Edit";
        edit.className = "edit";

        edit.onclick = function() {
            let newText = prompt("Edit your task:", task.text);

            if (newText !== null && newText.trim() !== "") {
                task.text = newText.trim();
                saveTasks();
                displayTasks();
            }
        };

        let del = document.createElement("button");
        del.textContent = "Delete";
        del.className = "delete";

        del.onclick = function() {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            displayTasks();
        };

        actions.append(edit, del);
        card.append(checkbox, details, actions);
        list.appendChild(card);
    });

    updateDashboard();
}

function updateDashboard() {
    let total = tasks.length;
    let completed = tasks.filter(t => t.completed).length;
    let pending = total - completed;

    document.getElementById("total").textContent = total;
    document.getElementById("completed").textContent = completed;
    document.getElementById("pending").textContent = pending;
}

function setFilter(value) {
    filter = value;

    document.querySelectorAll(".filters button").forEach(button => {
        button.classList.remove("active");
    });

    event.target.classList.add("active");

    displayTasks();
}

displayTasks();
