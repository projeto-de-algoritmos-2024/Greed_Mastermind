// scripts/result.js

// Carregar os dados do planejamento do localStorage
const storedPlans = localStorage.getItem("plans");

// Verifica se existem dados armazenados
if (storedPlans) {
  const parsedPlans = JSON.parse(storedPlans);

  // Verifica se o formato esperado é correto
  if (parsedPlans.tasks && Array.isArray(parsedPlans.tasks)) {
    const planningType = parsedPlans.algorithm || "Sem tipo de planejamento";
    document.getElementById("planning-type").textContent = `Tipo de Planejamento: ${planningType}`;

    const tasksContainer = document.getElementById("tasks-container");

    // Funções para os algoritmos
    const intervalScheduling = (tasks) => {
      // Ordenar as tarefas por horário de término
      tasks.sort((a, b) => a.endTime.localeCompare(b.endTime));
      const selectedTasks = [];
      let lastEndTime = "00:00";

      tasks.forEach((task) => {
        if (task.startTime >= lastEndTime) {
          selectedTasks.push(task);
          lastEndTime = task.endTime;
        }
      });

      return selectedTasks;
    };

    const intervalPartitioning = (tasks) => {
      // Ordenar as tarefas por horário de início
      tasks.sort((a, b) => a.startTime.localeCompare(b.startTime));
      const classrooms = [];

      tasks.forEach((task) => {
        let assigned = false;

        // Tentar encontrar uma sala disponível
        for (let i = 0; i < classrooms.length; i++) {
          if (classrooms[i][classrooms[i].length - 1].endTime <= task.startTime) {
            classrooms[i].push(task);
            assigned = true;
            break;
          }
        }

        // Se não encontrar uma sala, criar uma nova
        if (!assigned) {
          classrooms.push([task]);
        }
      });

      return classrooms;
    };

    const minimizeLateness = (tasks) => {
      // Ordenar as tarefas por data de entrega
      tasks.sort((a, b) => a.daysUntil - b.daysUntil);
      const schedule = [];
      let currentTime = 0;
      let maxLateness = 0;

      tasks.forEach((task) => {
        currentTime += parseInt(task.difficulty);
        const lateness = Math.max(0, currentTime - parseInt(task.daysUntil));
        maxLateness = Math.max(maxLateness, lateness);
        schedule.push({ ...task, lateness });
      });

      return { schedule, maxLateness };
    };

    // Escolher o algoritmo correto com base no tipo de planejamento
    if (planningType === "intervalScheduling") {
      const selectedTasks = intervalScheduling(parsedPlans.tasks);

      selectedTasks.forEach((task, index) => {
        const taskElement = document.createElement("div");
        taskElement.classList.add("task");
        taskElement.innerHTML = `
          <h3>Tarefa ${index + 1}</h3>
          <p><strong>Atividade:</strong> ${task.activity}</p>
          <p><strong>Início:</strong> ${task.startTime}</p>
          <p><strong>Término:</strong> ${task.endTime}</p>
        `;
        tasksContainer.appendChild(taskElement);
      });
    } else if (planningType === "intervalPartitioning") {
      const classrooms = intervalPartitioning(parsedPlans.tasks);

      classrooms.forEach((classroom, index) => {
        const classroomElement = document.createElement("div");
        classroomElement.classList.add("classroom");
        classroomElement.innerHTML = `<h3>Sala ${index + 1}</h3>`;

        classroom.forEach((task) => {
          classroomElement.innerHTML += `
            <p><strong>Atividade:</strong> ${task.activity}</p>
            <p><strong>Início:</strong> ${task.startTime}</p>
            <p><strong>Término:</strong> ${task.endTime}</p>
          `;
        });

        tasksContainer.appendChild(classroomElement);
      });
    } else if (planningType === "minimizeLateness") {
      const { schedule, maxLateness } = minimizeLateness(parsedPlans.tasks);

      schedule.forEach((task, index) => {
        const taskElement = document.createElement("div");
        taskElement.classList.add("task");
        taskElement.innerHTML = `
          <h3>Tarefa ${index + 1}</h3>
          <p><strong>Atividade:</strong> ${task.activity}</p>
          <p><strong>Dificuldade:</strong> ${task.difficulty} dias</p>
          <p><strong>Dias até a entrega:</strong> ${task.daysUntil}</p>
          <p><strong>Atraso:</strong> ${task.lateness} dias</p>
        `;
        tasksContainer.appendChild(taskElement);
      });

      const latenessElement = document.createElement("div");
      latenessElement.innerHTML = `<h3>Máximo Atraso: ${maxLateness} dias</h3>`;
      tasksContainer.appendChild(latenessElement);
    } else {
      tasksContainer.innerHTML = "<p>Tipo de planejamento desconhecido.</p>";
    }
  } else {
    console.error("Os dados de tarefas estão em um formato inválido.");
  }
} else {
  console.error("Nenhum planejamento foi encontrado no localStorage.");
  document.getElementById("planning-type").textContent = "Nenhum planejamento encontrado.";
}
