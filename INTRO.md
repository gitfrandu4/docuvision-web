# Título del Proyecto: Aplicación Web de Escaneo de Documentos con Técnicas de Visión por Computadora

Introducción: El proyecto surge de la necesidad de mejorar la calidad de las fotos de documentos tomadas por conductores de una empresa de transporte. Se busca crear una aplicación web que escanee documentos utilizando diversas tecnologías vistas durante el curso.

## Fases del Proyecto:

### Mejora de Imágenes con OpenCV.js:

* Desarrollo de un script en Python utilizando OpenCV para mejorar la calidad de las imágenes, detectando contornos y mejorando la perspectiva de los documentos.
* Migración de este script a OpenCV.js para su uso en el navegador.

### Detección de Documentos con YOLO y TensorFlow.js:

* Entrenamiento de un modelo YOLO con un dataset específico de documentos.
* Exportación del modelo entrenado a JavaScript utilizando TensorFlow.js para su integración en la aplicación web.
* Solución de problemas relacionados con la pérdida de capas finales al exportar el modelo, utilizando un repositorio que ya cuenta con el procesamiento necesario.

### Extracción de Texto con PyTesseract y JavaScript:

* Integración de librerías de OCR como PyTesseract para extraer el texto de los documentos.
* Uso de la versión JavaScript de PyTesseract para mantener la funcionalidad en el navegador.

### Problemas y Soluciones:

* Al exportar el modelo YOLO a JavaScript, se perdieron algunas capas finales cruciales para la inferencia. Para solucionar esto, se utilizó un repositorio que ya tenía implementado el procesamiento necesario para la inferencia con TensorFlow.js.

### Ideas de Ampliación y Mejora:

* Optimización del Procesamiento: Implementar técnicas de preprocesamiento para reducir el ruido en las imágenes antes de la detección y OCR.
* Ampliación del Dataset: Incorporar más ejemplos para entrenar el modelo YOLO y mejorar su precisión.
* Funciones Adicionales: Implementar un sistema de almacenamiento en la nube para los documentos escaneados, permitiendo acceso y organización fácil.
* Aplicaciones Potenciales: Uso en áreas como archivística, gestión de documentos legales, o cualquier entorno que requiera digitalización de documentos físicos.
