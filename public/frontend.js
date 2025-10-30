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
        this.templateSelect = document.getElementById('template');
        this.traitInput = document.getElementById('caracteristica');
        this.caracteristicaGroup = document.getElementById('caracteristica-group');
        this.caracteristicaRequired = document.getElementById('caracteristica-required');
        this.caracteristicaOptional = document.getElementById('caracteristica-optional');
        
        // Estado de la aplicación
        this.isLoading = false;
        this.templates = [];
        this.validationRules = null;
        this.validationTimeouts = {};
        
        this.init();
    }

    /**
     * Inicializa la aplicación
     */
    async init() {
        this.setupEventListeners();
        await this.loadValidationRules();
        await this.loadTemplates();
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
        
        // Selector de plantillas
        this.templateSelect.addEventListener('change', () => this.handleTemplateChange());
        
        // Validación en tiempo real
        this.nameInput.addEventListener('input', () => this.validateFieldRealTime('name', this.nameInput));
        this.professionInput.addEventListener('input', () => this.validateFieldRealTime('profession', this.professionInput));
        this.traitInput.addEventListener('input', () => this.validateFieldRealTime('trait', this.traitInput));
        
        // Limpiar errores al escribir
        [this.nameInput, this.professionInput, this.templateSelect, this.traitInput].forEach(input => {
            input.addEventListener('input', () => this.hideError());
            input.addEventListener('change', () => this.hideError());
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
     * Carga las reglas de validación
     */
    async loadValidationRules() {
        try {
            const response = await fetch('/api/validation/rules');
            const result = await response.json();
            
            if (result.success) {
                this.validationRules = result.data;
                this.setupValidationUI();
            } else {
                console.error('Error cargando reglas de validación:', result.error);
            }
        } catch (error) {
            console.error('Error cargando reglas de validación:', error);
        }
    }

    /**
     * Configura la UI de validación
     */
    setupValidationUI() {
        if (!this.validationRules) return;

        // Configurar atributos de validación en los inputs
        Object.keys(this.validationRules).forEach(fieldName => {
            const rule = this.validationRules[fieldName];
            const input = this.getInputByFieldName(fieldName);
            
            if (input) {
                input.setAttribute('maxlength', rule.maxLength);
                input.setAttribute('minlength', rule.minLength);
                
                // Agregar indicadores visuales
                this.addValidationIndicator(input, fieldName);
            }
        });
    }

    /**
     * Obtiene el input por nombre de campo
     */
    getInputByFieldName(fieldName) {
        const inputMap = {
            'name': this.nameInput,
            'profession': this.professionInput,
            'trait': this.traitInput
        };
        return inputMap[fieldName];
    }

    /**
     * Agrega indicador de validación al campo
     */
    addValidationIndicator(input, fieldName) {
        const container = input.parentElement;
        
        // Crear contenedor de validación si no existe
        let validationContainer = container.querySelector('.validation-feedback');
        if (!validationContainer) {
            validationContainer = document.createElement('div');
            validationContainer.className = 'validation-feedback';
            container.appendChild(validationContainer);
        }

        // Agregar contador de caracteres
        const rule = this.validationRules[fieldName];
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.textContent = `0/${rule.maxLength}`;
        validationContainer.appendChild(counter);

        // Actualizar contador en tiempo real
        input.addEventListener('input', () => {
            const length = input.value.length;
            counter.textContent = `${length}/${rule.maxLength}`;
            counter.className = `char-counter ${length > rule.maxLength * 0.8 ? 'warning' : ''}`;
        });
    }

    /**
     * Carga las plantillas disponibles
     */
    async loadTemplates() {
        try {
            const response = await fetch('/api/templates');
            const result = await response.json();
            
            if (result.success) {
                this.templates = result.data;
                this.populateTemplateSelect();
            } else {
                console.error('Error cargando plantillas:', result.error);
            }
        } catch (error) {
            console.error('Error cargando plantillas:', error);
        }
    }

    /**
     * Llena el selector de plantillas
     */
    populateTemplateSelect() {
        // Limpiar opciones existentes (excepto la primera)
        while (this.templateSelect.children.length > 1) {
            this.templateSelect.removeChild(this.templateSelect.lastChild);
        }

        // Agregar plantillas
        this.templates.forEach(template => {
            const option = document.createElement('option');
            option.value = template.id;
            option.textContent = `${template.name}${template.requiresTrait ? ' (requiere característica)' : ''}`;
            option.title = template.description;
            this.templateSelect.appendChild(option);
        });
    }

    /**
     * Maneja el cambio de plantilla
     */
    handleTemplateChange() {
        const selectedTemplateId = this.templateSelect.value;
        
        if (!selectedTemplateId) {
            // Aleatorio seleccionado
            this.setTraitFieldOptional();
            return;
        }

        const selectedTemplate = this.templates.find(t => t.id === selectedTemplateId);
        if (selectedTemplate) {
            if (selectedTemplate.requiresTrait) {
                this.setTraitFieldRequired();
            } else {
                this.setTraitFieldOptional();
            }
        }
    }

    /**
     * Establece el campo trait como requerido
     */
    setTraitFieldRequired() {
        this.traitInput.required = true;
        this.caracteristicaRequired.style.display = 'inline';
        this.caracteristicaOptional.style.display = 'none';
        this.caracteristicaGroup.classList.add('required-field');
    }

    /**
     * Establece el campo trait como opcional
     */
    setTraitFieldOptional() {
        this.traitInput.required = false;
        this.caracteristicaRequired.style.display = 'none';
        this.caracteristicaOptional.style.display = 'inline';
        this.caracteristicaGroup.classList.remove('required-field');
    }

    /**
     * Obtiene los datos del formulario
     */
    getFormData() {
        return {
            name: this.nameInput.value.trim(),
            profession: this.professionInput.value.trim(),
            trait: this.traitInput.value.trim() || null,
            templateId: this.templateSelect.value || null
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

        // Validar trait según plantilla seleccionada
        if (data.templateId) {
            const selectedTemplate = this.templates.find(t => t.id === data.templateId);
            if (selectedTemplate && selectedTemplate.requiresTrait && !data.trait) {
                this.showError('Esta plantilla requiere una característica especial');
                this.traitInput.focus();
                return false;
            }
        }
        
        if (data.trait && data.trait.length > 50) {
            this.showError('La característica no puede tener más de 50 caracteres');
            this.traitInput.focus();
            return false;
        }
        
        return true;
    }

    /**
     * Validación en tiempo real de campos
     */
    async validateFieldRealTime(fieldName, input) {
        const value = input.value;
        
        // Limpiar timeout anterior
        if (this.validationTimeouts[fieldName]) {
            clearTimeout(this.validationTimeouts[fieldName]);
        }

        // Validación inmediata para longitud
        this.validateFieldLength(input, fieldName);

        // Validación del servidor con debounce
        this.validationTimeouts[fieldName] = setTimeout(async () => {
            if (value.trim().length > 0) {
                await this.validateFieldOnServer(fieldName, value, input);
            } else {
                this.clearFieldValidation(input);
            }
        }, 500); // 500ms de debounce
    }

    /**
     * Validación inmediata de longitud
     */
    validateFieldLength(input, fieldName) {
        const value = input.value;
        const rule = this.validationRules?.[fieldName];
        
        if (!rule) return;

        const container = input.parentElement;
        let feedback = container.querySelector('.validation-message');
        
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'validation-message';
            container.appendChild(feedback);
        }

        // Validar longitud
        if (value.length > rule.maxLength) {
            this.showFieldError(input, feedback, `Máximo ${rule.maxLength} caracteres`);
        } else if (value.trim().length > 0 && value.trim().length < rule.minLength) {
            this.showFieldError(input, feedback, `Mínimo ${rule.minLength} caracteres`);
        } else {
            this.clearFieldValidation(input);
        }
    }

    /**
     * Validación en el servidor
     */
    async validateFieldOnServer(fieldName, value, input) {
        try {
            const response = await fetch('/api/validation/field', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fieldName, value })
            });

            const result = await response.json();
            
            if (result.success) {
                const validation = result.data;
                const container = input.parentElement;
                let feedback = container.querySelector('.validation-message');
                
                if (!feedback) {
                    feedback = document.createElement('div');
                    feedback.className = 'validation-message';
                    container.appendChild(feedback);
                }

                if (validation.isValid) {
                    this.showFieldSuccess(input, feedback);
                } else {
                    this.showFieldError(input, feedback, validation.message);
                }
            }
        } catch (error) {
            console.error('Error validando campo:', error);
        }
    }

    /**
     * Muestra error en campo
     */
    showFieldError(input, feedback, message) {
        input.classList.remove('valid');
        input.classList.add('invalid');
        feedback.className = 'validation-message error';
        feedback.textContent = message;
        feedback.style.display = 'block';
    }

    /**
     * Muestra éxito en campo
     */
    showFieldSuccess(input, feedback) {
        input.classList.remove('invalid');
        input.classList.add('valid');
        feedback.className = 'validation-message success';
        feedback.textContent = '✓ Válido';
        feedback.style.display = 'block';
    }

    /**
     * Limpia validación de campo
     */
    clearFieldValidation(input) {
        input.classList.remove('valid', 'invalid');
        const container = input.parentElement;
        const feedback = container.querySelector('.validation-message');
        if (feedback) {
            feedback.style.display = 'none';
        }
    }

    /**
     * Valida un campo individual (método legacy)
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
     * Muestra la calaverita generada con animaciones mejoradas
     */
    displayCalaverita(calaverita) {
        // Limpiar clases de animación previas
        this.resultSection.classList.remove('fade-in', 'bounce-in', 'slide-in-right');
        
        this.calaveriteResult.textContent = calaverita.text;
        this.resultSection.style.display = 'block';
        
        // Aplicar animación con un pequeño delay para mejor efecto
        setTimeout(() => {
            this.resultSection.classList.add('bounce-in');
        }, 50);
        
        // Scroll suave al resultado con mejor timing
        setTimeout(() => {
            this.resultSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center',
                inline: 'nearest'
            });
        }, 300);
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

        // Ordenar por fecha (más recientes primero) - ordenamiento cronológico inverso
        const sortedHistory = [...history].sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });

        // Generar HTML del historial con diseño de tarjetas mejorado
        const historyHTML = sortedHistory.map(calaverita => {
            const preview = this.getPreview(calaverita.text);
            const formattedDate = this.formatDate(calaverita.date);
            const templateInfo = calaverita.templateName || calaverita.templateId || 'Aleatorio';
            
            return `
                <div class="history-item" data-id="${calaverita.id}">
                    <div class="history-item-header">
                        <div class="history-item-title">
                            💀 ${this.escapeHtml(calaverita.name)} - ${this.escapeHtml(calaverita.profession)}
                        </div>
                        <div class="history-item-meta">
                            <div class="history-item-date">${formattedDate}</div>
                            <div class="history-item-template">📝 ${this.escapeHtml(templateInfo)}</div>
                        </div>
                    </div>
                    <div class="history-item-preview">
                        ${this.escapeHtml(preview)}
                    </div>
                    <div class="history-item-click-hint">
                        👆 Clic para ver completa
                    </div>
                </div>
            `;
        }).join('');

        this.historyList.innerHTML = historyHTML;

        // Agregar event listeners para mostrar calaveritas completas
        this.historyList.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = item.dataset.id;
                const calaverita = sortedHistory.find(c => c.id === id);
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
        return firstLine.length > 100 ? firstLine.substring(0, 100) + '...' : firstLine;
    }

    /**
     * Formatea la fecha para mostrar en el historial
     */
    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                return 'Hoy';
            } else if (diffDays === 2) {
                return 'Ayer';
            } else if (diffDays <= 7) {
                return `Hace ${diffDays - 1} días`;
            } else {
                return date.toLocaleDateString('es-MX', {
                    day: 'numeric',
                    month: 'short',
                    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
                });
            }
        } catch (error) {
            return dateString;
        }
    }

    /**
     * Escapa HTML para prevenir XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Limpia el historial con confirmación y feedback visual
     */
    async clearHistory() {
        // Verificar si hay historial para limpiar
        try {
            const response = await fetch('/api/history');
            const result = await response.json();
            
            if (!result.success || !result.data || result.data.length === 0) {
                this.showError('No hay historial para limpiar');
                return;
            }
        } catch (error) {
            console.error('Error verificando historial:', error);
            this.showError('Error verificando historial');
            return;
        }

        // Confirmación con mensaje más descriptivo
        const confirmMessage = `¿Estás seguro de que quieres eliminar TODAS las calaveritas del historial?\n\n⚠️ Esta acción NO se puede deshacer.\n\n✅ Presiona "Aceptar" para confirmar\n❌ Presiona "Cancelar" para mantener tu historial`;
        
        if (!confirm(confirmMessage)) {
            return;
        }

        // Mostrar estado de carga en el botón
        const originalText = this.clearHistoryBtn.textContent;
        this.clearHistoryBtn.disabled = true;
        this.clearHistoryBtn.textContent = '🗑️ Limpiando...';
        this.clearHistoryBtn.classList.add('confirming');

        try {
            const response = await fetch('/api/history', {
                method: 'DELETE'
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Recargar historial automáticamente
                await this.loadHistory();
                this.showSuccessMessage('🗑️ Historial limpiado correctamente. Todas las calaveritas han sido eliminadas.');
            } else {
                this.showError(result.error || 'Error limpiando historial. Por favor, intenta de nuevo.');
            }
        } catch (error) {
            console.error('Error limpiando historial:', error);
            this.showError('Error de conexión. Verifica tu conexión a internet e intenta de nuevo.');
        } finally {
            // Restaurar estado del botón
            this.clearHistoryBtn.disabled = false;
            this.clearHistoryBtn.textContent = originalText;
            this.clearHistoryBtn.classList.remove('confirming');
        }
    }

    /**
     * Establece el estado de carga con feedback visual mejorado
     */
    setLoadingState(loading) {
        this.isLoading = loading;
        
        if (loading) {
            // Estado de carga
            this.generateBtn.disabled = true;
            this.generateBtn.innerHTML = '🎭 Generando<span class="loading-dots">...</span>';
            this.generateBtn.classList.add('loading');
            
            // Deshabilitar campos del formulario durante la carga
            this.nameInput.disabled = true;
            this.professionInput.disabled = true;
            this.templateSelect.disabled = true;
            this.traitInput.disabled = true;
            
            // Agregar efecto de carga visual
            this.form.classList.add('loading-shimmer');
            
        } else {
            // Estado normal
            this.generateBtn.disabled = false;
            this.generateBtn.innerHTML = '✨ Generar Calaverita';
            this.generateBtn.classList.remove('loading');
            
            // Rehabilitar campos del formulario
            this.nameInput.disabled = false;
            this.professionInput.disabled = false;
            this.templateSelect.disabled = false;
            this.traitInput.disabled = false;
            
            // Remover efecto de carga
            this.form.classList.remove('loading-shimmer');
        }
    }

    /**
     * Muestra un mensaje de error con animaciones
     */
    showError(message) {
        this.errorMessage.innerHTML = `
            <div class="error-icon">❌</div>
            <div class="error-text">${this.escapeHtml(message)}</div>
        `;
        
        // Mostrar con animación
        this.errorMessage.style.display = 'block';
        this.errorMessage.classList.remove('smooth-hide');
        this.errorMessage.classList.add('smooth-show', 'slide-in-right');
        
        // Scroll suave al error
        setTimeout(() => {
            this.errorMessage.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest',
                inline: 'center'
            });
        }, 100);
        
        // Auto-ocultar después de 5 segundos
        setTimeout(() => {
            this.hideError();
        }, 5000);
    }

    /**
     * Oculta el mensaje de error con animación
     */
    hideError() {
        if (this.errorMessage.style.display !== 'none') {
            this.errorMessage.classList.remove('smooth-show', 'slide-in-right');
            this.errorMessage.classList.add('smooth-hide');
            
            setTimeout(() => {
                this.errorMessage.style.display = 'none';
                this.errorMessage.classList.remove('smooth-hide');
            }, 300);
        }
    }

    /**
     * Muestra un mensaje de éxito con mejor diseño
     */
    showSuccessMessage(message) {
        // Crear elemento temporal para mostrar mensaje de éxito
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div class="success-icon">✅</div>
            <div class="success-text">${this.escapeHtml(message)}</div>
        `;
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(22, 163, 74, 0.3);
            z-index: 1000;
            animation: slideIn 0.4s ease-out;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            max-width: 400px;
            border: 2px solid rgba(255, 255, 255, 0.2);
        `;

        // Estilos para el icono y texto
        const style = document.createElement('style');
        style.textContent = `
            .success-message .success-icon {
                font-size: 1.25rem;
                flex-shrink: 0;
            }
            .success-message .success-text {
                font-weight: 500;
                line-height: 1.4;
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(successDiv);

        // Remover después de 4 segundos (más tiempo para leer)
        setTimeout(() => {
            successDiv.style.animation = 'slideOut 0.4s ease-in';
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.parentNode.removeChild(successDiv);
                }
                if (style.parentNode) {
                    style.parentNode.removeChild(style);
                }
            }, 400);
        }, 4000);
    }

    /**
     * Sistema de alertas tipo toast mejorable
     */
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        const colors = {
            success: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
            error: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
            warning: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
            info: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)'
        };
        
        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || icons.info}</div>
            <div class="toast-text">${this.escapeHtml(message)}</div>
        `;
        
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            animation: slideIn 0.4s ease-out;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            max-width: 400px;
            border: 2px solid rgba(255, 255, 255, 0.2);
            font-weight: 500;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.4s ease-in';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 400);
        }, duration);
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