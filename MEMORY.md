# Aplicación Web de Escaneo de Documentos con Técnicas de Visión por Computador

![Imagen carátula del proyecto](path/to/cover/image.png)

## Autores

- Marcos Vázquez Tascón
- Francisco Javier López-Dufour Morales

## Motivación y Argumentación

El proyecto surge como respuesta a una necesidad real identificada en el sector del transporte: la mejora en la calidad de las fotografías de documentos tomadas por conductores. En la actualidad, muchas empresas de transporte requieren que sus conductores documenten diversos papeles durante sus rutas, pero la calidad de estas capturas suele ser deficiente debido a condiciones variables de iluminación, ángulos inadecuados y otros factores ambientales.

La solución propuesta busca simplificar y optimizar este proceso mediante una aplicación web accesible, que implementa técnicas avanzadas de visión por computador para mejorar automáticamente la calidad de las imágenes capturadas.

## Objetivo de la Propuesta

### Objetivo Principal

Desarrollar una aplicación web que permita el escaneo y procesamiento automático de documentos utilizando técnicas de visión por computador, mejorando significativamente la calidad de las imágenes capturadas.

### Objetivos Específicos

- Implementar un sistema de detección automática de documentos utilizando modelos YOLO
- Desarrollar algoritmos de corrección de perspectiva y mejora de imagen
- Integrar capacidades de OCR para la extracción de texto
- Crear una interfaz web intuitiva y accesible
- Asegurar el funcionamiento completo en el navegador sin necesidad de procesamiento en servidor

## Descripción Técnica

### Arquitectura del Sistema

El proyecto se estructura en tres componentes principales:

1. **Módulo de Mejora de Imágenes**

   - Implementado con OpenCV.js
   - Incluye detección de contornos y corrección de perspectiva
   - Procesamiento de imagen para optimizar la calidad

2. **Sistema de Detección de Documentos**

   - Basado en YOLO y TensorFlow.js
   - Modelo entrenado con dataset específico de documentos
   - Adaptación para funcionamiento en navegador

3. **Motor de OCR**
   - Integración de Tesseract.js
   - Capacidades de extracción de texto
   - Optimización para documentos procesados

### Tecnologías Implementadas

- OpenCV.js para procesamiento de imágenes
- TensorFlow.js para la ejecución del modelo YOLO
- Tesseract.js para OCR
- JavaScript/HTML5 para la interfaz web

## Fuentes y Tecnologías Utilizadas

### Software

- [Software 1]
- [Software 2]

### Hardware

- [Hardware/Sensores utilizados]

### Bibliotecas y Dependencias

- [Biblioteca 1]
- [Biblioteca 2]

## Resultados

[Describir aquí los resultados obtenidos]

## Conclusiones y Propuestas de Ampliación

### Conclusiones

[Describir las conclusiones del proyecto]

### Propuestas de Ampliación

[Listar posibles mejoras o ampliaciones futuras]

## Herramientas Deseadas

[Indicar aquí las herramientas/tecnologías con las que les hubiera gustado contar]

## Enlaces

- [Enlace al código fuente](url_repositorio)
- [Vídeo de demostración](url_video)

## Créditos

[Listar aquí los créditos de materiales no originales del grupo]

## Anexos

### Diario de Reuniones

[Incluir aquí el diario de reuniones del grupo o enlazar al archivo específico]

---

_Proyecto desarrollado para la asignatura de Visión por Computador_
