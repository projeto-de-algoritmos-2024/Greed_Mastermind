# Greed_Mastermind

# Planejador de Tarefas

**Número da Lista**: 37  
**Conteúdo da Disciplina**: Greed
## Alunos

| Matrícula | Aluno |
| --------- | ----- |
| 221037975       | Natália Rodrigues de Morais   |
| 221021975       | Gabriel Santos Monteiro   |

## Sobre

O projeto é um **Planejador de Tarefas** que utiliza diferentes algoritmos ambiciosos para organizar e otimizar a execução de atividades. Este aplicativo web permite aos usuários adicionar tarefas e gerar planejamentos eficientes com base em diferentes estratégias.

### Uso de Algoritmos Ambiciosos

O planejador implementa três algoritmos ambiciosos principais:

1. **Interval Scheduling**: Maximiza o número de tarefas não sobrepostas.
2. **Interval Partitioning**: Agrupa tarefas em conjuntos que não se sobrepõem.
3. **Minimize Lateness**: Organiza tarefas para minimizar o atraso máximo.

Estes algoritmos são aplicados para otimizar o planejamento das tarefas inseridas pelo usuário, considerando fatores como horário de início, duração e prazo.

## Screenshots

| Página Inicial | Adicionar Tarefas |
| -------------- | ----------------- |
| Home | Add |

| Resultado do Planejamento |
| ------------------------- |
| Result |

## Instalação 

**Linguagem**: JavaScript  
**Framework**: Vanilla JS (Nenhum framework adicional utilizado)

### Pré-requisitos

Um navegador web moderno capaz de executar JavaScript ES6+.

### Executando o aplicativo

1. Clone o repositório.
2. Navegue até o diretório do projeto.
3. Abra o arquivo `index.html` em seu navegador.

## Uso

1. Na página inicial, escolha o tipo de planejamento desejado clicando no botão "Adicionar Plano".
2. Selecione um dos três tipos de planejamento: Minimize Lateness, Interval Partitioning ou Interval Scheduling.
3. Na página de adição de tarefas, preencha os detalhes da tarefa no formulário apresentado.
4. Use o botão "Adicionar mais tarefa" para incluir tarefas adicionais, se necessário.
5. Clique em "Calcular" para gerar o planejamento.
6. Visualize o resultado do planejamento otimizado na página de resultados.

## Funcionalidades

- Interface dinâmica com formulários gerados de acordo com o tipo de planejamento selecionado.
- Capacidade de adicionar múltiplas tarefas antes de calcular o planejamento.
- Armazenamento local dos dados das tarefas para persistência entre páginas.
- Redirecionamento automático para a página de resultados após o cálculo.

## Outros

Este projeto demonstra a aplicação prática de algoritmos ambiciosos em um cenário de planejamento de tarefas do dia a dia, oferecendo uma ferramenta útil para organização pessoal e profissional.