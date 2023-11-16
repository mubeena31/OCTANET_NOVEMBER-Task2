document.addEventListener("DOMContentLoaded", function () {
    var taskInput = document.getElementById("new-task");
    var deadlineInput = document.getElementById("new-deadline");
    var prioritySelect = document.getElementById("new-priority");
    var labelInput = document.getElementById("new-label");
    var addButton = document.getElementById("addButton");
    var incompleteTasksHolder = document.getElementById("incomplete-tasks");
    var completedTasksHolder = document.getElementById("completed-tasks");
    var deletedTasksHolder = document.getElementById("deleted-tasks");

    addButton.addEventListener("click", addTask);

    function createNewTaskElement(taskString, deadlineString, priorityString, labelString, enableButtons) {
        var listItem = document.createElement("li");
        var checkBox = document.createElement("input");
        var label = document.createElement("label");
        var deadline = document.createElement("span");

        checkBox.type = "checkbox";
        checkBox.setAttribute("data-priority", priorityString);

        label.innerText = taskString;
        deadline.innerText = "Deadline: " + deadlineString;

        listItem.appendChild(checkBox);
        listItem.appendChild(label);
        listItem.appendChild(deadline);

        if (enableButtons) {
            var buttonsContainer = document.createElement("div");
            buttonsContainer.className = "task-buttons";

            var editButton = document.createElement("button");
            var deleteButton = document.createElement("button");

            editButton.innerText = "Edit";
            editButton.className = "edit";
            deleteButton.innerText = "Delete";
            deleteButton.className = "delete";

            buttonsContainer.appendChild(editButton);
            buttonsContainer.appendChild(deleteButton);
            listItem.appendChild(buttonsContainer);
        }

        return listItem;
    }

    function addTask() {
        var taskValue = taskInput.value;
        var deadlineValue = deadlineInput.value;
        var priorityValue = prioritySelect.value;
        var labelValue = labelInput.value;

        if (taskValue.trim() !== "") {
            var listItem = createNewTaskElement(taskValue, deadlineValue, priorityValue, labelValue, true);

            var tasks = incompleteTasksHolder.children;
            var insertIndex = tasks.length;

            for (var i = 0; i < tasks.length; i++) {
                var taskPriority = tasks[i].querySelector("input[type=checkbox]").getAttribute("data-priority");

                if (priorityValue === "high" && taskPriority !== "high") {
                    insertIndex = i;
                    break;
                } else if (priorityValue === "medium" && taskPriority === "low") {
                    insertIndex = i;
                    break;
                } else if (priorityValue === "low" && taskPriority === "medium") {
                    insertIndex = i + 1;
                    break;
                }
            }

            incompleteTasksHolder.insertBefore(listItem, tasks[insertIndex]);
            bindTaskEvents(listItem, taskCompleted);

            taskInput.value = "";
            deadlineInput.value = "";
            prioritySelect.value = "low";
            labelInput.value = "";
        } else {
            alert("Please enter a task before adding.");
        }
    }

    function taskCompleted() {
        var listItem = this.parentNode;
        completedTasksHolder.appendChild(listItem);
        bindTaskEvents(listItem, taskIncomplete);
    }

    function taskIncomplete() {
        var listItem = this.parentNode;
        incompleteTasksHolder.appendChild(listItem);
        bindTaskEvents(listItem, taskCompleted);
    }

    function bindTaskEvents(taskListItem, checkBoxEventHandler) {
        var checkBox = taskListItem.querySelector("input[type=checkbox]");
        var buttonsContainer = taskListItem.querySelector(".task-buttons");
        var editButton = taskListItem.querySelector(".edit");
        var deleteButton = taskListItem.querySelector(".delete");

        if (editButton) {
            editButton.onclick = editTask;
        }

        if (deleteButton) {
            deleteButton.onclick = deleteTask;
        }

        checkBox.onchange = checkBoxEventHandler;

        // Remove edit and delete buttons for tasks in the "Deleted" category
        if (deletedTasksHolder.contains(taskListItem)) {
            if (buttonsContainer) {
                buttonsContainer.parentNode.removeChild(buttonsContainer);
            }
        }
    }

    function editTask() {
        var listItem = this.parentNode.parentNode; // Adjusted to reach the task's container
        var label = listItem.querySelector("label");
        var containsClass = listItem.classList.contains("editMode");

        if (containsClass) {
            label.innerText = taskInput.value;
        } else {
            taskInput.value = label.innerText;
        }

        listItem.classList.toggle("editMode");
    }

    function deleteTask() {
        var listItem = this.parentNode.parentNode; // Adjusted to reach the task's container
        var ul = listItem.parentNode;
        ul.removeChild(listItem);

        // Move deleted task to the "Deleted" category
        listItem.classList.remove("editMode"); // Ensure it's not in edit mode
        deletedTasksHolder.appendChild(listItem);
        bindTaskEvents(listItem, taskUndeleted);
    }

    function taskUndeleted() {
        var listItem = this.parentNode;
        incompleteTasksHolder.appendChild(listItem);
        bindTaskEvents(listItem, taskCompleted);
    }
});
