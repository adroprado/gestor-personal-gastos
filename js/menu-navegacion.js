export default function menuNavegacion(btnGastos, btnEstadisticas) {
  const d = document;

  d.addEventListener('click', (e) => {
    if (e.target.matches(btnGastos) || e.target.matches(btnEstadisticas)) {
      // Acción de botón "Gastos"
      d.querySelector(btnGastos).classList.add('activo');
      d.querySelector(btnEstadisticas).classList.remove('activo');
      // Acción: busca el id "gastos" y a la clase "contenido-pestaña":
      d.getElementById('gastos').classList.add('activo');
      d.getElementById('estadisticas').classList.remove('activo');
    }

    if (e.target.matches(btnEstadisticas)) {
      // Acción de botón "Estadísticas"
      d.querySelector(btnEstadisticas).classList.add('activo');
      d.querySelector(btnGastos).classList.remove('activo');
      // Acción: busca el id "estadisticas" y a la clase "contenido-pestaña":
      d.getElementById('estadisticas').classList.add('activo');
      d.getElementById('gastos').classList.remove('activo');
    }
  });
}
