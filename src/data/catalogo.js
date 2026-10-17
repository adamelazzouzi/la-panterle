// ============================================
// CATÁLOGO COMPLETO DE LA PANTERA
//
// Estructura de cada canción:
//   id:            string único (ej: 'lp-01')
//   album:         string con clave del álbum ('single', 'stone', 'tafacil', 'usi', 'colab')
//   titulo:        string en MAYÚSCULAS
//   feat:          array de artistas o null
//   portada:       ruta a la portada de la canción
//   audioArchivo:  ruta al fragmento de 7s en .m4a
// ============================================

export const catalogo = {
    artista: 'La Pantera',

    canciones: [
        // ============================================
        // SINGLES
        // ============================================
        {
            id: 'lp-01',
            album: 'single',
            titulo: 'QUIERO MÁS',
            feat: null,
            portada: 'assets/portadas/lp-01-quiero-mas.jpg',
            audioArchivo: 'assets/audio-fragmentos/lp-01-quiero-mas.m4a'
        },
        {
            id: 'lp-02',
            album: 'single',
            titulo: 'GOUT',
            feat: null,
            portada: 'assets/portadas/lp-02-gout.jpg',
            audioArchivo: 'assets/audio-fragmentos/lp-02-gout.m4a'
        },
        {
            id: 'lp-03',
            album: 'single',
            titulo: '2030',
            feat: null,
            portada: 'assets/portadas/lp-03-2030.jpg',
            audioArchivo: 'assets/audio-fragmentos/lp-03-2030.m4a'
        },

        // ============================================
        // STONE BOY EUROPA
        // ============================================
        {
            id: 'lp-04',
            album: 'stone',
            titulo: 'TOTY',
            feat: null,
            portada: 'assets/portadas/stone.jpg',
            audioArchivo: 'assets/audio-fragmentos/lp-04-toty.m4a'
        },
        {
            id: 'lp-05',
            album: 'stone',
            titulo: 'MI CARRERA ES MÍA',
            feat: null,
            portada: 'assets/portadas/stone.jpg',
            audioArchivo: 'assets/audio-fragmentos/lp-05-mi-carrera-es-mia.m4a'
        },

        // ============================================
        // TA FACIL
        // ============================================
        {
            id: 'lp-06',
            album: 'tafacil',
            titulo: 'BANE',
            feat: ['Lucho RK'],
            portada: 'assets/portadas/tafacil.jpg',
            audioArchivo: 'assets/audio-fragmentos/lp-06-bane.m4a'
        },
        {
            id: 'lp-07',
            album: 'tafacil',
            titulo: 'SOÑASTE CON UN DRACO',
            feat: ['Lucho RK'],
            portada: 'assets/portadas/tafacil.jpg',
            audioArchivo: 'assets/audio-fragmentos/lp-07-sonaste-con-un-draco.m4a'
        },
        {
            id: 'lp-08',
            album: 'tafacil',
            titulo: 'TOCATE SOLA',
            feat: ['Lucho RK'],
            portada: 'assets/portadas/tafacil.jpg',
            audioArchivo: 'assets/audio-fragmentos/lp-08-tocate-sola.m4a'
        },
        {
            id: 'lp-09',
            album: 'tafacil',
            titulo: 'PINKY PROMISE 2',
            feat: ['Lucho RK'],
            portada: 'assets/portadas/tafacil.jpg',
            audioArchivo: 'assets/audio-fragmentos/lp-09-pinky-promise-2.m4a'
        },
        {
            id: 'lp-10',
            album: 'tafacil',
            titulo: 'LIP SYNC',
            feat: ['Lucho RK'],
            portada: 'assets/portadas/tafacil.jpg',
            audioArchivo: 'assets/audio-fragmentos/lp-10-lip-sync.m4a'
        },
        {
            id: 'lp-11',
            album: 'tafacil',
            titulo: 'TU CANCION',
            feat: ['Lucho RK'],
            portada: 'assets/portadas/tafacil.jpg',
            audioArchivo: 'assets/audio-fragmentos/lp-11-tu-cancion.m4a'
        },
        {
            id: 'lp-12',
            album: 'tafacil',
            titulo: 'INESTABLE',
            feat: ['Lucho RK'],
            portada: 'assets/portadas/tafacil.jpg',
            audioArchivo: 'assets/audio-fragmentos/lp-12-inestable.m4a'
        },

        // ============================================
        // UNA SEMANA INCREÍBLE
        // ============================================
        {
            id: 'lp-13',
            album: 'usi',
            titulo: 'PINKY PROMISE',
            feat: null,
            portada: 'assets/portadas/usi.jpg',
            audioArchivo: 'assets/audio-fragmentos/lp-13-pinky-promise.m4a'
        },

        // ============================================
        // COLABORACIONES
        // ============================================
        {
            id: 'lp-14',
            album: 'colab',
            titulo: 'NO ME GUILLO V2',
            feat: ['ANMI'],
            portada: 'assets/portadas/lp-14-no-me-guillo-v2.jpg',
            audioArchivo: 'assets/audio-fragmentos/lp-14-no-me-guillo-v2.m4a'
        },
        {
            id: 'lp-15',
            album: 'colab',
            titulo: 'PIEL DE CORDERO',
            feat: ['Quevedo'],
            portada: 'assets/portadas/lp-15-piel-de-cordero.jpg',
            audioArchivo: 'assets/audio-fragmentos/lp-15-piel-de-cordero.m4a'
        },
        {
            id: 'lp-16',
            album: 'colab',
            titulo: 'LUCY',
            feat: ['Lucho RK'],
            portada: 'assets/portadas/lp-16-lucy.jpg',
            audioArchivo: 'assets/audio-fragmentos/lp-16-lucy.m4a'
        },
        {
            id: 'lp-17',
            album: 'colab',
            titulo: 'DESCARÁ',
            feat: ['Lucho RK'],
            portada: 'assets/portadas/lp-17-descara.jpg',
            audioArchivo: 'assets/audio-fragmentos/lp-17-descara.m4a'
        },
        {
            id: 'lp-18',
            album: 'colab',
            titulo: 'ALGO VA A PASAR',
            feat: ['Quevedo', 'Lucho RK', 'Juseph'],
            portada: 'assets/portadas/lp-18-algo-va-a-pasar.jpg',
            audioArchivo: 'assets/audio-fragmentos/lp-18-algo-va-a-pasar.m4a'
        },
        {
            id: 'lp-19',
            album: 'colab',
            titulo: 'CUPIDOXX',
            feat: ['Juseph', 'Lucho RK'],
            portada: 'assets/portadas/lp-19-cupidoxx.jpg',
            audioArchivo: 'assets/audio-fragmentos/lp-19-cupidoxx.m4a'
        },
        {
            id: 'lp-20',
            album: 'colab',
            titulo: 'HALO',
            feat: ['Quevedo'],
            portada: 'assets/portadas/lp-20-halo.jpg',
            audioArchivo: 'assets/audio-fragmentos/lp-20-halo.m4a'
        }
    ]
};