// ============================================
// MODO - LA PANTERLE
// Adivina la canción con buscador (5 rondas, 15s)
// ============================================

import { catalogo } from '../data/catalogo.js';
import {
    precargarCanciones,
    reproducirAudioPrecargado,
    pararAudio,
    desbloquearAudioIOS
} from '../core/audio.js';
import { cogerAleatorios } from '../core/utils.js';
import { desbloquear, registrarPartida } from '../core/panterlex.js';
import { crearBuscador } from '../ui/buscador.js';

// ============================================
// CONFIGURACIÓN
// ============================================
const CONFIG = {
    totalRondas: 5,
    duracionFragmento: 5,
    duracionPregunta: 15,
    tamanoLotePrecarga: 3
};

// ============================================
// ESTADO DEL JUEGO
// ============================================
const estado = {
    rondaActual: 0,
    puntuacion: 0,
    preguntas: [],
    audios: {},
    timer: null,
    tiempoRestante: 0,
    respondiendo: false,
    buscador: null
};

// ============================================
// GENERAR PREGUNTAS
// ============================================
function generarPreguntas() {
    const canciones = catalogo.canciones;
    const cancionesElegidas = cogerAleatorios(canciones, CONFIG.totalRondas);

    return cancionesElegidas.map(cancion => ({
        correcta: cancion
    }));
}

// ============================================
// MONTAR EL JUEGO
// ============================================
export function montarPanterle(contenedor, onVolver) {
    estado.rondaActual = 0;
    estado.puntuacion = 0;
    estado.preguntas = generarPreguntas();
    estado.audios = {};

    contenedor.innerHTML = `
        <div class="panterle">
            <header class="juego-header">
                <button class="juego-btn-volver" id="btnVolver">← Volver</button>
                <div class="juego-titulo-header">La Panterle</div>
                <div class="juego-espacio"></div>
            </header>

            <div class="panterle-inicio">
                <div class="panterle-inicio-icono">🐆</div>
                <h1 class="panterle-inicio-titulo">La Panterle</h1>
                <p class="panterle-inicio-descripcion">
                    Escucharás 5 segundos de una canción aleatoria de La Pantera.<br>
                    Tienes 15 segundos para buscarla y adivinarla.
                </p>
                <div class="panterle-inicio-info">
                    <div class="panterle-inicio-info-item">
                        <span class="panterle-inicio-info-valor">5</span>
                        <span class="panterle-inicio-info-label">Rondas</span>
                    </div>
                    <div class="panterle-inicio-info-item">
                        <span class="panterle-inicio-info-valor">15s</span>
                        <span class="panterle-inicio-info-label">Por ronda</span>
                    </div>
                    <div class="panterle-inicio-info-item">
                        <span class="panterle-inicio-info-valor">5s</span>
                        <span class="panterle-inicio-info-label">De audio</span>
                    </div>
                </div>
                <button class="panterle-btn-empezar" id="btnEmpezar">Empezar partida</button>
            </div>
        </div>
    `;

    document.getElementById('btnVolver').addEventListener('click', () => {
        pararAudio();
        if (estado.timer) clearInterval(estado.timer);
        onVolver();
    });

    document.getElementById('btnEmpezar').addEventListener('click', () => {
        desbloquearAudioIOS();
        precargarYEmpezar(contenedor, onVolver);
    });
}

