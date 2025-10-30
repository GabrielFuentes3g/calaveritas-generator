/**
 * CalaveriteApp - Aplicación frontend para el Generador de Calaveritas
 * Code of the Dead Challenge - JSConf MX 2025
 */
class CalaveriteApp {
    constructor() {
        // Referencias a elementos del DOM
        this.form = document.getElementById('calaverita-form');
        this.generateBtn = document.getElementById('btn-generate');
        this.clearHistoryBtn = document.getElementById('btn-clear-history');
        this.errorMessage = document.getElementById('error-message');
        this.resultSection = document.getElementById('result-section');
        this.calaveriteResult = document.getElementById('calaverita-result');
        this.historyContainer = document.getElementById('history-container');
        this.historyList = document.getElementById('history-list');
        this.emptyHistory = document.getElementById('empty-history');
        
        // Referencias a campos del formulario
        this.nameInput = document.getElementById('nombre');
        this.professionInput = document.getElementById('profesion');
        this.traitInput = document.getElementById('caracteristica');
        
        // Estado de la aplicación
        this.isLoading = false;
        
        this.init();
    }

    /**
     * Inicializa la aplicación
     */
    async init() {
        this.setupEventListeners();
        await this.loadHistory();
        this.hideError();
    }

    /**
     * Configura los event listeners
     */
    setupEventListeners() {
        // Manejo del formulario
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Botón de limpiar historial
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        
        // Validación en tiempo real
        this.nameInput.addEventListener('input', () => this.validateField(this.nameInput));
        this.professionInput.addEventListener('input', () => this.validateField(this.professionInput));
        
        // Limpiar errores al escribir
        [this.nameInput, this.professionInput, this.traitInput].forEach(input => {
            input.addEventListener('input', () => this.hideError());
        });
    }

