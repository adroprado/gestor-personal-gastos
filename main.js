// --- Importación de Módulos ---
import menuNavegacion from './js/menu-navegacion.js';
import formularioGasto from './js/formulario.js';
import formValidaciones from './js/form-validaciones.js';
// --- Ejecución de Código ---
document.addEventListener('DOMContentLoaded', (e) => {
  menuNavegacion('.btn-pestaña-gastos', '.btn-pestaña-estadisticas');
  formularioGasto(
    '.mensaje-exito',
    '.contenedor-elementos',
    '.estado-vacio',
    '.informacion-monto',
    '.informacion-registros',
    '.plantilla',
  );
  formValidaciones();
});
