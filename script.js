class GoalModel {
    constructor() {
        this.goals = JSON.parse(localStorage.getItem('goals')) || [];
    }

    addGoal(goal) {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.goals.push(goal);
                this._saveToLocalStorage();
                resolve();
            })
        });
    }

    removeGoal(index) {
        this.goals.splice(index, 1);
        this._saveToLocalStorage();
    }

    toggleGoal(index) {
        this.goals[index].completed = !this.goals[index].completed;
        this._saveToLocalStorage();
    }

    _saveToLocalStorage() {
        localStorage.setItem('goals', JSON.stringify(this.goals));
    }

    getGoals() {
        return this.goals;
    }
}

class GoalView {
    constructor() {
        this.goalsContainer = document.getElementById('goals-container');
        this.form = document.getElementById('goal-form');
        this.nameInput = document.getElementById('goal-name');
        this.deadlineInput = document.getElementById('goal-deadline');
    }

    renderGoals(goals) {
        this.goalsContainer.innerHTML = '';
        goals.forEach((goal, index) => {
            const goalElement = document.createElement('div');
            goalElement.className = `goal ${goal.completed ? 'completed' : ''}`;
            goalElement.innerHTML = `
        <span>${goal.name} (до ${goal.deadline})</span>
        <div>
          <button class="complete-btn" data-index="${index}">✔</button>
          <button class="delete-btn" data-index="${index}">✖</button>
        </div>
      `;
            this.goalsContainer.appendChild(goalElement);
        });
    }

    clearForm() {
        this.nameInput.value = '';
        this.deadlineInput.value = '';
    }
}

class GoalController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.form.addEventListener('submit', (e) => this.handleAddGoal(e));
        this.view.goalsContainer.addEventListener('click', (e) => this.handleGoalActions(e));

        this.view.renderGoals(this.model.getGoals());
    }

    handleAddGoal(event) {
        event.preventDefault();
        const name = this.view.nameInput.value;
        const deadline = this.view.deadlineInput.value;

        if (!name || !deadline) return;

        const goal = { name, deadline, completed: false };
        this.model.addGoal(goal).then(() => {
            this.view.renderGoals(this.model.getGoals());
            this.view.clearForm();
        });
    }

    handleGoalActions(event) {
        const target = event.target;
        const index = target.dataset.index;

        if (target.classList.contains('delete-btn')) {
            this.model.removeGoal(index);
        } else if (target.classList.contains('complete-btn')) {
            this.model.toggleGoal(index);
        }

        this.view.renderGoals(this.model.getGoals());
    }
}
new GoalController(new GoalModel(), new GoalView());
