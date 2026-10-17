// ============================================
// UI - BUSCADOR DE CANCIONES
// Componente reutilizable con autocompletado
// ============================================

import { normalizar } from '../core/utils.js';

// ============================================
// CREAR BUSCADOR
//
// Parámetros:
//   contenedor: elemento donde se monta
//   canciones: array de canciones donde buscar
//   onSeleccionar: callback al seleccionar una cancion
//   placeholder: texto del input
// ============================================
export function crearBuscador(contenedor, canciones, onSeleccionar, placeholder = 'Busca una canción...') {
    // Limpiar contenedor
    contenedor.innerHTML = '';

    // Crear estructura
    const wrapper = document.createElement('div');
    wrapper.className = 'buscador';
    wrapper.innerHTML = `
        <input
            type="text"
            class="buscador-input"
            placeholder="${placeholder}"
            autocomplete="off"
            spellcheck="false"
        >
        <div class="buscador-resultados oculto"></div>
    `;

    contenedor.appendChild(wrapper);

    const input = wrapper.querySelector('.buscador-input');
    const resultados = wrapper.querySelector('.buscador-resultados');

    // ============================================
    // FILTRAR CANCIONES
    // ============================================
    function filtrarCanciones(query) {
        const queryNorm = normalizar(query);
        if (!queryNorm) return [];

        return canciones
            .filter(c => normalizar(c.titulo).includes(queryNorm))
            .slice(0, 6); // máximo 6 sugerencias
    }

    // ============================================
    // RENDERIZAR RESULTADOS
    // ============================================
    function renderizarResultados(lista) {
        if (lista.length === 0) {
            resultados.classList.add('oculto');
            return;
        }

        resultados.innerHTML = lista.map(c => `
            <button class="buscador-item" data-id="${c.id}">
                <span class="buscador-item-titulo">${c.titulo}</span>
                ${c.feat ? `<span class="buscador-item-feat">feat. ${c.feat.join(', ')}</span>` : ''}
            </button>
        `).join('');

        resultados.classList.remove('oculto');

        // Conectar items
        resultados.querySelectorAll('.buscador-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const cancion = canciones.find(c => c.id === id);

                if (cancion) {
                    input.value = '';
                    resultados.classList.add('oculto');
                    onSeleccionar(cancion);
                }
            });
        });
    }

    // ============================================
    // EVENTOS
    // ============================================
    input.addEventListener('input', () => {
        const query = input.value.trim();
        if (query.length < 1) {
            resultados.classList.add('oculto');
            return;
        }
        renderizarResultados(filtrarCanciones(query));
    });

    input.addEventListener('focus', () => {
        const query = input.value.trim();
        if (query.length >= 1) {
            renderizarResultados(filtrarCanciones(query));
        }
    });

    // Cerrar al pulsar fuera
    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
            resultados.classList.add('oculto');
        }
    });

    // Exponer métodos
    return {
        enfocar: () => input.focus(),
        limpiar: () => {
            input.value = '';
            resultados.classList.add('oculto');
        },
        deshabilitar: () => {
            input.disabled = true;
            resultados.classList.add('oculto');
        }
    };
}