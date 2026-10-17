// ============================================
// APP - Punto de entrada
// ============================================

import { montarInicio } from './ui/inicio.js';

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    montarInicio(app);
});