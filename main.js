// --- Importación de Módulos ---
import { menuNavegacion, formularioValidaciones } from './ui/gestion-ui.js';
import formularioGasto from './js/formulario.js';

// --- Ejecución de Código ---
document.addEventListener('DOMContentLoaded', (e) => {
  menuNavegacion();
  formularioValidaciones();
  formularioGasto(
    '.mensaje-exito',
    '.contenedor-elementos',
    '.estado-vacio',
    '.informacion-monto',
    '.informacion-registros',
    '.plantilla',
    '.grafica-canvas',
    '.mensaje-estadistica',
  );
});
