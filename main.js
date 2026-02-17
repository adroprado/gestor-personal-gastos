// --- Importación de Módulos ---
import menuNavegacion from './js/menu-navegacion.js';
import formularioGasto from './js/formulario.js';
// --- Ejecución de Código ---
document.addEventListener('DOMContentLoaded', (e) => {
  menuNavegacion('.btn-pestaña-gastos', '.btn-pestaña-estadisticas');
  formularioGasto(
    '.mensaje-exito',
    '.lista-gastos',
    '.informacion-monto',
    '.informacion-registros',
    '.plantilla',
  );
});
