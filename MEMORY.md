# Aplicación Web de Escaneo de Documentos con Técnicas de Visión por Computador

![Imagen carátula del proyecto](assets/cover.png)

**Autores**

- Marcos Vázquez Tascón
- Francisco Javier López-Dufour Morales

**Fecha de entrega**

2025-01-09

<div class="page"/>

## Índice

- [Aplicación Web de Escaneo de Documentos con Técnicas de Visión por Computador](#aplicación-web-de-escaneo-de-documentos-con-técnicas-de-visión-por-computador)
  - [Índice](#índice)
  - [Motivación y Argumentación](#motivación-y-argumentación)
  - [Objetivo de la Propuesta](#objetivo-de-la-propuesta)
    - [Objetivo Principal](#objetivo-principal)
    - [Objetivos Específicos](#objetivos-específicos)
  - [Descripción Técnica](#descripción-técnica)
    - [Arquitectura del Sistema](#arquitectura-del-sistema)
    - [Tecnologías Implementadas](#tecnologías-implementadas)
  - [Fuentes y Tecnologías Utilizadas](#fuentes-y-tecnologías-utilizadas)
    - [Software](#software)
    - [Hardware](#hardware)
    - [Bibliotecas y Dependencias](#bibliotecas-y-dependencias)
  - [Resultados](#resultados)
    - [Entrenamiento del Modelo](#entrenamiento-del-modelo)
    - [Resultados del Entrenamiento](#resultados-del-entrenamiento)
    - [Ejemplo de Inferencia](#ejemplo-de-inferencia)
  - [Conclusiones y Propuestas de Ampliación](#conclusiones-y-propuestas-de-ampliación)
    - [Conclusiones](#conclusiones)
    - [Propuestas de Ampliación](#propuestas-de-ampliación)
  - [Enlaces](#enlaces)
  - [Créditos](#créditos)

<div class="page"/>

## Motivación y Argumentación

En una sociedad que avanza rápidamente hacia la **digitalización** de los procesos y la reducción de documentos físicos, contar con herramientas que faciliten la **captura, mejora y gestión de documentos** se ha convertido en una necesidad ineludible. Fotografiar o escanear documentos (contratos, recibos, facturas, informes, apuntes académicos, etc.) de forma rápida y fiable es un requisito no solo para las grandes empresas, sino también para usuarios individuales y pequeños negocios.

Los retos más comunes que se presentan en esta tarea son:
	•	**Condiciones de iluminación y enfoque** inadecuadas, que degradan la calidad de las imágenes.
	•	**Perspectivas erróneas** (folios doblados o torcidos) que impiden una correcta lectura o extracción de texto.
	•	**Procesos de OCR** (Reconocimiento Óptico de Caracteres) que fallan cuando las imágenes no están suficientemente depuradas.

Para dar respuesta a estos desafíos, este proyecto propone una **aplicación web** capaz de **escanear** y **procesar** automáticamente imágenes de documentos, brindando herramientas de corrección de perspectiva y mejoras en la calidad de la imagen. Gracias a la integración con librerías de **OCR**, el sistema también permite extraer texto de los documentos procesados, reduciendo significativamente el tiempo que se dedica a la introducción manual de datos. 

Con esta solución, se busca satisfacer las demandas de un amplio abanico de usuarios y sectores: estudiantes que digitalizan apuntes, profesionales que organizan expedientes, familias que guardan sus facturas e incluso emprendedores que quieren gestionar facturas y recibos de manera ordenada y accesible. 

<div class="page"/>

## Objetivo de la Propuesta

### Objetivo Principal

Desarrollar una aplicación web que permita el escaneo y procesamiento automático de documentos utilizando técnicas de visión por computador, mejorando significativamente la calidad de las imágenes capturadas.

### Objetivos Específicos

- Implementar un sistema de detección automática de documentos utilizando modelos YOLOv11
- Desarrollar algoritmos de corrección de perspectiva y mejora de imagen
- Integrar capacidades de OCR para la extracción de texto
- Crear una interfaz web intuitiva y accesible
- Asegurar el funcionamiento completo en el navegador sin necesidad de procesamiento en servidor

<div class="page"/>

## Descripción Técnica

### Arquitectura del Sistema

El proyecto se estructura en cuatro componentes principales:

1. **Módulo de Mejora de Imágenes**

   - Implementado con OpenCV.js
   - Incluye detección de contornos y corrección de perspectiva
   - Procesamiento de imagen para optimizar la calidad

2. **Sistema de Detección de Documentos**

   - Basado en YOLO y TensorFlow.js
   - Modelo entrenado con dataset específico de documentos
   - Adaptación para funcionamiento en navegador

   Durante el proceso de exportación del modelo YOLOv11n a TensorFlow.js, nos encontramos con un desafío técnico interesante: la diferencia en el formato de salida entre la inferencia en `Python` y `JavaScript`. Mientras que en `Python` (usando Ultralytics) el modelo devuelve directamente las coordenadas de los bounding boxes procesadas, en `TensorFlow.js` el modelo exportado produce un tensor con forma `[1, 5, 8400]`. Este tensor representa:

   - 8400 posibles detecciones
   - 5 canales de información por cada detección (x, y, ancho, alto, confianza)

   Esta diferencia se debe a que TensorFlow.js prioriza la eficiencia y flexibilidad, permitiendo que el post-procesamiento se realice en el lado del cliente según las necesidades específicas de la aplicación. Esta decisión de diseño nos llevó a buscar una solución que implemente esta capa adicional de procesamiento en `JavaScript` para interpretar y visualizar las detecciones correctamente.

   Para resolver este desafío, nos basamos en el trabajo de código abierto de [Wahyu Setianto](https://github.com/Hyuto), quien desarrolló una implementación eficiente del post-procesamiento de tensores para YOLOv8 en TensorFlow.js. Su solución nos permitió manejar correctamente la salida del modelo y visualizar las detecciones en el navegador.

   Además, nos enfrentamos a otro desafío técnico importante relacionado con el manejo de imágenes de diferentes dimensiones. El modelo YOLO está entrenado para trabajar con entradas de 640x640 píxeles, pero las fotografías tomadas con dispositivos móviles suelen tener dimensiones diferentes (por ejemplo, 1280x720 o 1920x1080). Esto requirió implementar un proceso de transformación de coordenadas que consta de los siguientes pasos:

   1. **Preprocesamiento de la imagen**:

      - Cálculo del lado máximo entre el ancho y alto de la imagen original
      - Aplicación de padding para obtener una imagen cuadrada
      - Reescalado final a 640x640 píxeles

   2. **Transformación de coordenadas post-detección**:
      - Las coordenadas devueltas por el modelo ([y₁, x₁, y₂, x₂]) están referidas a la imagen 640x640
      - Se calcula el factor de escala: `scale = modelWidth / maxSize`
      - Se revierten las coordenadas al espacio original mediante:
        - Eliminación del escalado: `coord_padded = coord_640 / scale`
        - Ajuste a dimensiones reales: `coord_real = max(0, min(sourceDimension, coord_padded))`

   La implementación final incluye un manejo robusto de casos especiales, validaciones de dimensiones y soporte tanto para imágenes estáticas como para video en tiempo real. El código completo de la función de manejo de detección está disponible en el repositorio.

   Para la exportación del modelo a TensorFlow.js utilizamos el siguiente código:

   ```python
   from ultralytics import YOLO

   # Load the YOLO11 model
   model = YOLO("/content/detect/docuvision/weights/best.pt")

   # Export the model to TF.js format
   model.export(format="tfjs", simplify=True)  # creates '/best_web_model'
   ```

3. **Motor de OCR**

   - Integración de Tesseract.js
   - Capacidades de extracción de texto
   - Optimización para documentos procesados

4. **Sistema de Despliegue Continuo**

   - Implementación de GitHub Actions para despliegue automático
   - Configuración de GitHub Pages como plataforma de hosting
   - Automatización del proceso de build y deploy

   El proyecto utiliza GitHub Actions para automatizar el despliegue a GitHub Pages cada vez que se realiza un push a la rama `master`. El workflow de despliegue:

   - Configura Node.js con caché de npm para optimizar el proceso
   - Instala las dependencias usando `npm ci`
   - Construye el proyecto
   - Despliega los archivos generados a la rama `gh-pages`

### Tecnologías Implementadas

- `OpenCV.js` para procesamiento de imágenes
- `TensorFlow.js` para la ejecución del modelo YOLO
- `Tesseract.js` para OCR
- `JavaScript/HTML5` para la interfaz web
- `WebGL` como backend para la aceleración de inferencias
- `GitHub Actions` para integración y despliegue continuo
- `GitHub Pages` como plataforma de hosting

<div class="page"/>

## Fuentes y Tecnologías Utilizadas

### Software

- Visual Studio Code como IDE principal
- Google Colab para el entrenamiento del modelo
- Node.js y Yarn para la gestión de dependencias del frontend
- Git y GitHub para control de versiones y despliegue automático
- Vite como herramienta de build

### Hardware

- [Hardware/Sensores utilizados]

### Bibliotecas y Dependencias

- TensorFlow.js con backend WebGL para inferencia en el navegador
- YOLOv11n convertido a formato TensorFlow.js
- Implementación base del post-procesamiento de tensores basada en yolov8-tfjs
- gh-pages para el despliegue automático a GitHub Pages

<div class="page"/>

## Resultados

### Entrenamiento del Modelo

El entrenamiento del modelo se realizó utilizando YOLOv8n como base, con los siguientes parámetros:

- 100 épocas de entrenamiento
- Tamaño de imagen: 640x640
- Dataset: Four Corners Detection

Especificaciones del dataset:

- Resolución de imágenes: 640x640 píxeles
- Canales: 3 (RGB)
- Tipo de datos: uint8
- Tamaño medio por imagen: ~118KB

El proceso de exportación del modelo a TensorFlow.js requirió consideraciones especiales para su uso en el navegador. El modelo exportado produce tensores que requieren post-procesamiento adicional para convertir las predicciones en coordenadas utilizables. Esta característica, aunque inicialmente desafiante, nos permitió optimizar el rendimiento y personalizar el procesamiento según las necesidades específicas de nuestra aplicación web.

```python
from ultralytics import YOLO

model = YOLO("/content/drive/MyDrive/yolo11n.pt")

train_results = model.train(
    data="data.yaml",
    epochs=100,
    imgsz=640,
    name='docuvision'
)

metrics = model.val()
```

Los resultados de la validación del modelo muestran un muy buen rendimiento:

```
                 Class     Images  Instances      Box(P          R      mAP50  mAP50-95)
                   all        747       1021      0.936      0.897      0.921      0.862
```

El modelo fue evaluado sobre un conjunto de validación de 747 imágenes que contenían 1021 instancias de documentos, obteniendo métricas muy robustas:

- Precisión (P): 0.936 - Indica que el 93.6% de las detecciones realizadas son correctas
- Recall (R): 0.897 - El modelo es capaz de detectar el 89.7% de todos los documentos presentes
- mAP50: 0.921 - La precisión media con un IoU (Intersection over Union) del 50% es del 92.1%
- mAP50-95: 0.862 - La precisión media sobre múltiples umbrales de IoU es del 86.2%, lo que indica que el modelo es muy preciso en la mayoría de las detecciones.

Estos resultados demuestran que el modelo es altamente preciso en la detección de documentos, con un equilibrio óptimo entre precisión y recall.

### Resultados del Entrenamiento

Las siguientes gráficas muestran las métricas de rendimiento obtenidas durante el entrenamiento:

| **Curva F1**                                                                                                                                                                                         | **Curva de Precisión**                                                                                                                                        |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ![Curva F1](detect/docuvision/F1_curve.png)                                                                                                                                                          | ![Curva de Precisión](detect/docuvision/P_curve.png)                                                                                                          |
| Podemos observar que la curva F1 muestra que el modelo logra un buen equilibrio entre precisión y recall, alcanzando un valor máximo de 0.92. Esto indica un buen rendimiento general.               | En la curva de precisión se muestra que el modelo es altamente confiable, logrando hasta un 100% de precisión en niveles altos de confianza.                  |
| **Curva PR**                                                                                                                                                                                         | **Curva de Recall**                                                                                                                                           |
| ![Curva PR](detect/docuvision/PR_curve.png)                                                                                                                                                          | ![Curva de Recall](detect/docuvision/R_curve.png)                                                                                                             |
| La curva PR demuestra un equilibrio sobresaliente entre precisión y recall, con un área bajo la curva (mAP) de 0.922, lo que indica un excelente rendimiento en la clasificación general del modelo. | La curva de recall muestra que el modelo identifica correctamente el 94% de los casos positivos, siendo muy efectivo incluso con umbrales bajos de confianza. |

### Ejemplo de Inferencia

![Ejemplo de detección de documento](assets/inference_example.png)

<div class="page"/>

## Conclusiones y Propuestas de Ampliación

### Conclusiones

Este proyecto demuestra la **viabilidad** de una aplicación web completamente enfocada en la digitalización de documentos, combinando **OpenCV.js** para correcciones de perspectiva y mejora de imágenes, **TensorFlow.js** con **YOLOv11** para la detección de documentos, y **Tesseract.js** para el OCR. A pesar de su solvencia, el desarrollo no estuvo exento de retos.

En particular, la **exportación del modelo YOLOv11n** desde Ultralytics a TensorFlow.js resultó un desafío notable, principalmente debido a la **diferencia en los formatos de salida** y a la necesidad de gestionar coordenadas con dimensiones variables de imágenes. Fue imprescindible implementar post-procesamientos adicionales en JavaScript, así como establecer flujos de preprocesamiento y escalado de coordenadas para obtener bounding boxes correctamente localizadas.

El **entrenamiento** con un dataset específico y la adaptación de técnicas de visión por computador a la ejecución en el navegador subrayan el potencial de estas tecnologías para soluciones que no dependan de servidores externos. Asimismo, se confirma que la detección y corrección de documentos es factible en entornos web, con resultados precisos y tiempos de inferencia razonables, especialmente gracias al backend **WebGL** de TensorFlow.js.

En definitiva, el proyecto sienta las bases para aplicaciones que requieran un **procesamiento local** en el navegador, al mismo tiempo que evidencia la importancia de la optimización y la correcta gestión de modelos avanzados de visión por computador cuando se trasladan a entornos JavaScript.

<div class="page"/>

### Propuestas de Ampliación

Dado el enfoque formativo de este proyecto en la asignatura de Visión por Computador, se identifican varias vías de expansión que podrían potenciar aún más la calidad y el alcance de la aplicación:

1. **Modelos Nativos de TensorFlow.js**

   - Entrenar y optimizar modelos diseñados específicamente para su ejecución con TensorFlow.js, aprovechando los últimos avances en arquitecturas ligeras (p. ej., MobileNet, EfficientNet) que brindan resultados competitivos con un menor consumo de recursos.
   - Conservar la inferencia en el navegador sin depender de servidores externos, garantizando privacidad y reduciendo la latencia.

2. **Aplicación Nativa para Móviles**

   - Desarrollar una versión móvil (Android/iOS) que utilice la aceleración de hardware (GPU/TPU integradas) para operaciones de visión por computador, lo que mejoraría el rendimiento y la velocidad de inferencia respecto a la aplicación web.
   - Incorporar reconocimiento de documentos en tiempo real desde la cámara, brindando una experiencia de usuario más fluida y sin pasos intermedios de carga o post-procesamiento.

3. **Sistemas de Seguimiento de Movimientos y Estabilización**

   - Integrar técnicas como la detección de puntos clave en OpenCV.js o TensorFlow.js para estimar la posición del teléfono o la mano, facilitando una estabilización previa antes de tomar la foto.
   - Reducir imágenes borrosas o mal enfocadas, mejorando la calidad final de los documentos capturados.

4. **Detección de Múltiples Páginas y Documentos Compuestos**

   - Extender la lógica de detección para identificar varias páginas dentro de una sola foto (p. ej., al escanear un cuaderno o un documento grapado).
   - Diseñar un pipeline que permita la segmentación de cada página, su corrección de perspectiva y la posterior combinación en un PDF multi-página.

5. **Reconocimiento de Texto Avanzado (OCR + NLP)**

   - Explorar el uso de modelos OCR más especializados o un pipeline de Procesamiento de Lenguaje Natural (NLP) para extraer información semántica (fechas, nombres, importes, etc.) de los documentos.
   - Aplicar técnicas de etiquetado automático para organizar y clasificar documentos de manera inteligente.

6. **Filtrado y Mejora Avanzada de la Imagen**

   - Investigar nuevas técnicas de desenfoque selectivo, realce adaptativo de contraste o reducción de ruido basadas en deep learning (p. ej., redes U-Net) para mejorar la legibilidad de documentos.
   - Incluir algoritmos de detección de sombras que puedan corregir y eliminar artefactos indeseados en la iluminación del documento.

7. **Arquitecturas Más Livianas para Dispositivos Limitados**

   - Desarrollar o adaptar modelos con arquitecturas de baja complejidad (Tiny YOLO, MobileNet, etc.) para su uso en dispositivos con menor capacidad de cómputo, asegurando la máxima accesibilidad.

8. **Almacenamiento en la Nube y Colaboración**

   - Integrar servicios de almacenamiento en la nube (Firebase, Amazon S3, etc.) para que varios usuarios puedan colaborar, anotar y consultar los documentos escaneados en tiempo real.

<div class="page"/>

## Enlaces

- [Enlace al código fuente](https://github.com/gitfrandu4/docu-scan)
- [Aplicación desplegada](https://gitfrandu4.github.io/docu-scan/)
- [Dataset de entrenamiento](https://universe.roboflow.com/tmayolov8/four-corners-detection)
- [Documentación oficial de Ultralytics sobre exportación de modelos](https://docs.ultralytics.com/modes/export/)
- [Discusión sobre diferencias en pre/post-procesamiento de YOLOv8](https://github.com/ultralytics/ultralytics/issues/2451)
- [Análisis del post-procesamiento en TensorFlow.js](https://github.com/ultralytics/ultralytics/issues/13413)
- [Guía de integración de TensorFlow.js con YOLO (Español)](https://docs.ultralytics.com/es/integrations/tfjs/)
- [Repositorio yolov8-tfjs](https://github.com/Hyuto/yolov8-tfjs) - Implementación base para el post-procesamiento de tensores YOLOv8 en TensorFlow.js
- [Documentación de GitHub Pages](https://docs.github.com/en/pages)
- [Guía de Despliegue Estático de Vite](https://vitejs.dev/guide/static-deploy.html)
- [Documentación de GitHub Actions](https://docs.github.com/en/actions)

<div class="page"/>

## Créditos

- Dataset "Four Corners Detection" de Roboflow, utilizado para el entrenamiento del modelo de detección de documentos (material no original del grupo)
- Implementación base del post-procesamiento de tensores YOLOv8 en TensorFlow.js por Wahyu Setianto
