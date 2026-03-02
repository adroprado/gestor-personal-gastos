export default function formularioGasto(
  mensajeExito,
  contenedorItems,
  mensajeVacio,
  totalGastos,
  totalRegistros,
  plantilla,
) {
  const d = document;
  // --- Referencias al DOM ---
  const $formulario = d.getElementById('formulario-gasto'),
    $contenedorItems = d.querySelector(contenedorItems),
    $mensajeVacio = d.querySelector(mensajeVacio),
    $modalEditar = d.getElementById('modal-editar'),
    $plantilla = d.querySelector(plantilla).content,
    $fragmento = d.createDocumentFragment();

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

  // Renderiza la tabla en el DOM (UI) y calcula el total. Y muestra mensaje, si no existe ningún gasto registrado (agregado)
  const actualizarInterfazGastos = () => {
    // 1. Limpiamos SIEMPRE el contenedor de los items (el cajón)
    $contenedorItems.innerHTML = '';
    if (listaDeGastos.length === 0) {
      // 2. Si no hay ningún gasto, mostramos el mensaje
      $mensajeVacio.classList.remove('oculto');
      // Reseteamos tarjeta información de gastos
      d.querySelector(totalGastos).textContent = formateadorMoneda.format(0);
      d.querySelector(totalRegistros).textContent = 0;
    } else {
      // 3. Si hay gastos, escondemos el letrero y dibujamos
      $mensajeVacio.classList.add('oculto');

      listaDeGastos.forEach((gasto) => {
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
      const sumaTotal = listaDeGastos.reduce((acumulador, gasto) => {
        return (acumulador += parseFloat(gasto.cantidad));
      }, 0);
      d.querySelector(totalGastos).textContent =
        formateadorMoneda.format(sumaTotal);

      // Cantidad y renderizado de registros
      const registroTotal = listaDeGastos.length;
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
  const guardarMontoEditar = (e) => {
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
    }
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
    }
  });

  document.addEventListener('click', (e) => {
    if (e.target.matches('.btn-cancelar'))
      $modalEditar.classList.remove('activar-modal');
    prepararEdicionGasto(e);
    guardarMontoEditar(e);
    eliminarGastoDeLista(e);
  });
}
