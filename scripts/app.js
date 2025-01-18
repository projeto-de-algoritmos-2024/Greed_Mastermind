// scripts/app.js

// Inicializa a lista de planejamentos
let plans = JSON.parse(localStorage.getItem("plans")) || [];

// Exibe os planejamentos na página inicial
function renderPlans() {
  const planList = document.getElementById("plan-list");
  planList.innerHTML = ""; // Limpa a lista antes de renderizar
  plans.forEach((plan, index) => {
    const li = document.createElement("li");
    li.textContent = `Planejamento ${index + 1}: ${plan.name}`;
    planList.appendChild(li);
  });
}

// Redireciona para a página de adicionar planejamento
document.getElementById("add-plan").addEventListener("click", () => {
  window.location.href = "add.html";
});

// Redireciona para o modo Machiavelli
document.getElementById("machiavelli-mode").addEventListener("click", () => {
  window.location.href = "machiavelli.html";
});

// Renderiza os planejamentos ao carregar a página
renderPlans();

// Selecionar o formulário
const planningForm = document.getElementById('planningForm');

// Evento de envio do formulário
planningForm.addEventListener('submit', function (event) {
  event.preventDefault(); // Evitar recarregar a página

  // Obter os valores dos campos
  const activity = document.getElementById('activity').value;
  const day = document.getElementById('day').value;
  const startTime = document.getElementById('startTime').value;
  const endTime = document.getElementById('endTime').value;
  const algorithm = document.getElementById('algorithm').value;

  // Criar um objeto para armazenar a atividade
  const planningData = {
    activity,
    day,
    startTime,
    endTime,
    algorithm,
  };

  // Salvar no localStorage
  let savedPlannings = JSON.parse(localStorage.getItem('plannings')) || [];
  savedPlannings.push(planningData);
  localStorage.setItem('plannings', JSON.stringify(savedPlannings));

  // Redirecionar para a página de resultado
  window.location.href = 'result.html';
});
