// scripts/result.js

// Carregar os dados do planejamento do localStorage
const storedPlans = localStorage.getItem("plans");

// Verifica se existem dados armazenados
if (storedPlans) {
  const parsedPlans = JSON.parse(storedPlans);

  // Verifica se o formato esperado é correto
  if (parsedPlans.tasks && Array.isArray(parsedPlans.tasks)) {
    console.log("Formato dos dados verificado: 'tasks' é um array.");
    const planningType = parsedPlans.algorithm || "Sem tipo de planejamento";
    const tasksContainer = document.getElementById("tasks-container");
    console.log(`Tipo de planejamento identificado: ${planningType}`);

    // Funções para os algoritmos
    const intervalScheduling = (tasks) => {
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
      tasks.sort((a, b) => a.startTime.localeCompare(b.startTime));
      const classrooms = [];

      tasks.forEach((task) => {
        let assigned = false;

        for (let i = 0; i < classrooms.length; i++) {
          if (classrooms[i][classrooms[i].length - 1].endTime <= task.startTime) {
            classrooms[i].push(task);
            assigned = true;
            break;
          }
        }

        if (!assigned) {
          classrooms.push([task]);
        }
      });

      return classrooms;
    };

    const minimizeLateness = (tasks) => {
      console.log("Função minimizeLateness iniciada.");
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

    // Função separada para o planejamento 'minimizeLateness'
    if (planningType === "minimizeLateness") {
      const { schedule, maxLateness } = minimizeLateness(parsedPlans.tasks);

      // Exibir todas as tarefas minimizando o atraso
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
      // Criar um mapeamento para organizar tarefas por dia da semana
      const daysOfWeek = ["segunda", "terça", "quarta", "quinta", "sexta", "sábado", "domingo"];
      const tasksByDay = {};

      daysOfWeek.forEach((day) => {
        tasksByDay[day] = parsedPlans.tasks.filter((task) => task.day === day);
      });

      // Processar cada dia da semana para os tipos 'intervalScheduling' e 'intervalPartitioning'
      daysOfWeek.forEach((day) => {
        const tasksForDay = tasksByDay[day];

        if (tasksForDay.length > 0) {
          const dayContainer = document.createElement("div");
          dayContainer.classList.add("day-container");
          dayContainer.innerHTML = `<h2>${day.charAt(0).toUpperCase() + day.slice(1)}</h2>`;

          if (planningType === "intervalScheduling") {
            const selectedTasks = intervalScheduling(tasksForDay);

            selectedTasks.forEach((task, index) => {
              const taskElement = document.createElement("div");
              taskElement.classList.add("task");
              taskElement.innerHTML = `
                <h3>Tarefa ${index + 1}</h3>
                <p><strong>Atividade:</strong> ${task.activity}</p>
                <p><strong>Início:</strong> ${task.startTime}</p>
                <p><strong>Término:</strong> ${task.endTime}</p>
              `;
              dayContainer.appendChild(taskElement);
            });
          } else if (planningType === "intervalPartitioning") {
            const classrooms = intervalPartitioning(tasksForDay);

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

              dayContainer.appendChild(classroomElement);
            });
          } else {
            dayContainer.innerHTML += "<p>Tipo de planejamento desconhecido.</p>";
          }

          tasksContainer.appendChild(dayContainer);
        }
      });
    }
  } else {
    console.error("Os dados de tarefas estão em um formato inválido.");
  }
} else {
  console.error("Nenhum planejamento foi encontrado no localStorage.");
  document.getElementById("planning-type").textContent = "Nenhum planejamento encontrado.";
}

// Adicionar evento ao botão "Voltar para a Página Inicial"
const backToHomeButton = document.getElementById("back-to-home");
if (backToHomeButton) {
  backToHomeButton.addEventListener("click", () => {
    window.location.href = "index.html"; // Redirecionar para a página inicial
  });
}
