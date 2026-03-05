export default function formularioGasto(
  mensajeExito,
  contenedorItems,
  mensajeVacio,
  totalGastos,
  totalRegistros,
  plantilla,
  lienzoGrafica,
  mensajeVacioEstadistica,
) {
  const d = document;
  // --- Referencias al DOM ---
  const $formulario = d.getElementById('formulario-gasto'),
    $contenedorItems = d.querySelector(contenedorItems),
    $mensajeVacio = d.querySelector(mensajeVacio),
    $modalEditar = d.getElementById('modal-editar'),
    $buscador = d.getElementById('buscador'),
    $plantilla = d.querySelector(plantilla).content,
    $fragmento = d.createDocumentFragment(),
    $canvaGrafica = d.querySelector(lienzoGrafica),
    $totalGeneral = d.getElementById('total-general'),
    $promedioMensual = d.getElementById('promedio-mensual'),
    $totalGastos = d.getElementById('total-gastos'),
    $mensajeVacioEstadistica = d.querySelector(mensajeVacioEstadistica);

  // --- Variables Globales ---
  const ls = localStorage;
  let listaDeGastos = [];
  let configuracionMoneda = { style: 'currency', currency: 'MXN' },
    formateadorMoneda = new Intl.NumberFormat('es-MX', configuracionMoneda);

  // --- Funciones de Lógica ---

  // Registra un nuevo gasto, limpia el formulario, muestra mensaje de exito
  const registrarGastoEnMemoria = () => {
    const nuevoGasto = {
      id: Date.now(),
      nombre: $formulario.querySelector('.nombre').value,
      cantidad: $formulario.querySelector('.monto').value,
    };

    listaDeGastos = [...listaDeGastos, nuevoGasto];
    $formulario.reset();

    let temporizador;
    d.querySelector(mensajeExito).classList.toggle('mostrar');
    temporizador = setTimeout(() => {
      d.querySelector(mensajeExito).classList.toggle('mostrar');
    }, 1500);

    setTimeout(temporizador);
  };

  // Guarda la lista actual en el almacenamiento del navegador
  const guardarGastosEnLocal = () =>
    ls.setItem('gastos', JSON.stringify(listaDeGastos));

  // Recupera los datos guardados del almacenamiento del navegador
  const cargarGastosEnLocal = () => {
    let datosRecuperados = JSON.parse(ls.getItem('gastos'));
    listaDeGastos = datosRecuperados || [];
  };
  cargarGastosEnLocal();

  // --- Funciones de Lógica - Tabla Estadísticas ---
  const calcularEstadisticas = () => {
    if (listaDeGastos.length === 0) {
      $canvaGrafica.classList.add('oculto');
      $mensajeVacioEstadistica.classList.remove('oculto');
      // Reseteamos tarjeta información de gastos
      $totalGeneral.textContent = formateadorMoneda.format(0);
      $totalGastos.textContent = 0;
      $promedioMensual.textContent = formateadorMoneda.format(0);
    } else {
      $canvaGrafica.classList.remove('oculto');
      $mensajeVacioEstadistica.classList.add('oculto');
      // Cálculo total de gastos y renderizado del total
      const totalGeneral = listaDeGastos.reduce((acumulador, gasto) => {
        return (acumulador += parseFloat(gasto.cantidad));
      }, 0);
      $totalGeneral.textContent = formateadorMoneda.format(totalGeneral);

      // Cantidad de gastos y renderizado de registros
      const totalGastos = listaDeGastos.length;
      $totalGastos.textContent = totalGastos;

      // Promedio mensual de gastos y renderizado del total
      const promedioMensual = totalGeneral / totalGastos;
      $promedioMensual.textContent = formateadorMoneda.format(promedioMensual);
    }
  };

  calcularEstadisticas();

  // Renderiza la tabla en el DOM (UI) o el gasto a Buscar. Calcula el total. Muestra mensaje, si no existe ningún gasto registrado (agregado) o si el gasto a buscar no existe.
  // Si tú envías algo: La función usa lo que tú le mandaste (en este caso, tu lista filtrada filtrarGasto). Si NO envías nada: La función dice: "Bueno, no me dieron instrucciones, así que usaré la listaDeGastos completa por defecto".
  const actualizarInterfazGastos = (datosAMostrar = listaDeGastos) => {
    // Limpiamos SIEMPRE el contenedor de los items (el cajón)
    $contenedorItems.innerHTML = '';
    if (datosAMostrar.length === 0) {
      // Si no hay ningún gasto, mostramos el mensaje
      $mensajeVacio.classList.remove('oculto');
      // Reseteamos tarjeta información de gastos
      d.querySelector(totalGastos).textContent = formateadorMoneda.format(0);
      d.querySelector(totalRegistros).textContent = 0;
    } else {
      // Si hay gastos, escondemos el letrero y dibujamos
      $mensajeVacio.classList.add('oculto');

      datosAMostrar.forEach((gasto) => {
        let $clonFila = document.importNode($plantilla, true);
        $clonFila.querySelector('.texto-nombre').textContent = gasto.nombre;
        $clonFila.querySelector('.texto-monto').textContent =
          formateadorMoneda.format(gasto.cantidad);
        $clonFila.querySelector('.texto-fecha').textContent =
          new Date().toLocaleDateString();
        $clonFila.querySelector('.btn-editar').dataset.id = gasto.id;
        $clonFila.querySelector('.btn-eliminar').dataset.id = gasto.id;
        $fragmento.appendChild($clonFila);
      });
      $contenedorItems.appendChild($fragmento);

      // Cálculo y renderizado del total
      const sumaTotal = datosAMostrar.reduce((acumulador, gasto) => {
        return (acumulador += parseFloat(gasto.cantidad));
      }, 0);
      d.querySelector(totalGastos).textContent =
        formateadorMoneda.format(sumaTotal);

      // Cantidad y renderizado de registros
      const registroTotal = datosAMostrar.length;
      d.querySelector(totalRegistros).textContent = registroTotal;
    }
  };
  actualizarInterfazGastos();

  // Prepara el modal para editar un gasto existente
  const prepararEdicionGasto = (e) => {
    if (e.target.matches('.btn-editar')) {
      $modalEditar.classList.add('activar-modal');

      // Obteniendo id del dataset que le pasmos al botón "Editar"
      const ID_SELECCIONADO = Number(e.target.dataset.id);

      listaDeGastos.find((gastoEncontrado) => {
        if (gastoEncontrado.id === ID_SELECCIONADO) {
          $modalEditar.querySelector('.nombre').value = gastoEncontrado.nombre;
          $modalEditar.querySelector('.monto').value = gastoEncontrado.cantidad;
          $modalEditar.querySelector('[name="id"]').value = gastoEncontrado.id;
        }
      });
    }
  };

  // Actualiza elemento a editar
  const guardarEdicion = (e) => {
    if (e.target.matches('.btn-guardar')) {
      // Obteniendo el id del elementos a editar en cuestión.
      const ID_ACTUAL = Number($modalEditar.querySelector('[name="id"]').value);

      // Modo: Editar (Inmutabilidad)
      const elementoAEditar = listaDeGastos.map((gasto) =>
        gasto.id === ID_ACTUAL
          ? {
              ...gasto,
              nombre: $modalEditar.querySelector('.nombre').value,
              cantidad: $modalEditar.querySelector('.monto').value,
            }
          : gasto,
      );

      listaDeGastos = elementoAEditar;

      guardarGastosEnLocal();
      actualizarInterfazGastos();
      $modalEditar.querySelector('.nombre').value = '';
      $modalEditar.querySelector('.monto').value = '';
      $modalEditar.querySelector("input[name='id']").value = '';
      $modalEditar.classList.remove('activar-modal');
      calcularEstadisticas();
    }
  };

  // Elimina un gasto de la lista
  const eliminarGastoDeLista = (e) => {
    const ID_ELIMINAR = Number(e.target.dataset.id);

    if (e.target.matches('.btn-eliminar')) {
      listaDeGastos = listaDeGastos.filter((gasto) => {
        if (gasto.id !== ID_ELIMINAR) {
          return gasto;
        }
      });
      guardarGastosEnLocal();
      actualizarInterfazGastos();
      calcularEstadisticas();
    }
  };

  const buscarGasto = () => {
    const terminoBusqueda = $buscador.value.toLowerCase();

    const filtrarGasto = listaDeGastos.filter((gasto) =>
      gasto.nombre.toLowerCase().includes(terminoBusqueda),
    );
    actualizarInterfazGastos(filtrarGasto);
  };

  // --- Eventos de Usuario ---

  $formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    const ID_ACTUAL = Number(e.target.elements.id.value);

    //Si el id oculto no tiene valor, vamos a registrarGastoEnMemoria
    if (!ID_ACTUAL) {
      // Modo: Crear
      registrarGastoEnMemoria();
      guardarGastosEnLocal();
      actualizarInterfazGastos();
      calcularEstadisticas();
    }
  });

  d.addEventListener('click', (e) => {
    if (e.target.matches('.btn-cancelar'))
      $modalEditar.classList.remove('activar-modal');
    prepararEdicionGasto(e);
    guardarEdicion(e);
    eliminarGastoDeLista(e);
  });

  d.addEventListener('keyup', () => {
    buscarGasto();
  });
}