    /**
     * Maneja el envío del formulario
     */
    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isLoading) return;
        
        // Obtener y validar datos del formulario
        const formData = this.getFormData();
        if (!this.validateFormData(formData)) {
            return;
        }

        await this.generateCalaverita(formData);
    }

    /**
     * Obtiene los datos del formulario
     */
    getFormData() {
        return {
            name: this.nameInput.value.trim(),
            profession: this.professionInput.value.trim(),
            trait: this.traitInput.value.trim() || null
        };
    }

    /**
     * Valida los datos del formulario
     */
    validateFormData(data) {
        if (!data.name) {
            this.showError('El nombre es requerido');
            this.nameInput.focus();
            return false;
        }
        
        if (data.name.length > 50) {
            this.showError('El nombre no puede tener más de 50 caracteres');
            this.nameInput.focus();
            return false;
        }
        
        if (!data.profession) {
            this.showError('La profesión es requerida');
            this.professionInput.focus();
            return false;
        }
        
        if (data.profession.length > 50) {
            this.showError('La profesión no puede tener más de 50 caracteres');
            this.professionInput.focus();
            return false;
        }
        
        if (data.trait && data.trait.length > 50) {
            this.showError('La característica no puede tener más de 50 caracteres');
            this.traitInput.focus();
            return false;
        }
        
        return true;
    }

    /**
     * Valida un campo individual
     */
    validateField(input) {
        const value = input.value.trim();
        const maxLength = parseInt(input.getAttribute('maxlength'));
        
        if (input.hasAttribute('required') && !value) {
            input.setCustomValidity('Este campo es requerido');
        } else if (value.length > maxLength) {
            input.setCustomValidity(`Máximo ${maxLength} caracteres`);
        } else {
            input.setCustomValidity('');
        }
    }

    /**
     * Genera una nueva calaverita
     */
    async generateCalaverita(data) {
        this.setLoadingState(true);
        
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                this.displayCalaverita(result.data);
                await this.loadHistory();
                this.hideError();
            } else {
                this.showError(result.error || 'Error generando calaverita');
            }
        } catch (error) {
            console.error('Error generando calaverita:', error);
            this.showError('Error de conexión. Por favor, intenta de nuevo.');
        } finally {
            this.setLoadingState(false);
        }
    }

    /**
     * Muestra la calaverita generada
     */
    displayCalaverita(calaverita) {
        this.calaveriteResult.textContent = calaverita.text;
        this.resultSection.style.display = 'block';
        this.resultSection.classList.add('fade-in');
        
        // Scroll suave al resultado
        setTimeout(() => {
            this.resultSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 100);
    }

    /**
     * Carga y muestra el historial
     */
    async loadHistory() {
        try {
            const response = await fetch('/api/history');
            const result = await response.json();
            
            if (result.success) {
                this.displayHistory(result.data);
            } else {
                console.error('Error cargando historial:', result.error);
                this.showEmptyHistory();
            }
        } catch (error) {
            console.error('Error cargando historial:', error);
            this.showEmptyHistory();
        }
    }

    /**
     * Muestra el historial de calaveritas
     */
    displayHistory(history) {
        if (!history || history.length === 0) {
            this.showEmptyHistory();
            return;
        }

        // Ocultar mensaje de historial vacío
        this.emptyHistory.style.display = 'none';
        this.historyList.style.display = 'block';

        // Ordenar por fecha (más recientes primero)
        const sortedHistory = [...history].reverse();

        // Generar HTML del historial
        const historyHTML = sortedHistory.map(calaverita => {
            const preview = this.getPreview(calaverita.text);
            const templateInfo = calaverita.templateName ? ` (${calaverita.templateName})` : '';
            
            return `
                <div class="history-item" data-id="${calaverita.id}">
                    <div class="history-item-header">
                        <span class="history-item-title">
                            💀 ${calaverita.name} - ${calaverita.profession}${templateInfo}
                        </span>
                        <span class="history-item-date">${calaverita.date}</span>
                    </div>
                    <div class="history-item-preview">
                        ${preview}
                    </div>
                </div>
            `;
        }).join('');

        this.historyList.innerHTML = historyHTML;

        // Agregar event listeners para mostrar calaveritas completas
        this.historyList.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = item.dataset.id;
                const calaverita = history.find(c => c.id === id);
                if (calaverita) {
                    this.displayCalaverita(calaverita);
                }
            });
        });
    }

    /**
     * Muestra el estado de historial vacío
     */
    showEmptyHistory() {
        this.emptyHistory.style.display = 'block';
        this.historyList.style.display = 'none';
    }

    /**
     * Obtiene una vista previa del texto de la calaverita
     */
    getPreview(text) {
        const firstLine = text.split('\n')[0];
        return firstLine.length > 80 ? firstLine.substring(0, 80) + '...' : firstLine;
    }

    /**
     * Limpia el historial
     */
    async clearHistory() {
        if (!confirm('¿Estás seguro de que quieres limpiar todo el historial? Esta acción no se puede deshacer.')) {
            return;
        }

        try {
            const response = await fetch('/api/history', {
                method: 'DELETE'
            });

            const result = await response.json();

            if (response.ok && result.success) {
                await this.loadHistory();
                this.showSuccessMessage('🗑️ Historial limpiado correctamente');
            } else {
                this.showError(result.error || 'Error limpiando historial');
            }
        } catch (error) {
            console.error('Error limpiando historial:', error);
            this.showError('Error de conexión. Por favor, intenta de nuevo.');
        }
    }

    /**
     * Establece el estado de carga
     */
    setLoadingState(loading) {
        this.isLoading = loading;
        
        if (loading) {
            this.generateBtn.disabled = true;
            this.generateBtn.textContent = '🎭 Generando...';
            this.generateBtn.classList.add('loading');
        } else {
            this.generateBtn.disabled = false;
            this.generateBtn.textContent = '✨ Generar Calaverita';
            this.generateBtn.classList.remove('loading');
        }
    }

    /**
     * Muestra un mensaje de error
     */
    showError(message) {
        this.errorMessage.textContent = `❌ ${message}`;
        this.errorMessage.style.display = 'block';
        this.errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Oculta el mensaje de error
     */
    hideError() {
        this.errorMessage.style.display = 'none';
    }

    /**
     * Muestra un mensaje de éxito
     */
    showSuccessMessage(message) {
        // Crear elemento temporal para mostrar mensaje de éxito
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #16a34a;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(successDiv);

        // Remover después de 3 segundos
        setTimeout(() => {
            successDiv.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.parentNode.removeChild(successDiv);
                }
            }, 300);
        }, 3000);
    }

    /**
     * Resetea el formulario
     */
    resetForm() {
        this.form.reset();
        this.resultSection.style.display = 'none';
        this.hideError();
        this.nameInput.focus();
    }
}

// Agregar estilos para animaciones de mensajes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .history-item {
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .history-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
`;
document.head.appendChild(style);

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new CalaveriteApp();
});