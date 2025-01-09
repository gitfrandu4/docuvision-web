// Referencias a elementos del DOM
const fileInput = document.getElementById('fileInput');
const previewImage = document.getElementById('previewImage');
const processButton = document.getElementById('processButton');
const resultText = document.getElementById('resultText');

// Guardaremos el DataURL de la imagen
let selectedImageDataURL = null;

// Escuchamos el evento "change" del input de archivos
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Guardamos el DataURL
      selectedImageDataURL = e.target.result;
      // Mostramos la vista previa
      previewImage.src = selectedImageDataURL;
      previewImage.style.display = 'block';
      // Habilitamos el botón de Procesar
      processButton.disabled = false;
    };
    // Leemos el archivo como DataURL
    reader.readAsDataURL(file);
  }
});

// Cuando pulsamos en "Procesar"
processButton.addEventListener('click', () => {
  if (!selectedImageDataURL) return;

  // Mostramos un mensaje mientras procesa
  resultText.textContent = 'Procesando... Por favor, espera.';

  // Llamamos a Tesseract
  Tesseract.recognize(selectedImageDataURL, 'spa', {
    logger: (m) => console.log(m)
  })
    .then(({ data: { text } }) => {
      // Mostrar el texto reconocido
      resultText.textContent = text;
    })
    .catch((err) => {
      console.error(err);
      resultText.textContent = 'Ocurrió un error al procesar la imagen.';
    });
});
