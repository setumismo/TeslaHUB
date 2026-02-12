const APP_URLS = {
    waze: 'https://waze.com/live-map',
    googleMapsPlanning: 'https://www.google.com/maps/dir/',
    spotifyWeb: 'https://open.spotify.com',
    youtubeMusic: 'https://music.youtube.com',
    youtube: 'https://www.youtube.com',
    telegramWeb: 'https://web.telegram.org',
    whatsappWeb: 'https://web.whatsapp.com',
    googleSearch: 'https://www.google.com',
    googleCalendar: 'https://calendar.google.com',
    boardingGateOriginal: 'https://boardinggate.github.io/Tesla/tesla.html',
    localNavigator: 'navigator.html'
};

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
    updateTime();
    loadWeather();
    setInterval(updateTime, 1000);
});

// ===== RELOJ =====
function updateTime() {
    const now = new Date();
    const timeElement = document.getElementById('currentTime');
    const dateElement = document.getElementById('currentDate');
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timeElement.textContent = `${hours}:${minutes}`;
    
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    const dateStr = now.toLocaleDateString('es-ES', options);
    dateElement.textContent = dateStr.toUpperCase();
}

// ===== CLIMA =====
async function loadWeather() {
    const tempElement = document.getElementById('temperature');
    const conditionElement = document.getElementById('condition');
    const locationElement = document.getElementById('location');
    
    try {
        // Intentar obtener la ubicación del usuario
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    await fetchWeatherData(latitude, longitude);
                },
                (error) => {
                    console.log('Error obteniendo ubicación:', error);
                    // Ubicación por defecto (Barcelona)
                    fetchWeatherData(41.3851, 2.1734);
                }
            );
        } else {
            // Ubicación por defecto si no hay geolocalización (Barcelona)
            fetchWeatherData(41.3851, 2.1734);
        }
    } catch (error) {
        console.error('Error loading weather:', error);
        showWeatherError();
    }
}

async function fetchWeatherData(lat, lon) {
    const tempElement = document.getElementById('temperature');
    const conditionElement = document.getElementById('condition');
    const locationElement = document.getElementById('location');
    
    try {
        // Usar Open-Meteo API (sin necesidad de API key)
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
        const geoUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=es`;
        
        const [weatherResponse, geoResponse] = await Promise.all([
            fetch(weatherUrl),
            fetch(geoUrl)
        ]);
        
        const weatherData = await weatherResponse.json();
        const geoData = await geoResponse.json();
        
        if (weatherData.current_weather) {
            const temp = Math.round(weatherData.current_weather.temperature);
            const weatherCode = weatherData.current_weather.weathercode;
            
            tempElement.textContent = `${temp}°`;
            conditionElement.textContent = getWeatherDescription(weatherCode);
            locationElement.textContent = geoData.city || geoData.locality || 'Ubicación actual';
        }
    } catch (error) {
        console.error('Error fetching weather:', error);
        showWeatherError();
    }
}

function getWeatherDescription(code) {
    const weatherCodes = {
        0: '☀️ Despejado',
        1: '🌤️ Mayormente despejado',
        2: '⛅ Parcialmente nublado',
        3: '☁️ Nublado',
        45: '🌫️ Niebla',
        48: '🌫️ Niebla helada',
        51: '🌦️ Llovizna ligera',
        53: '🌦️ Llovizna moderada',
        55: '🌧️ Llovizna densa',
        61: '🌧️ Lluvia ligera',
        63: '🌧️ Lluvia moderada',
        65: '⛈️ Lluvia intensa',
        71: '🌨️ Nevada ligera',
        73: '🌨️ Nevada moderada',
        75: '❄️ Nevada intensa',
        77: '🌨️ Granizo',
        80: '🌦️ Chubascos ligeros',
        81: '⛈️ Chubascos moderados',
        82: '⛈️ Chubascos intensos',
        85: '🌨️ Chubascos de nieve',
        86: '❄️ Chubascos de nieve intensa',
        95: '⛈️ Tormenta',
        96: '⛈️ Tormenta con granizo',
        99: '⛈️ Tormenta intensa'
    };
    
    return weatherCodes[code] || '🌡️ Consultando...';
}

function showWeatherError() {
    document.getElementById('temperature').textContent = '--°';
    document.getElementById('condition').textContent = 'No disponible';
    document.getElementById('location').textContent = 'Sin conexión';
}

// ===== NAVEGACIÓN DE APPS =====
function openApp(url) {
    // Abrir en nueva ventana para evitar problemas de CORS
    window.open(url, '_blank', 'fullscreen=yes,location=yes,menubar=no,toolbar=yes,status=yes,scrollbars=yes,resizable=yes');
}

function openAppByKey(appKey) {
    const appUrl = APP_URLS[appKey];

    if (!appUrl) {
        console.warn(`App no configurada para la clave: ${appKey}`);
        return;
    }

    openApp(appUrl);
}

function openLocalNavigator() {
    // Abrir el navegador local integrado
    openAppByKey('localNavigator');
}

function closeApp() {
    const modal = document.getElementById('appModal');
    const iframe = document.getElementById('appFrame');
    
    // Animación de cierre
    modal.classList.remove('active');
    
    // Limpiar iframe después de la animación
    setTimeout(() => {
        iframe.src = '';
    }, 400);
    
    // Restaurar scroll
    document.body.style.overflow = 'auto';
}

// ===== PANTALLA COMPLETA =====
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error al entrar en pantalla completa: ${err.message}`);
            // Alternativa para dispositivos móviles
            if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            }
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}

