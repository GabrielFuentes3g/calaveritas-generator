class CalaveriteApp {
    constructor() {
        this.form = document.getElementById('calaveriteForm');
        this.resultContainer = document.getElementById('resultContainer');
        this.calaveriteDisplay = document.getElementById('calaveriteDisplay');
        this.historyContainer = document.getElementById('historyContainer');
        this.templateSelect = document.getElementById('template');
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadTemplates();
        await this.loadHistory();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        document.getElementById('newCalaveriteBtn').addEventListener('click', () => {
            this.resetForm();
        });
        
        document.getElementById('clearHistoryBtn').addEventListener('click', () => {
            this.clearHistory();
        });

        // Mostrar/ocultar campo de característica según template seleccionado
        this.templateSelect.addEventListener('change', (e) => {
            this.handleTemplateChange(e.target.value);
        });
    }

    async loadTemplates() {
        try {
            const response = await fetch('/api/templates');
            if (response.ok) {
                const { templates } = await response.json();
                this.populateTemplateSelect(templates);
            }
        } catch (error) {
            console.error('Error cargando templates:', error);
        }
    }

    populateTemplateSelect(templates) {
        templates.forEach(template => {
            const option = document.createElement('option');
            option.value = template.id;
            option.textContent = `${template.name}${template.requiresTrait ? ' (requiere característica)' : ''}`;
            option.dataset.requiresTrait = template.requiresTrait;
            this.templateSelect.appendChild(option);
        });
    }

    handleTemplateChange(templateId) {
        const traitInput = document.getElementById('trait');
        const traitGroup = traitInput.closest('.form-group');
        const selectedOption = this.templateSelect.querySelector(`option[value="${templateId}"]`);
        
        if (selectedOption && selectedOption.dataset.requiresTrait === 'true') {
            traitGroup.style.display = 'block';
            traitInput.required = true;
            traitInput.placeholder = 'Requerido para esta plantilla';
        } else {
            traitGroup.style.display = 'block';
            traitInput.required = false;
            traitInput.placeholder = 'Ej: bondadoso, gracioso, trabajador';
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name').trim(),
            profession: formData.get('profession').trim(),
            trait: formData.get('trait').trim() || null,
            templateId: formData.get('template') || null
        };

        if (!data.name || !data.profession) {
            this.showError('Por favor completa todos los campos requeridos');
            return;
        }

        await this.generateCalaverita(data);
    }

    async generateCalaverita(data) {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        try {
            submitBtn.disabled = true;
            submitBtn.textContent = '🎭 Generando...';

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                this.displayCalaverita(result.calaverita);
                await this.loadHistory(); // Recargar historial
            } else {
                this.showError(result.error || 'Error generando calaverita');
            }
        } catch (error) {
            this.showError('Error de conexión. Intenta de nuevo.');
            console.error('Error:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    displayCalaverita(calaverita) {
        this.calaveriteDisplay.textContent = calaverita.text;
        this.resultContainer.style.display = 'block';
        this.resultContainer.scrollIntoView({ behavior: 'smooth' });
    }

    resetForm() {
        this.form.reset();
        this.resultContainer.style.display = 'none';
        this.handleTemplateChange(''); // Reset template requirements
    }

    async loadHistory() {
        try {
            const response = await fetch('/api/history');
            const { history } = await response.json();
            this.displayHistory(history);
        } catch (error) {
            console.error('Error cargando historial:', error);
            this.historyContainer.innerHTML = '<p class="loading">Error cargando historial</p>';
        }
    }

    displayHistory(history) {
        if (history.length === 0) {
            this.historyContainer.innerHTML = `
                <div class="empty-history">
                    <span class="emoji">📭</span>
                    <p>No hay calaveritas en el historial aún.</p>
                    <p>¡Crea tu primera calaverita!</p>
                </div>
            `;
            return;
        }

        const historyHTML = history
            .reverse() // Mostrar más recientes primero
            .map(calaverita => `
                <div class="history-item">
                    <div class="history-item-header">
                        <span class="history-item-title">
                            ${calaverita.name} - ${calaverita.profession}
                        </span>
                        <span class="history-item-date">${calaverita.date}</span>
                    </div>
                    <div class="history-item-preview">
                        ${calaverita.text.split('\n')[0]}...
                    </div>
                </div>
            `)
            .join('');

        this.historyContainer.innerHTML = historyHTML;
    }

    async clearHistory() {
        if (!confirm('¿Estás seguro de que quieres limpiar todo el historial?')) {
            return;
        }

        try {
            const response = await fetch('/api/history', {
                method: 'DELETE'
            });

            if (response.ok) {
                await this.loadHistory();
                this.showSuccess('Historial limpiado correctamente');
            } else {
                this.showError('Error limpiando historial');
            }
        } catch (error) {
            this.showError('Error de conexión');
            console.error('Error:', error);
        }
    }

    showError(message) {
        // Simple alert por ahora, se puede mejorar con un toast
        alert('❌ ' + message);
    }

    showSuccess(message) {
        // Simple alert por ahora, se puede mejorar con un toast
        alert('✅ ' + message);
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new CalaveriteApp();
});