// ============================================
// PRECARGAR CANCIONES Y EMPEZAR PARTIDA
// ============================================
async function precargarYEmpezar(contenedor, onVolver) {
    const idsUnicos = [...new Set(estado.preguntas.map(p => p.correcta.id))];
    const cancionesAUsar = idsUnicos.map(id => catalogo.canciones.find(c => c.id === id));

    contenedor.innerHTML = `
        <div class="panterle">
            <header class="juego-header">
                <button class="juego-btn-volver" id="btnVolver">← Volver</button>
                <div class="juego-titulo-header">La Panterle</div>
                <div class="juego-espacio"></div>
            </header>

            <div class="panterle-preparando">
                <div class="panterle-preparando-icono">🐆</div>
                <h2 class="panterle-preparando-titulo">Preparando canciones</h2>
                <p class="panterle-preparando-descripcion">Un momento...</p>

                <div class="panterle-preparando-barra">
                    <div class="panterle-preparando-relleno" id="prepRelleno"></div>
                </div>

                <div class="panterle-preparando-contador" id="prepContador">0 / ${cancionesAUsar.length}</div>
            </div>
        </div>
    `;

    document.getElementById('btnVolver').addEventListener('click', () => {
        pararAudio();
        onVolver();
    });

    const relleno = document.getElementById('prepRelleno');
    const contador = document.getElementById('prepContador');

    const resultados = await precargarCanciones(
        cancionesAUsar,
        CONFIG.tamanoLotePrecarga,
        (cargadas, total) => {
            const pct = (cargadas / total) * 100;
            if (relleno) relleno.style.width = pct + '%';
            if (contador) contador.textContent = `${cargadas} / ${total}`;
        }
    );

    estado.audios = {};
    for (const { cancion, audio } of resultados) {
        estado.audios[cancion.id] = audio;
    }

    if (resultados.length === 0) {
        console.error('No se pudo precargar ninguna canción');
        onVolver();
        return;
    }

    empezarPartida(contenedor, onVolver);
}

// ============================================
// EMPEZAR PARTIDA
// ============================================
function empezarPartida(contenedor, onVolver) {
    estado.rondaActual = 0;
    estado.puntuacion = 0;
    mostrarRonda(contenedor, onVolver);
}

// ============================================
// MOSTRAR RONDA
// ============================================
function mostrarRonda(contenedor, onVolver) {
    const pregunta = estado.preguntas[estado.rondaActual];

    if (!pregunta) {
        mostrarFinal(contenedor, onVolver);
        return;
    }

    estado.respondiendo = false;
    estado.tiempoRestante = CONFIG.duracionPregunta;

    contenedor.innerHTML = `
        <div class="panterle">
            <header class="juego-header">
                <button class="juego-btn-volver" id="btnVolver">← Volver</button>
                <div class="juego-titulo-header">Ronda ${estado.rondaActual + 1} / ${CONFIG.totalRondas}</div>
                <div class="juego-espacio">
                    <span class="panterle-puntuacion">${estado.puntuacion} pts</span>
                </div>
            </header>

            <div class="panterle-ronda">
                <div class="panterle-timer">
                    <div class="panterle-timer-barra">
                        <div class="panterle-timer-relleno" id="timerRelleno"></div>
                    </div>
                    <div class="panterle-timer-texto" id="timerTexto">${CONFIG.duracionPregunta}s</div>
                </div>

                <div class="panterle-audio-indicador" id="audioIndicador">
                    <span class="panterle-audio-icono">🔊</span>
                    <span class="panterle-audio-texto">Reproduciendo fragmento...</span>
                </div>

                <h2 class="panterle-pregunta">¿Qué canción es?</h2>

                <div class="panterle-buscador-contenedor" id="buscadorContenedor"></div>
            </div>
        </div>
    `;

    document.getElementById('btnVolver').addEventListener('click', () => {
        pararAudio();
        if (estado.timer) clearInterval(estado.timer);
        onVolver();
    });

    // Crear buscador
    const buscadorContenedor = document.getElementById('buscadorContenedor');
    estado.buscador = crearBuscador(
        buscadorContenedor,
        catalogo.canciones,
        (cancion) => {
            if (estado.respondiendo) return;
            responder(cancion.id, contenedor, onVolver);
        },
        'Busca una canción...'
    );

    // Enfocar buscador
    setTimeout(() => estado.buscador.enfocar(), 100);

    // Inicializar barra de timer
    const relleno = document.getElementById('timerRelleno');
    if (relleno) relleno.style.width = '100%';

    // Reproducir audio
    const audio = estado.audios[pregunta.correcta.id];

    reproducirAudioPrecargado(audio, CONFIG.duracionFragmento)
        .then(() => {
            const indicador = document.getElementById('audioIndicador');
            if (indicador) {
                indicador.innerHTML = `
                    <span class="panterle-audio-icono">🔇</span>
                    <span class="panterle-audio-texto">Fragmento terminado</span>
                `;
            }
        })
        .catch((err) => {
            console.error('Error al reproducir:', err);
        });

    empezarCuentaAtras(contenedor, onVolver);
}

