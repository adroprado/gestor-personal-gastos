// --- Importación de Módulos ---
import { menuNavegacion } from './ui/gestion-ui.js';
import formularioGasto from './js/formulario.js';
import formValidaciones from './js/form-validaciones.js';
// --- Ejecución de Código ---
document.addEventListener('DOMContentLoaded', (e) => {
  menuNavegacion();
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
  formValidaciones();
});
