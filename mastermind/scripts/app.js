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
