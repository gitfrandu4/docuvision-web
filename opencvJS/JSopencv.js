/*******************************************************
 * jsOpenCv.js
 * Lógica de procesamiento de imágenes con OpenCV.js
 ******************************************************/

/**
 * 1: Variables globales para controlar si OpenCV está listo y
 *    para almacenar temporalmente la imagen procesada.
 */
let isOpenCvReady = false;
let processedImage = null;

/**
 * 2: Función que se llama cuando OpenCV ha cargado correctamente.
 */
async function onOpenCvReady() {
    // Vinculamos la variable global cv al objeto OpenCV cargado
    window.cv = await window.cv;
    console.log("OpenCV.js está listo");
    isOpenCvReady = true;
}

/**
 * 3: Función que se llama si ocurre un error al cargar OpenCV.
 */
function onOpenCvError() {
    console.error("Error al cargar OpenCV.js");
    alert("No se pudo cargar OpenCV. Revisa tu conexión o la consola para más detalles.");
}

/**
 * 4: Esperar al DOM cargado para inicializar listeners de botones.
 */
document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("fileInput");
    const previewImage = document.getElementById("previewImage");
    const processButton = document.getElementById("processButton");
    const processedCanvas = document.getElementById("processedCanvas");

    // 4.1: Listener para el cambio de archivo (selección de imagen).
    fileInput.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (!file) return;

        // Habilitar el botón de procesar
        processButton.disabled = false;

        // Crear URL de la imagen seleccionada para previsualizarla
        const imageURL = URL.createObjectURL(file);
        previewImage.src = imageURL;
        previewImage.style.display = "block";
        processedCanvas.style.display = "none"; // Ocultar el canvas hasta procesar
    });

    // 4.2: Listener para el botón "Aplicar correcciones".
    processButton.addEventListener("click", function () {
        if (!isOpenCvReady) {
            alert("OpenCV todavía se está cargando. Intenta de nuevo en unos segundos.");
            return;
        }

        // Convertir la imagen <img> en un canvas temporal
        const tempCanvas = document.createElement("canvas");
        const ctx = tempCanvas.getContext("2d");

        // Ajustar el tamaño del canvas al de la imagen previa
        tempCanvas.width = previewImage.naturalWidth;
        tempCanvas.height = previewImage.naturalHeight;

        // Dibujar la imagen en el canvas temporal
        ctx.drawImage(previewImage, 0, 0);

        // Aplicar la lógica de escaneo
        scanDocument(tempCanvas);

        // Mostrar el canvas final (processedCanvas) con la imagen ya procesada
        processedCanvas.style.display = "block";
    });
});

/*******************************************************
 * 5: Función principal que escanea/detecta un documento
 *    y lo procesa con OpenCV.
 *******************************************************/
