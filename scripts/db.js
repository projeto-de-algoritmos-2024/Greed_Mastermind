class DatabaseConnection {
    constructor() {
        if (!localStorage.getItem('plans_data')) {
            localStorage.setItem('plans_data', JSON.stringify([]));
        }
    }

    async getPlannings() {
        try {
            const plans = JSON.parse(localStorage.getItem('plans_data')) || [];
            return plans;
        } catch (error) {
            console.error('Erro ao buscar planejamentos:', error);
            return [];
        }
    }

    async savePlanning(planData) {
        try {
            const plans = await this.getPlannings();
            const newPlan = {
                plan_id: Date.now(),
                title: planData.algorithm === 'minimizeLateness' ? 'Planejamento de Estratégia' :
                       planData.algorithm === 'intervalPartitioning' ? 'Planejamento Semanal' :
                       'Planejamento do Dia',
                plan_type: planData.algorithm,
                created_at: new Date().toISOString(),
                tasks: planData.tasks,
                total_tasks: planData.tasks.length,
                completed_tasks: 0
            };
            plans.push(newPlan);
            localStorage.setItem('plans_data', JSON.stringify(plans));
            return newPlan;
        } catch (error) {
            console.error('Erro ao salvar planejamento:', error);
            throw error;
        }
    }
}
