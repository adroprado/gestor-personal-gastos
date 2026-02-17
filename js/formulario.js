export default function formularioGasto(
  mensajeExito,
  lista,
  totalGastos,
  totalRegistros,
  plantilla,
) {
  const d = document;
  // --- Referencias al DOM ---
  const $formulario = d.getElementById('formulario-gasto'),
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
    if (listaDeGastos.length === 0) {
      // console.log('No hay gastos registrados ;)');
      return null;
    } else {
      // Limpia el contenido actual de la tabla para evitar duplicados
      d.querySelector(lista).innerHTML = '';
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
      d.querySelector(lista).appendChild($fragmento);

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

  // Prepara el formulario para editar un gasto existente
  const prepararEdicionGasto = (e) => {
    if (e.target.matches('.btn-editar')) {
      document.querySelector('h2').textContent = 'Editar Gasto';

      // Obteniendo id del dataset que le pasmos al botón "Editar"
      const ID_SELECCIONADO = Number(e.target.dataset.id);

      listaDeGastos.find((gastoEncontrado) => {
        if (gastoEncontrado.id === ID_SELECCIONADO) {
          // .nombre, .monto, .id. No esta accediendo a la clase, esta obteniendo como referencia el atributo "name", para agregarle el valor

          $formulario.nombre.value = gastoEncontrado.nombre;
          $formulario.monto.value = gastoEncontrado.cantidad;
          $formulario.id.value = gastoEncontrado.id;
        }
      });
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

    // const ID_ACTUAL = e.target.elements.id.value;
    const ID_ACTUAL = Number(e.target.elements.id.value);

    //Si el id oculto no tiene valor, vamos a registrarGastoEnMemoria, de lo contrario prepararEdicionGasto.
    if (!ID_ACTUAL) {
      // Modo: Crear
      registrarGastoEnMemoria();
      guardarGastosEnLocal();
      actualizarInterfazGastos();
    } else {
      // Modo: Editar (Inmutabilidad)
      const elementoAEditar = listaDeGastos.map((gasto) =>
        gasto.id === ID_ACTUAL
          ? {
              ...gasto,
              nombre: document.querySelector('.nombre').value,
              cantidad: document.querySelector('.monto').value,
            }
          : gasto,
      );
      listaDeGastos = elementoAEditar;

      // Resetear visualmente el formulario
      guardarGastosEnLocal();
      actualizarInterfazGastos();
      $formulario.reset();
      document.querySelector('h2').textContent = 'Agregar Gasto';
      $formulario.querySelector("input[name='id']").value = '';
    }
  });

  document.addEventListener('click', (e) => {
    prepararEdicionGasto(e);
    eliminarGastoDeLista(e);
  });
}
