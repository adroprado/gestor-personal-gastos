// --- Referencias al DOM ---
const d = document;

const $seccionGastos = d.getElementById('gastos'),
  $seccionEstadisticas = d.getElementById('estadisticas'),
  $btnPestañaGastos = d.querySelector('.btn-pestaña-gastos'),
  $btnPestañaEstadisticas = d.querySelector('.btn-pestaña-estadisticas');

export const menuNavegacion = () => {
  d.addEventListener('click', (e) => {
    if (
      e.target === $btnPestañaGastos ||
      e.target === $btnPestañaEstadisticas
    ) {
      // Acción de botón "Gastos"
      $btnPestañaGastos.classList.add('activo');
      $btnPestañaEstadisticas.classList.remove('activo');
      // Acción: busca el id "gastos" y a la clase "contenido-pestaña":
      $seccionGastos.classList.add('activo');
      $seccionEstadisticas.classList.remove('activo');
    }

    if (e.target === $btnPestañaEstadisticas) {
      // Acción de botón "Estadísticas"
      $btnPestañaEstadisticas.classList.add('activo');
      $btnPestañaGastos.classList.remove('activo');
      // Acción: busca el id "estadisticas" y a la clase "contenido-pestaña":
      $seccionEstadisticas.classList.add('activo');
      $seccionGastos.classList.remove('activo');
    }
  });
};
