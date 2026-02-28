let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const quotes = [
"Small progress is still progress 🌿",
"Discipline creates freedom ✨",
"Focus on your goals💚",
"Consistency beats motivation 🔥"
];

document.getElementById("quote").innerText =
quotes[Math.floor(Math.random() * quotes.length)];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function showScreen(id) {
    document.querySelectorAll(".screen").forEach(screen =>
        screen.classList.remove("active")
    );
    document.getElementById(id).classList.add("active");
}

function openModal() {
    document.getElementById("taskModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("taskModal").style.display = "none";
}

function addTask() {
    const title = taskInput.value;
    const date = taskDate.value;
    const time = taskTime.value;
    const reminderValue = parseInt(document.getElementById("reminderValue").value) || 0;
    const reminderType = document.getElementById("reminderType").value;

tasks.push({
    id: Date.now(),
    title,
    date,
    time,
    reminderValue,
    reminderType,
    completed: false,
    reminded: false
});
    saveTasks();
    renderTasks();
    closeModal();
}

function renderTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    let pending = 0;
    let completed = 0;

    tasks.forEach(task => {

        const li = document.createElement("li");

        li.innerHTML = `
            <span class="${task.completed ? 'completed':''}">
            ${task.title}
            </span>
            <div>
                <button onclick="toggleComplete(${task.id})">✔</button>
                <button onclick="deleteTask(${task.id})">🗑</button>
            </div>
        `;

        list.appendChild(li);

        task.completed ? completed++ : pending++;
    });

    pendingCount.innerText = pending;
    completedCount.innerText = completed;
}

function toggleComplete(id){
    tasks = tasks.map(task =>
        task.id === id ? {...task, completed: !task.completed} : task
    );
    saveTasks();
    renderTasks();
}

function deleteTask(id){
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

setInterval(() => {
    const now = new Date();

    tasks.forEach(task => {
        if (task.completed || task.reminded) return;

        const taskDateTime = new Date(`${task.date}T${task.time}`);
        let reminderTime = new Date(taskDateTime);

        if (task.reminderType === "minutes") {
            reminderTime.setMinutes(reminderTime.getMinutes() - task.reminderValue);
        } 
        else if (task.reminderType === "hours") {
            reminderTime.setHours(reminderTime.getHours() - task.reminderValue);
        } 
        else if (task.reminderType === "days") {
            reminderTime.setDate(reminderTime.getDate() - task.reminderValue);
        }

        if (now >= reminderTime && now < taskDateTime) {
            alert(`Reminder: ${task.title}`);
            task.reminded = true;
            saveTasks();
        }
    });
}, 60000);

renderTasks();