function scanDocument(tempCanvas) {
    try {
        // 5.1: Cargar la imagen en un Mat de OpenCV
        let mat = cv.imread(tempCanvas);

        // 5.2: Redimensionar (para un procesamiento más rápido)
        const RESCALED_HEIGHT = 500.0;
        const ratio = mat.rows / RESCALED_HEIGHT;
        let resized = new cv.Mat();
        let dsize = new cv.Size(Math.round(mat.cols / ratio), Math.round(RESCALED_HEIGHT));
        cv.resize(mat, resized, dsize, 0, 0, cv.INTER_AREA);

        // 5.3: Convertir a escala de grises
        let gray = new cv.Mat();
        cv.cvtColor(resized, gray, cv.COLOR_RGBA2GRAY);

        // 5.4: Difuminado (blur) para eliminar ruido
        let blurred = new cv.Mat();
        cv.GaussianBlur(gray, blurred, new cv.Size(7, 7), 0);

        // 5.5: Operaciones morfológicas (close)
        let kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(9, 9));
        let dilated = new cv.Mat();
        cv.morphologyEx(blurred, dilated, cv.MORPH_CLOSE, kernel);

        // 5.6: Detección de bordes con Canny
        let edges = new cv.Mat();
        cv.Canny(dilated, edges, 0, 84);

        // 5.7: Buscar contornos
        let contours = new cv.MatVector();
        let hierarchy = new cv.Mat();
        cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

        // 5.8: Ordenar contornos por área (descendiente)
        let contourAreas = [];
        for (let i = 0; i < contours.size(); i++) {
            let cnt = contours.get(i);
            let area = cv.contourArea(cnt);
            contourAreas.push({ index: i, area: area });
        }
        contourAreas.sort((a, b) => b.area - a.area);

        // 5.9: Intentar encontrar el mejor contorno
        let bestApprox = null;
        const imgArea = resized.rows * resized.cols;
        for (let i = 0; i < Math.min(5, contourAreas.length); i++) {
            let cnt = contours.get(contourAreas[i].index);
            let peri = cv.arcLength(cnt, true);
            let approx = new cv.Mat();
            cv.approxPolyDP(cnt, approx, 0.02 * peri, true);

            // Si el contorno tiene 4 vértices y un área decente, lo tomamos
            if (approx.rows === 4) {
                let area = cv.contourArea(approx);
                if (area >= imgArea * 0.25) {
                    bestApprox = approx;
                    break;
                }
            }
            approx.delete();
        }

        // 5.10: Realizar la transformación de perspectiva
        let finalMat;
        if (bestApprox) {
            // Escalar los puntos al tamaño original
            let points = [];
            for (let i = 0; i < 4; i++) {
                let x = bestApprox.data32S[i * 2] * ratio;
                let y = bestApprox.data32S[i * 2 + 1] * ratio;
                points.push({ x: x, y: y });
            }
            points = sortPoints(points);
            finalMat = fourPointTransform(mat, points);
            bestApprox.delete();
        } else {
            // Si no encontramos contorno válido, usar la imagen completa
            let fullPoints = [
                { x: 0,             y: 0 },
                { x: mat.cols - 1,  y: 0 },
                { x: mat.cols - 1,  y: mat.rows - 1 },
                { x: 0,             y: mat.rows - 1 },
            ];
            finalMat = fourPointTransform(mat, fullPoints);
        }

        // 5.11: Convertir a gris, sharpen y binarizar
        cv.cvtColor(finalMat, finalMat, cv.COLOR_RGBA2GRAY);
        let sharpened = sharpenImage(finalMat);

        let binarized = new cv.Mat();
        cv.adaptiveThreshold(
            sharpened,
            binarized,
            255,
            cv.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv.THRESH_BINARY,
            21,
            15
        );

        // 5.12: Mostrar resultado en el canvas final
        cv.imshow("processedCanvas", binarized);
        processedImage = binarized; // Guardamos la referencia (por si se requiere)

        // 5.13: Liberar la memoria
        mat.delete();
        resized.delete();
        gray.delete();
        blurred.delete();
        kernel.delete();
        dilated.delete();
        edges.delete();
        hierarchy.delete();
        finalMat.delete();
        sharpened.delete();
        for (let i = 0; i < contours.size(); i++) {
            contours.get(i).delete();
        }
        contours.delete();

    } catch (error) {
        console.error("Error al procesar imagen con OpenCV:", error);
        alert("Ocurrió un error al procesar la imagen. Revisa la consola para más detalles.");
    }
}

/*******************************************************
 * 6: Funciones auxiliares
 ******************************************************/

/**
 * Ordena 4 puntos en orden: top-left, top-right, bottom-right, bottom-left.
 */
function sortPoints(pts) {
    // Ordenar por la coordenada Y (ascendente)
    pts.sort((a, b) => a.y - b.y);

    // Los dos primeros se consideran top, los dos últimos bottom
    const top = pts.slice(0, 2).sort((a, b) => a.x - b.x);
    const bottom = pts.slice(2, 4).sort((a, b) => a.x - b.x);

    return [top[0], top[1], bottom[1], bottom[0]];
}

/**
 * Realiza la transformación de perspectiva dada una matriz (mat) y 4 puntos.
 */
function fourPointTransform(mat, pts) {
    let [tl, tr, br, bl] = pts;

    // Calcular anchos y altos
    let widthA = Math.hypot(br.x - bl.x, br.y - bl.y);
    let widthB = Math.hypot(tr.x - tl.x, tr.y - tl.y);
    let maxWidth = Math.max(widthA, widthB);

    let heightA = Math.hypot(tr.x - br.x, tr.y - br.y);
    let heightB = Math.hypot(tl.x - bl.x, tl.y - bl.y);
    let maxHeight = Math.max(heightA, heightB);

    // Puntos de origen
    let srcCoords = cv.matFromArray(4, 1, cv.CV_32FC2, [
        tl.x, tl.y,
        tr.x, tr.y,
        br.x, br.y,
        bl.x, bl.y
    ]);

    // Puntos de destino
    let dstCoords = cv.matFromArray(4, 1, cv.CV_32FC2, [
        0, 0,
        maxWidth - 1, 0,
        maxWidth - 1, maxHeight - 1,
        0, maxHeight - 1
    ]);

    // Transformación
    let M = cv.getPerspectiveTransform(srcCoords, dstCoords);
    let dsize = new cv.Size(maxWidth, maxHeight);
    let warped = new cv.Mat();
    cv.warpPerspective(mat, warped, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

    // Liberar
    srcCoords.delete();
    dstCoords.delete();
    M.delete();

    return warped;
}

/**
 * Aproximación de "sharpen" para la imagen en gris (Gaussian + addWeighted).
 */
function sharpenImage(grayMat) {
    let blurred = new cv.Mat();
    cv.GaussianBlur(grayMat, blurred, new cv.Size(0, 0), 3);

    let sharpened = new cv.Mat();
    // output = 1.5*gray - 0.5*blurred
    cv.addWeighted(grayMat, 1.5, blurred, -0.5, 0, sharpened);

    blurred.delete();
    return sharpened;
}
