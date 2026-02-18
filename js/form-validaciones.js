export default function formValidaciones() {
  const d = document;

  d.addEventListener('keyup', (e) => {
    // Validación campo nombre
    if (e.target.matches('.formulario-campo [required]')) {
      let input = e.target,
        reglaPatron = input.pattern;

      if (reglaPatron) {
        let regex = new RegExp(reglaPatron);

        if (!regex.exec(input.value)) {
          input.classList.add('activar-error');
          input.nextElementSibling.classList.add('activar-error');
        } else {
          input.classList.remove('activar-error');
          input.nextElementSibling.classList.remove('activar-error');
        }
      }
    }
  });
}
