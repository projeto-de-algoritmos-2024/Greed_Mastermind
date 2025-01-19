document.addEventListener("DOMContentLoaded", function () {
  // Verifica se o botão "add-plan" existe antes de adicionar o evento
  const addPlanButton = document.getElementById("add-plan");
  if (addPlanButton) {
    addPlanButton.addEventListener("click", function () {
      const dropdown = document.getElementById("plan-dropdown");
      dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
    });
  }

  // Verifica se os botões do dropdown existem antes de adicionar os eventos
  const planDropdownButtons = document.querySelectorAll("#plan-dropdown button");
  if (planDropdownButtons.length > 0) {
    planDropdownButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const planType = this.getAttribute("data-plan");
        window.location.href = `add.html?type=${planType}`;
      });
    });
  }

  // Verifica se está na página "add.html" antes de renderizar o formulário
  if (window.location.pathname.includes("add.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    const planningType = urlParams.get("type");
    const formContainer = document.getElementById("formContainer");

    if (formContainer) {
      // Função para gerar um formulário baseado no tipo de planejamento
      const createForm = () => {
        let formHTML = "";
        if (planningType === "minimizeLateness") {
          formHTML = `
            <form class="task-form">
              <label for="activity">Nome da Atividade:</label>
              <input type="text" id="activity" name="activity" required>
              
              <label for="difficulty">Dificuldade em dias:</label>
              <input type="number" id="difficulty" name="difficulty" required>
              
              <label for="daysUntil">Dias até a entrega:</label>
              <input type="number" id="daysUntil" name="daysUntil" required>
            </form>
          `;        
        } else if (planningType === "intervalPartitioning") {
          formHTML = `
            <form class="task-form">
              <label for="activity">Nome da Atividade:</label>
              <input type="text" name="activity" required>
              <label for="day">Dia da Semana:</label>
              <select name="day" required>
                <option value="segunda">Segunda</option>
                <option value="terça">Terça</option>
                <option value="quarta">Quarta</option>
                <option value="quinta">Quinta</option>
                <option value="sexta">Sexta</option>
                <option value="sábado">Sábado</option>
                <option value="domingo">Domingo</option>
              </select>
              <label for="startTime">Hora de Início:</label>
              <input type="time" name="startTime" required>
              <label for="endTime">Hora de Término:</label>
              <input type="time" name="endTime" required>
            </form>
          `;
        } else if (planningType === "intervalScheduling") {
          formHTML = `
            <form class="task-form">
              <label for="activity">Nome da Atividade:</label>
              <input type="text" name="activity" required>
              <label for="day">Dia da Semana:</label>
              <select name="day" required>
                <option value="segunda">Segunda</option>
                <option value="terça">Terça</option>
                <option value="quarta">Quarta</option>
                <option value="quinta">Quinta</option>
                <option value="sexta">Sexta</option>
                <option value="sábado">Sábado</option>
                <option value="domingo">Domingo</option>
              </select>
              <label for="startTime">Hora de Início:</label>
              <input type="time" name="startTime" required>
              <label for="endTime">Hora de Término:</label>
              <input type="time" name="endTime" required>
            </form>
          `;
        }
        return formHTML;
      };

      // Insere o primeiro formulário na página
      formContainer.innerHTML = createForm();

      // Adiciona evento para o botão "Adicionar mais tarefa"
      const addFormBtn = document.getElementById("addFormBtn");
      if (addFormBtn) {
        addFormBtn.addEventListener("click", function () {
          // Cria um novo formulário e adiciona ao contêiner
          const newForm = document.createElement("div");
          newForm.innerHTML = createForm();
          formContainer.appendChild(newForm);
        });
      }

      // Adiciona evento ao botão "Calcular"
      const calculateBtn = document.getElementById("calculateBtn");
      if (calculateBtn) {
        calculateBtn.addEventListener("click", function () {
          // Coleta os dados de todos os formulários
          const forms = document.querySelectorAll(".task-form");
          const tasks = [];

          forms.forEach((form) => {
            const formData = new FormData(form);
            const task = Object.fromEntries(formData.entries());
            tasks.push(task);
          });

          // Salva os dados no localStorage
          localStorage.setItem(
            "plans",
            JSON.stringify({
              algorithm: planningType,
              tasks: tasks,
            })
          );

          // Redireciona para a página de resultados
          window.location.href = "result.html";
        });
      }
    }
  }
});
