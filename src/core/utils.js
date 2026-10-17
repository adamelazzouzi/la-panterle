// ============================================
// CORE - UTILS
// Funciones helper reutilizables
// ============================================

// ============================================
// BARAJAR UN ARRAY (Fisher-Yates)
// Devuelve una copia barajada, no modifica el original
// ============================================
export function barajar(array) {
    const copia = [...array];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

// ============================================
// COGER N ELEMENTOS ALEATORIOS DE UN ARRAY
// ============================================
export function cogerAleatorios(array, cantidad) {
    return barajar(array).slice(0, cantidad);
}

// ============================================
// COGER UN ELEMENTO ALEATORIO
// ============================================
export function cogerAleatorio(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// ============================================
// NÚMERO ALEATORIO ENTERO ENTRE MIN Y MAX (incluidos)
// ============================================
export function aleatorioEntre(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ============================================
// SEGUNDO ALEATORIO VÁLIDO PARA UN AUDIO
//
// Calcula un segundo de inicio aleatorio que:
//   - No sea negativo
//   - Deje al menos "margenFinal" segundos después
//     de la reproducción completa
//
// Parámetros:
//   duracionTotal:  duración total de la canción en segundos
//   duracionAudio:  cuántos segundos se van a reproducir
//   margenFinal:    segundos que deben quedar al final (default: 20)
// ============================================
export function segundoAleatorio(duracionTotal, duracionAudio, margenFinal = 20) {
    const max = duracionTotal - duracionAudio - margenFinal;

    // Si la canción es muy corta, empezar desde el segundo 0
    if (max <= 0) return 0;

    return aleatorioEntre(0, max);
}

// ============================================
// NORMALIZAR TEXTO (para búsquedas)
// Quita tildes, eñes, mayúsculas y caracteres raros
// ============================================
export function normalizar(texto) {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // quita tildes
        .replace(/ñ/g, 'n')
        .replace(/[^a-z0-9\s]/g, '') // quita caracteres no alfanuméricos
        .replace(/\s+/g, ' ') // colapsa espacios
        .trim();
}
