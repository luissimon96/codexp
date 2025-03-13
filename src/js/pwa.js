// Variáveis para o PWA
let deferredPrompt;
const installBanner = document.getElementById('install-banner');
const installButton = document.getElementById('install-button');

// Registrar o service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('../js/service-worker.js')
            .then(registration => {
                console.log('Service Worker registrado com sucesso:', registration);
            })
            .catch(error => {
                console.log('Falha ao registrar o Service Worker:', error);
            });
    });
}

// Capturar o evento beforeinstallprompt
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevenir o comportamento padrão do navegador
    e.preventDefault();
    // Armazenar o evento para uso posterior
    deferredPrompt = e;
    // Mostrar o banner de instalação
    if (installBanner) {
        installBanner.style.display = 'flex';
    }
});

// Adicionar evento de clique ao botão de instalação
if (installButton) {
    installButton.addEventListener('click', async () => {
        if (!deferredPrompt) {
            return;
        }
        // Mostrar o prompt de instalação
        deferredPrompt.prompt();
        // Aguardar a resposta do usuário
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`Resultado da instalação: ${outcome}`);
        // Limpar a variável deferredPrompt
        deferredPrompt = null;
        // Esconder o banner de instalação
        if (installBanner) {
            installBanner.style.display = 'none';
        }
    });
}

// Verificar se o app já está instalado
window.addEventListener('appinstalled', () => {
    console.log('Aplicativo instalado com sucesso!');
    // Esconder o banner de instalação
    if (installBanner) {
        installBanner.style.display = 'none';
    }
    // Limpar a variável deferredPrompt
    deferredPrompt = null;
});

// Verificar se o app está sendo executado em modo standalone
if (window.matchMedia('(display-mode: standalone)').matches || 
    window.navigator.standalone === true) {
    // O app está instalado e sendo executado como PWA
    if (installBanner) {
        installBanner.style.display = 'none';
    }
}

// Fechar o banner de instalação
document.getElementById('close-install-banner')?.addEventListener('click', () => {
    if (installBanner) {
        installBanner.style.display = 'none';
        // Armazenar no localStorage que o usuário fechou o banner
        localStorage.setItem('installBannerClosed', 'true');
    }
});

// Verificar se o usuário já fechou o banner anteriormente
document.addEventListener('DOMContentLoaded', () => {
    const bannerClosed = localStorage.getItem('installBannerClosed') === 'true';
    if (bannerClosed && installBanner) {
        installBanner.style.display = 'none';
    }
}); 