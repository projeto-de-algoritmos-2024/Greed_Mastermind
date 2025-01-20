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
                  const newForm = document.createElement("div");
                  newForm.innerHTML = createForm();
                  formContainer.appendChild(newForm);
              });
          }

          // Modifica o evento do calculateBtn
          const calculateBtn = document.getElementById("calculateBtn");
          if (calculateBtn) {
              calculateBtn.addEventListener("click", async function () {
                  const forms = document.querySelectorAll(".task-form");
                  const tasks = [];
  
                  forms.forEach((form) => {
                      const formData = new FormData(form);
                      const task = Object.fromEntries(formData.entries());
                      tasks.push(task);
                  });
  
                  const planData = {
                      algorithm: planningType,
                      tasks: tasks,
                  };
  
                  try {
                      const db = new DatabaseConnection();
                      await db.savePlanning(planData);
                      localStorage.setItem("plans", JSON.stringify(planData));
                      window.location.href = "result.html";
                  } catch (error) {
                      console.error('Erro ao salvar planejamento:', error);
                      alert('Erro ao salvar o planejamento. Tente novamente.');
                  }
              });
          }
      }
  }

  // Função para carregar os planejamentos
  async function loadPlannings() {
      const planList = document.getElementById('plan-list');
      if (!planList) {
          console.log('plan-list não encontrado');
          return;
      }

      try {
          const db = new DatabaseConnection();
          const plans = await db.getPlannings();
          console.log('Planos carregados:', plans);

          if (plans.length === 0) {
              planList.innerHTML = '<p class="no-plans">Nenhum planejamento criado ainda.</p>';
              return;
          }

          planList.innerHTML = plans.map(plan => {
              const progress = plan.total_tasks > 0 
                  ? (plan.completed_tasks / plan.total_tasks) * 100 
                  : 0;

              return `
                  <div class="plan-card" data-plan-id="${plan.plan_id}">
                      <div class="plan-header">
                          <h3 class="plan-title">${plan.title}</h3>
                          <div class="plan-type">${formatPlanType(plan.plan_type)}</div>
                      </div>
                      <div class="plan-stats">
                          <span>${plan.total_tasks} tarefas</span>
                          <span>${plan.completed_tasks} concluídas</span>
                      </div>
                      <div class="plan-progress">
                          <div class="progress-bar" style="width: ${progress}%"></div>
                      </div>
                      <div class="plan-date">
                          Criado em: ${new Date(plan.created_at).toLocaleDateString()}
                      </div>
                  </div>
              `;
          }).join('');
      } catch (error) {
          console.error('Erro ao carregar planejamentos:', error);
          planList.innerHTML = '<p class="error-message">Erro ao carregar os planejamentos.</p>';
      }
  }

  // Função para formatar o tipo do planejamento
  function formatPlanType(type) {
      const types = {
          'intervalPartitioning': 'Planejamento Semanal',
          'intervalScheduling': 'Planejamento do Dia',
          'minimizeLateness': 'Planejamento de Estratégia'
      };
      return types[type] || type;
  }

  // Carrega os planejamentos apenas na página inicial
  if (window.location.pathname === "/" || window.location.pathname.includes("index.html")) {
      loadPlannings();
  }
});