// ===== INICIALIZACIÓN DEL DASHBOARD =====
function initializeDashboard() {
    // Detectar si está en un Tesla (WebKit)
    const isTesla = /Tesla/i.test(navigator.userAgent) || /WebKit/i.test(navigator.userAgent);
    
    if (isTesla) {
        console.log('🚗 Dashboard optimizado para Tesla detectado');
    }
    
    // Prevenir zoom por doble tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, { passive: false });
    
    // Prevenir zoom por gestos
    document.addEventListener('gesturestart', (event) => {
        event.preventDefault();
    });
    
    // Soporte para teclado
    document.addEventListener('keydown', (event) => {
        // ESC para cerrar modal
        if (event.key === 'Escape') {
            const modal = document.getElementById('appModal');
            if (modal.classList.contains('active')) {
                closeApp();
            }
        }
        
        // F11 para pantalla completa
        if (event.key === 'F11') {
            event.preventDefault();
            toggleFullscreen();
        }
    });
    
    // Animación de entrada para las cards
    animateCardsOnLoad();
    
    // Wake lock para evitar que la pantalla se apague
    requestWakeLock();
    
    console.log('✅ Dashboard inicializado correctamente');
}

// ===== ANIMACIONES =====
function animateCardsOnLoad() {
    const cards = document.querySelectorAll('.grid-item');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// ===== WAKE LOCK (evitar que la pantalla se apague) =====
let wakeLock = null;

async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('🔋 Wake Lock activado - La pantalla permanecerá encendida');
            
            wakeLock.addEventListener('release', () => {
                console.log('🔋 Wake Lock liberado');
            });
        }
    } catch (err) {
        console.log(`Wake Lock no soportado: ${err.message}`);
    }
}

// Reactivar wake lock cuando la página vuelve a estar visible
document.addEventListener('visibilitychange', async () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
        await requestWakeLock();
    }
});

// ===== EFECTOS VISUALES AVANZADOS =====
// Efecto parallax sutil en las cards
document.addEventListener('mousemove', (event) => {
    const cards = document.querySelectorAll('.grid-item');
    const { clientX, clientY } = event;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;
        
        const deltaX = (clientX - cardCenterX) / 50;
        const deltaY = (clientY - cardCenterY) / 50;
        
        const glow = card.querySelector('.card-glow');
        if (glow) {
            glow.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        }
    });
});

// ===== NOTIFICACIONES (Opcional) =====
function showNotification(title, message) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            body: message,
            icon: '/favicon.ico',
            badge: '/badge.png'
        });
    }
}

// Solicitar permisos de notificación
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// ===== MODO OFFLINE =====
window.addEventListener('online', () => {
    console.log('✅ Conexión restaurada');
    loadWeather();
});

window.addEventListener('offline', () => {
    console.log('❌ Sin conexión a internet');
    showWeatherError();
});

// ===== UTILIDADES =====
// Detectar orientación para ajustes opcionales
window.addEventListener('orientationchange', () => {
    console.log('📱 Orientación cambiada:', screen.orientation?.type || 'unknown');
    // Aquí se podrían hacer ajustes adicionales si es necesario
});

// Performance monitoring (opcional)
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('⚡ Tiempo de carga:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
    });
}

// ===== EXPORT PARA DEBUGGING =====
window.TeslaDashboard = {
    APP_URLS,
    openApp,
    openAppByKey,
    closeApp,
    toggleFullscreen,
    loadWeather,
    updateTime
};

console.log('🚗 Tesla Drive Hub - v1.1.1');
console.log('Usa window.TeslaDashboard para acceder a las funciones del dashboard');
