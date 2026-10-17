// ============================================
// UI - PANTALLA PANTERLEX
// Colección de canciones desbloqueadas
// ============================================

import { catalogo } from '../data/catalogo.js';
import { albumes } from '../data/albumes.js';
import {
    leerPanterlex,
    marcarComoVisto,
    totalDesbloqueadas
} from '../core/panterlex.js';

const ORDEN_ALBUMES = ['single', 'stone', 'tafacil', 'usi', 'colab'];

export function montarPanterlex(contenedor, onVolver) {
    marcarComoVisto();

    const estado = leerPanterlex();
    const desbloqueadas = estado.desbloqueadas;
    const total = catalogo.canciones.length;
    const desbloqueadasTotal = totalDesbloqueadas();

    contenedor.innerHTML = `
        <div class="panterlex">
            <header class="juego-header">
                <button class="juego-btn-volver" id="btnVolver">← Volver</button>
                <div class="juego-titulo-header">Panterlex</div>
                <div class="juego-espacio"></div>
            </header>

            <div class="panterlex-progreso">
                <div class="panterlex-progreso-header">
                    <span class="panterlex-progreso-texto">Tu colección</span>
                    <span class="panterlex-progreso-numero">${desbloqueadasTotal} / ${total}</span>
                </div>
                <div class="panterlex-progreso-barra">
                    <div class="panterlex-progreso-relleno" style="width: ${(desbloqueadasTotal / total) * 100}%"></div>
                </div>
            </div>

            <div class="panterlex-filtros">
                <button class="panterlex-filtro activo" data-filtro="todas">Todas</button>
                <button class="panterlex-filtro" data-filtro="desbloqueadas">Desbloqueadas</button>
                <button class="panterlex-filtro" data-filtro="bloqueadas">Bloqueadas</button>
            </div>

            <div class="panterlex-albumes" id="panterlexAlbumes">
                ${renderizarAlbumes(desbloqueadas)}
            </div>
        </div>
    `;

    document.getElementById('btnVolver').addEventListener('click', () => {
        onVolver();
    });

    contenedor.querySelectorAll('.panterlex-filtro').forEach(btn => {
        btn.addEventListener('click', () => {
            contenedor.querySelectorAll('.panterlex-filtro').forEach(b => b.classList.remove('activo'));
            btn.classList.add('activo');
            const filtro = btn.getAttribute('data-filtro');
            aplicarFiltro(filtro);
        });
    });
}

function renderizarAlbumes(desbloqueadas) {
    return ORDEN_ALBUMES.map(albumId => {
        const album = albumes[albumId];
        const cancionesDelAlbum = catalogo.canciones.filter(c => c.album === albumId);
        const desbloqueadasDelAlbum = cancionesDelAlbum.filter(c => desbloqueadas.includes(c.id)).length;
        const totalDelAlbum = cancionesDelAlbum.length;

        const cancionesHTML = cancionesDelAlbum.map(cancion => {
            const desbloqueada = desbloqueadas.includes(cancion.id);
            return renderizarCancion(cancion, desbloqueada);
        }).join('');

        return `
            <div class="panterlex-album" data-album="${albumId}">
                <div class="panterlex-album-header">
                    <h2 class="panterlex-album-titulo">${album.titulo}</h2>
                    <span class="panterlex-album-contador">${desbloqueadasDelAlbum} / ${totalDelAlbum}</span>
                </div>
                <div class="panterlex-grid">
                    ${cancionesHTML}
                </div>
            </div>
        `;
    }).join('');
}

function renderizarCancion(cancion, desbloqueada) {
    if (desbloqueada) {
        const portadaHTML = cancion.portada
            ? `<img src="${cancion.portada}" alt="${cancion.titulo}">`
            : `<span class="panterlex-cancion-icono">🐆</span>`;

        return `
            <div class="panterlex-cancion desbloqueada" data-id="${cancion.id}">
                <div class="panterlex-cancion-imagen">
                    ${portadaHTML}
                </div>
                <div class="panterlex-cancion-nombre">${cancion.titulo}</div>
            </div>
        `;
    } else {
        return `
            <div class="panterlex-cancion bloqueada" data-id="${cancion.id}">
                <div class="panterlex-cancion-imagen">
                    <span class="panterlex-cancion-interrogacion">?</span>
                </div>
                <div class="panterlex-cancion-nombre">???</div>
            </div>
        `;
    }
}

function aplicarFiltro(filtro) {
    const canciones = document.querySelectorAll('.panterlex-cancion');

    canciones.forEach(cancion => {
        const estaDesbloqueada = cancion.classList.contains('desbloqueada');

        if (filtro === 'todas') {
            cancion.style.display = '';
        } else if (filtro === 'desbloqueadas') {
            cancion.style.display = estaDesbloqueada ? '' : 'none';
        } else if (filtro === 'bloqueadas') {
            cancion.style.display = estaDesbloqueada ? 'none' : '';
        }
    });
}