// ============================================
// CUENTA ATRÁS
// ============================================
function empezarCuentaAtras(contenedor, onVolver) {
    estado.tiempoRestante = CONFIG.duracionPregunta;
    actualizarTimer();

    const intervalo = setInterval(() => {
        if (estado.respondiendo) {
            clearInterval(intervalo);
            return;
        }

        estado.tiempoRestante -= 0.1;

        if (estado.tiempoRestante <= 0) {
            clearInterval(intervalo);
            responder(null, contenedor, onVolver);
        } else {
            actualizarTimer();
        }
    }, 100);

    estado.timer = intervalo;
}

function actualizarTimer() {
    const relleno = document.getElementById('timerRelleno');
    const texto = document.getElementById('timerTexto');

    if (!relleno || !texto) return;

    const porcentaje = (estado.tiempoRestante / CONFIG.duracionPregunta) * 100;
    relleno.style.width = porcentaje + '%';
    texto.textContent = Math.ceil(estado.tiempoRestante) + 's';

    if (estado.tiempoRestante <= 3) {
        relleno.classList.add('urgente');
    } else {
        relleno.classList.remove('urgente');
    }
}

// ============================================
// RESPONDER
// ============================================
function responder(idElegido, contenedor, onVolver) {
    if (estado.respondiendo) return;
    estado.respondiendo = true;

    if (estado.timer) clearInterval(estado.timer);
    pararAudio();

    if (estado.buscador) {
        estado.buscador.deshabilitar();
    }

    const pregunta = estado.preguntas[estado.rondaActual];
    const idCorrecto = pregunta.correcta.id;
    const acierto = idElegido === idCorrecto;

    if (acierto) {
        estado.puntuacion++;
        desbloquear(idCorrecto);
    }

    const indicador = document.getElementById('audioIndicador');
    if (indicador) {
        if (acierto) {
            indicador.innerHTML = '<span class="panterle-audio-icono">✅</span><span class="panterle-audio-texto">¡Correcto!</span>';
        } else {
            const textoFallo = idElegido === null
                ? 'Sin respuesta'
                : `Incorrecto. Era: ${pregunta.correcta.titulo}`;
            indicador.innerHTML = `<span class="panterle-audio-icono">❌</span><span class="panterle-audio-texto">${textoFallo}</span>`;
        }
        indicador.classList.add(acierto ? 'acierto' : 'fallo');
    }

    setTimeout(() => {
        estado.rondaActual++;
        mostrarRonda(contenedor, onVolver);
    }, 2000);
}

// ============================================
// PANTALLA FINAL
// ============================================
function mostrarFinal(contenedor, onVolver) {
    const puntuacion = estado.puntuacion;
    const total = CONFIG.totalRondas;

    registrarPartida(puntuacion);

    let mensaje, emoji;
    if (puntuacion === total) {
        mensaje = 'Eres el puto amo';
        emoji = '🏆';
    } else if (puntuacion >= 4) {
        mensaje = 'Eres fan de La Pantera';
        emoji = '🔥';
    } else if (puntuacion >= 3) {
        mensaje = 'Nada mal. Se nota que lo escuchas';
        emoji = '👍';
    } else if (puntuacion >= 2) {
        mensaje = 'Eres un fakefan';
        emoji = '🤡';
    } else {
        mensaje = '¿Qué haces jugando a esto?';
        emoji = '🥀';
    }

    contenedor.innerHTML = `
        <div class="panterle">
            <div class="panterle-final">
                <div class="panterle-final-emoji">${emoji}</div>
                <div class="panterle-final-puntuacion">
                    <span class="panterle-final-numero">${puntuacion}</span>
                    <span class="panterle-final-total">/ ${total}</span>
                </div>
                <p class="panterle-final-mensaje">${mensaje}</p>

                <div class="panterle-final-acciones">
                    <button class="panterle-btn-empezar" id="btnJugarDeNuevo">Jugar de nuevo</button>
                    <button class="panterle-btn-secundario" id="btnVolverInicio">Volver al inicio</button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('btnJugarDeNuevo').addEventListener('click', () => {
        desbloquearAudioIOS();
        estado.preguntas = generarPreguntas();
        estado.audios = {};
        precargarYEmpezar(contenedor, onVolver);
    });

    document.getElementById('btnVolverInicio').addEventListener('click', () => {
        onVolver();
    });
}