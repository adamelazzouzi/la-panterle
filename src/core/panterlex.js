// ============================================
// CORE - PANTERLEX
// Persistencia del progreso del usuario
// ============================================

const CLAVE = 'la-panterle-panterlex';

function estadoInicial() {
    return {
        desbloqueadas: [],
        desbloqueosNuevos: 0,
        partidasJugadas: 0,
        mejorPuntuacion: 0
    };
}

export function leerPanterlex() {
    try {
        const raw = localStorage.getItem(CLAVE);
        if (!raw) return estadoInicial();

        const estado = JSON.parse(raw);

        return {
            desbloqueadas: Array.isArray(estado.desbloqueadas) ? estado.desbloqueadas : [],
            desbloqueosNuevos: typeof estado.desbloqueosNuevos === 'number' ? estado.desbloqueosNuevos : 0,
            partidasJugadas: typeof estado.partidasJugadas === 'number' ? estado.partidasJugadas : 0,
            mejorPuntuacion: typeof estado.mejorPuntuacion === 'number' ? estado.mejorPuntuacion : 0
        };
    } catch (e) {
        console.warn('Error al leer Panterlex:', e);
        return estadoInicial();
    }
}

export function guardarPanterlex(estado) {
    try {
        localStorage.setItem(CLAVE, JSON.stringify(estado));
    } catch (e) {
        console.warn('Error al guardar Panterlex:', e);
    }
}

export function estaDesbloqueada(id) {
    const estado = leerPanterlex();
    return estado.desbloqueadas.includes(id);
}

export function desbloquear(id) {
    const estado = leerPanterlex();

    if (estado.desbloqueadas.includes(id)) {
        return false;
    }

    estado.desbloqueadas.push(id);
    estado.desbloqueosNuevos++;
    guardarPanterlex(estado);
    return true;
}

export function totalDesbloqueadas() {
    const estado = leerPanterlex();
    return estado.desbloqueadas.length;
}

export function desbloqueadasPorAlbum(albumId, catalogo) {
    const estado = leerPanterlex();
    const idsDelAlbum = catalogo.canciones
        .filter(c => c.album === albumId)
        .map(c => c.id);

    return estado.desbloqueadas.filter(id => idsDelAlbum.includes(id)).length;
}

export function hayDesbloqueosNuevos() {
    const estado = leerPanterlex();
    return estado.desbloqueosNuevos > 0;
}

export function numeroDesbloqueosNuevos() {
    const estado = leerPanterlex();
    return estado.desbloqueosNuevos;
}

export function marcarComoVisto() {
    const estado = leerPanterlex();
    estado.desbloqueosNuevos = 0;
    guardarPanterlex(estado);
}

export function registrarPartida(puntuacion) {
    const estado = leerPanterlex();
    estado.partidasJugadas++;
    if (puntuacion > estado.mejorPuntuacion) {
        estado.mejorPuntuacion = puntuacion;
    }
    guardarPanterlex(estado);
}

export function resetearPanterlex() {
    try {
        localStorage.removeItem(CLAVE);
    } catch (e) {
        console.warn('Error al resetear Panterlex:', e);
    }
}