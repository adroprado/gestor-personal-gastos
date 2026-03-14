// --- Referencias al DOM ---
const d = document,
  $seccionGastos = d.getElementById('gastos'),
  $seccionEstadisticas = d.getElementById('estadisticas'),
  $btnPestañaGastos = d.querySelector('.btn-pestaña-gastos'),
  $btnPestañaEstadisticas = d.querySelector('.btn-pestaña-estadisticas');

// --- Selectores ---
const SELECTOR_REQUERIDO = '.formulario-campo [required]';

// --- Configuración de Clases CSS ---
const CLASE_ACTIVO = 'activo';
const CLASE_ERROR = 'activar-error';

// --- Navegación ---
export const menuNavegacion = () => {
  d.addEventListener('click', (e) => {
    if (e.target === $btnPestañaGastos) {
      // Acción de botón "Gastos"
      $btnPestañaGastos.classList.add(CLASE_ACTIVO);
      $btnPestañaEstadisticas.classList.remove(CLASE_ACTIVO);
      // Acción: busca el id "gastos" y a la clase "contenido-pestaña":
      $seccionGastos.classList.add(CLASE_ACTIVO);
      $seccionEstadisticas.classList.remove(CLASE_ACTIVO);
    }

    if (e.target === $btnPestañaEstadisticas) {
      // Acción de botón "Estadísticas"
      $btnPestañaEstadisticas.classList.add(CLASE_ACTIVO);
      $btnPestañaGastos.classList.remove(CLASE_ACTIVO);
      // Acción: busca el id "estadisticas" y a la clase "contenido-pestaña":
      $seccionEstadisticas.classList.add(CLASE_ACTIVO);
      $seccionGastos.classList.remove(CLASE_ACTIVO);
    }
  });
};

// --- Validaciones de Formularios ---
export const formularioValidaciones = () => {
  d.addEventListener('keyup', (e) => {
    // Validación inputs
    if (e.target.matches(SELECTOR_REQUERIDO)) {
      let input = e.target,
        reglaPatron = input.pattern;

      if (reglaPatron) {
        let regex = new RegExp(reglaPatron);

        if (!regex.exec(input.value)) {
          input.classList.add(CLASE_ERROR);
          input.nextElementSibling.classList.add(CLASE_ERROR);
        } else {
          input.classList.remove(CLASE_ERROR);
          input.nextElementSibling.classList.remove(CLASE_ERROR);
        }
      }
    }
  });
};
