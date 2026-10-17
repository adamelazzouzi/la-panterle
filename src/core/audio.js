// ============================================
// CORE - AUDIO
// Control de reproducción de audio
// ============================================

// ============================================
// ESTADO INTERNO
// ============================================
let audioActual = null;
let timeoutParada = null;

// ============================================
// DESBLOQUEAR AUDIO EN iOS
//
// iOS Safari exige que el primer play() venga de un
// gesto directo del usuario. Cualquier await o setTimeout
// rompe esa cadena.
//
// Esta función debe llamarse SÍNCRONAMENTE dentro de un
// click/touch. Crea un AudioContext, lo resume y reproduce
// un buffer silencioso.
// ============================================
export function desbloquearAudioIOS() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;

        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        const buffer = ctx.createBuffer(1, 1, 22050);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start(0);

        console.log('🔓 Audio desbloqueado');
    } catch (e) {
        console.warn('No se pudo desbloquear el audio:', e);
    }
}

// ============================================
// PARAR EL AUDIO ACTUAL
// ============================================
export function pararAudio() {
    if (timeoutParada) {
        clearTimeout(timeoutParada);
        timeoutParada = null;
    }

    if (audioActual) {
        audioActual.pause();
        audioActual.currentTime = 0;
        audioActual = null;
    }
}

// ============================================
// PRECARGAR UN LOTE DE CANCIONES
//
// Carga N audios en lotes y devuelve un array
// de objetos { cancion, audio } listos para usar.
// ============================================
export async function precargarCanciones(canciones, tamanoLote = 3, onProgreso = null) {
    const resultados = [];
    const total = canciones.length;
    let cargadas = 0;

    if (onProgreso) onProgreso(cargadas, total);

    for (let i = 0; i < canciones.length; i += tamanoLote) {
        const lote = canciones.slice(i, i + tamanoLote);

        const promesas = lote.map(cancion => cargarAudio(cancion));
        const resultadosLote = await Promise.allSettled(promesas);

        for (const resultado of resultadosLote) {
            if (resultado.status === 'fulfilled' && resultado.value) {
                resultados.push(resultado.value);
            }
            cargadas++;
            if (onProgreso) onProgreso(cargadas, total);
        }
    }

    return resultados;
}

// ============================================
// CARGAR UN AUDIO INDIVIDUAL
// Devuelve { cancion, audio } cuando está listo
// ============================================
function cargarAudio(cancion) {
    return new Promise((resolve) => {
        const audio = new Audio();
        audio.preload = 'auto';
        audio.src = cancion.audioArchivo;

        let resuelto = false;

        const resolver = (valor) => {
            if (resuelto) return;
            resuelto = true;
            audio.removeEventListener('canplaythrough', onReady);
            audio.removeEventListener('error', onError);
            resolve(valor);
        };

        const onReady = () => resolver({ cancion, audio });
        const onError = () => {
            console.warn(`⚠️ No se pudo cargar: ${cancion.titulo}`);
            resolver(null);
        };

        audio.addEventListener('canplaythrough', onReady, { once: true });
        audio.addEventListener('error', onError, { once: true });

        audio.load();

        // Timeout de seguridad: 5 segundos máximo por canción
        setTimeout(() => {
            if (audio.readyState < 3) {
                resolver({ cancion, audio });
            }
        }, 5000);
    });
}

// ============================================
// REPRODUCIR UN AUDIO YA PRECARGADO
//
// Como los fragmentos ya son de 7s y siempre
// empiezan en 0, solo hay que hacer play()
// y programar la parada.
//
// Parámetros:
//   audio:        el objeto Audio ya precargado
//   duracionSeg:  cuántos segundos reproducir
// ============================================
export function reproducirAudioPrecargado(audio, duracionSeg) {
    return new Promise((resolve, reject) => {
        if (!audio) {
            reject(new Error('Audio no válido'));
            return;
        }

        pararAudio();
        audioActual = audio;

        // Resetear al inicio por si acaso
        try {
            audio.currentTime = 0;
        } catch (e) {
            // Ignorar
        }

        audio.play()
            .then(() => {
                timeoutParada = setTimeout(() => {
                    audio.pause();
                    resolve();
                }, duracionSeg * 1000);
            })
            .catch(err => {
                console.error('Error al reproducir:', err);
                reject(err);
            });
    });
}