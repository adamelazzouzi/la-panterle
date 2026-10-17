// ============================================
// UI - PANTALLA DE INICIO
// ============================================

import { montarPanterle } from '../modos/panterle.js';
import { montarPanterlex } from './panterlex.js';
import { catalogo } from '../data/catalogo.js';
import { albumes } from '../data/albumes.js';
import { totalDesbloqueadas, hayDesbloqueosNuevos, numeroDesbloqueosNuevos } from '../core/panterlex.js';

// ============================================
// CONFIGURACIÓN DEL CARRUSEL
// ============================================
const CARRUSEL_INTERVALO = 3000;

// ============================================
// MONTAR INICIO
// ============================================
export function montarInicio(contenedor) {
    const totalCanciones = catalogo.canciones.length;
    const desbloqueadas = totalDesbloqueadas();
    const hayNuevos = hayDesbloqueosNuevos();
    const numNuevos = numeroDesbloqueosNuevos();

    contenedor.innerHTML = `
        <header class="inicio-header">
            <div class="inicio-portada">
                <div class="inicio-carrusel" id="carrusel">
                    <img src="assets/carrusel/pantera.jpg" alt="La Pantera" class="activa">
                    <img src="assets/carrusel/stone.jpg" alt="Portada STONE BOY EUROPA">
                    <img src="assets/carrusel/tafacil.jpg" alt="Portada TA FACIL">
                </div>
            </div>
            <h1 class="inicio-titulo">La Panterle</h1>
            <p class="inicio-artista">La Pantera</p>
            <p class="inicio-subtitulo">${totalCanciones} canciones. 10 rondas. Sin registro.</p>
        </header>

        <main class="inicio-modos">
            <button class="modo-card" data-modo="panterle">
                <div class="modo-card-icono">🐆</div>
                <div class="modo-card-info">
                    <h2 class="modo-card-titulo">Jugar a La Panterle</h2>
                    <p class="modo-card-descripcion">Adivina cuántas canciones puedes reconocer</p>
                </div>
                <div class="modo-card-flecha">→</div>
            </button>

            <button class="modo-card modo-card-panterlex" data-modo="panterlex">
                <div class="modo-card-icono">📖</div>
                <div class="modo-card-info">
                    <h2 class="modo-card-titulo">
                        Panterlex
                        ${hayNuevos ? `<span class="panterlex-badge-nuevo">+${numNuevos}</span>` : ''}
                    </h2>
                    <p class="modo-card-descripcion">Tu colección: ${desbloqueadas} / ${totalCanciones}</p>
                </div>
                <div class="modo-card-flecha">→</div>
            </button>
        </main>

        <footer class="inicio-footer">
            <p>Proyecto personal sin ánimo de lucro. Las canciones son propiedad de La Pantera y su sello.</p>
        </footer>
    `;

    iniciarCarrusel();

    contenedor.querySelectorAll('[data-modo]').forEach(btn => {
        btn.addEventListener('click', () => {
            const modo = btn.getAttribute('data-modo');

            if (modo === 'panterle') {
                montarPanterle(contenedor, () => montarInicio(contenedor));
            } else if (modo === 'panterlex') {
                montarPanterlex(contenedor, () => montarInicio(contenedor));
            }
        });
    });
}

// ============================================
// CARRUSEL DE PORTADAS
// ============================================
let carruselInterval = null;

function iniciarCarrusel() {
    if (carruselInterval) {
        clearInterval(carruselInterval);
        carruselInterval = null;
    }

    const imagenes = document.querySelectorAll('#carrusel img');
    if (imagenes.length === 0) return;

    let indiceActual = 0;

    carruselInterval = setInterval(() => {
        imagenes[indiceActual].classList.remove('activa');
        indiceActual = (indiceActual + 1) % imagenes.length;
        imagenes[indiceActual].classList.add('activa');
    }, CARRUSEL_INTERVALO);
}

// ============================================
// PARAR CARRUSEL
// ============================================
export function pararCarrusel() {
    if (carruselInterval) {
        clearInterval(carruselInterval);
        carruselInterval = null;
    }
}