const readlineSync = require('readline-sync');
const { CalaveriteGenerator } = require('./generator');
const { DataManager } = require('./data-manager');

class CalaveriteApp {
  constructor() {
    this.generator = new CalaveriteGenerator();
    this.dataManager = new DataManager();
  }

  async start() {
    console.log('🎭 ¡Bienvenido al Generador de Calaveritas! 💀');
    console.log('=====================================\n');

    while (true) {
      this.showMenu();
      const option = readlineSync.question('Selecciona una opción: ');

      switch (option) {
        case '1':
          await this.generateCalaverita();
          break;
        case '2':
          this.viewHistory();
          break;
        case '3':
          console.log('¡Hasta la vista! 👻');
          return;
        default:
          console.log('Opción no válida. Intenta de nuevo.\n');
      }
    }
  }

  showMenu() {
    console.log('¿Qué te gustaría hacer?');
    console.log('1. Generar nueva calaverita');
    console.log('2. Ver historial de calaveritas');
    console.log('3. Salir');
    console.log('');
  }

  async generateCalaverita() {
    const name = readlineSync.question('Nombre de la persona: ');
    const profession = readlineSync.question('Profesión u ocupación: ');
    const trait = readlineSync.question('Característica especial (opcional): ') || null;

    console.log('\nGenerando tu calaverita... 💀\n');

    const calaverita = this.generator.generate(name, profession, trait);
    console.log('📜 Tu calaverita:');
    console.log('================');
    console.log(calaverita.text);
    console.log('================\n');

    // Guardar en historial
    this.dataManager.saveCalaverita(calaverita);
    console.log('✅ Calaverita guardada en el historial\n');
  }

  viewHistory() {
    const history = this.dataManager.getHistory();
    
    if (history.length === 0) {
      console.log('📭 No hay calaveritas en el historial aún.\n');
      return;
    }

    console.log('📚 Historial de Calaveritas:');
    console.log('============================\n');

    history.forEach((calaverita, index) => {
      console.log(`${index + 1}. ${calaverita.name} (${calaverita.date})`);
      console.log(`   ${calaverita.text.split('\n')[0]}...`);
      console.log('');
    });
  }
}

// Iniciar la aplicación
const app = new CalaveriteApp();
app.start().catch(console.error);