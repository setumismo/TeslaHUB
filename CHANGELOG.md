# Changelog - Tesla Drive Hub

## [1.1.0] - 2026-02-07

### 🔧 Correcciones Críticas

#### Problema CORS Solucionado
- **Antes:** Las aplicaciones se abrían en iframes internos y recibían error "rechazó la conexión"
- **Ahora:** Las aplicaciones se abren en nuevas ventanas del navegador
- **Motivo:** Muchos sitios (Google, Spotify, WhatsApp, etc.) bloquean ser mostrados en iframes por seguridad (X-Frame-Options header)
- **Solución:** Uso de `window.open()` con parámetros de fullscreen

#### Apps Afectadas (Ahora Funcionan)
- ✅ Waze
- ✅ Google Maps  
- ✅ Spotify Web
- ✅ Telegram Web
- ✅ WhatsApp Web
- ✅ YouTube
- ✅ Google Calendar

### ✨ Nuevas Funcionalidades

#### Navegador Web Integrado 🌐
Se ha añadido un navegador web completo inspirado en BoardingGate con:

**Controles de Navegación:**
- 🔙 Botón Atrás - Navega a la página anterior en el historial
- 🔜 Botón Adelante - Navega a la página siguiente en el historial
- 🔄 Botón Recargar - Recarga la página actual
- 🏠 Botón Home - Vuelve a Google (página de inicio)

**Barra de Direcciones Inteligente:**
- Entrada de URLs completas (ej: `https://example.com`)
- Auto-completado de protocolo (si escribes `example.com` → `https://example.com`)
- Búsqueda integrada (si escribes `tesla model y` → búsqueda en Google)
- Navegación con tecla Enter

**Características:**
- Historial de navegación funcional
- Gestión de forward/back
- Sandbox con permisos adecuados
- Interfaz optimizada para pantalla táctil

**Ubicación en Dashboard:**
- Botón "Navegar" en la sección de Accesos Rápidos
- Icono de globo terráqueo

### 🌍 Cambios de Configuración

#### Ubicación por Defecto: Barcelona
- **Antes:** Madrid (40.4168, -3.7038)
- **Ahora:** Barcelona (41.3851, 2.1734)
- **Nota:** Si el navegador permite geolocalización, usará la ubicación real del usuario

### 🔒 Mejoras de Seguridad

#### Sandbox Attributes en Iframes
Los iframes ahora incluyen atributos sandbox apropiados:
```html
sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-top-navigation"
```

**Permisos habilitados:**
- `allow-same-origin` - Permite recursos del mismo origen
- `allow-scripts` - Permite ejecución de JavaScript
- `allow-popups` - Permite abrir ventanas emergentes
- `allow-forms` - Permite envío de formularios
- `allow-modals` - Permite modales (alert, confirm, etc.)
- `allow-top-navigation` - Permite navegación en el navegador integrado

**Atributos Allow en Iframes:**
- `autoplay` - Reproducción automática (Spotify, YouTube)
- `encrypted-media` - Media encriptado (DRM)
- `fullscreen` - Modo pantalla completa

### 🎨 Mejoras de UI/UX

#### Botones de Navegador
- Tamaño: 3rem × 3rem (48px × 48px)
- Bordes con glow effect en hover
- Feedback visual al hacer clic (scale 0.95)
- Colores diferenciados:
  - Controles principales: Cyan (#00ffff)
  - Botón Home: Magenta (#ff00ff)
  - Botón Go: Cyan sólido

#### Barra de Direcciones
- Altura: 3rem (48px) - Optimizado para touch
- Fondo semi-transparente
- Border glow en focus
- Placeholder: "Escribe una URL o búsqueda..."
- Font: Rajdhani para consistencia

### 📝 Cambios Técnicos

#### Estructura HTML
```html
<!-- Nuevo: Browser Modal -->
<div id="browserModal" class="app-modal">
    <div class="browser-header">
        <!-- Controles de navegación -->
        <!-- Barra de URL -->
        <!-- Botón cerrar -->
    </div>
    <iframe id="browserFrame">...</iframe>
</div>
```

#### JavaScript
Nuevas funciones añadidas:
- `openBrowser()` - Abre el navegador integrado
- `closeBrowser()` - Cierra el navegador
- `browserNavigate()` - Navega a URL o búsqueda
- `browserBack()` - Navega hacia atrás
- `browserForward()` - Navega hacia adelante
- `browserReload()` - Recarga página actual
- `browserHome()` - Va a página de inicio

Variables de estado:
- `browserHistory[]` - Array con historial de URLs
- `browserHistoryIndex` - Índice actual en el historial

#### CSS
Nuevas clases añadidas:
- `.browser-header` - Header del navegador
- `.browser-controls` - Contenedor de controles
- `.browser-btn` - Botones de navegación
- `.url-bar-container` - Contenedor de barra URL
- `.url-bar` - Input de la barra
- `.go-btn` - Botón de navegación

### 🐛 Bugs Corregidos

1. **CORS Error en todas las apps**
   - Error: `www.google.com rechazó la conexión`
   - Causa: X-Frame-Options header
   - Solución: window.open() en lugar de iframe

2. **Ubicación incorrecta en clima**
   - Error: Mostraba Madrid por defecto
   - Solución: Coordenadas cambiadas a Barcelona

3. **Apps no cargaban**
   - Error: iframes bloqueados por política CORS
   - Solución: Apertura en nueva ventana

### 📦 Archivos Modificados

```
index.html    - Añadido navegador web, actualizado botones
styles.css    - Estilos para navegador y barra URL
script.js     - Funciones navegador, cambio ubicación, window.open
```

### 🚀 Instrucciones de Actualización

#### Para GitHub Pages:
```bash
git add index.html styles.css script.js
git commit -m "v1.1.0 - Fix CORS, añade navegador web, cambia ubicación a Barcelona"
git push origin main
```

El sitio se actualizará automáticamente en 1-2 minutos.

#### Para Prueba Local:
1. Reemplaza los archivos en tu directorio local
2. Abre `index.html` en tu navegador
3. Prueba haciendo clic en cualquier app
4. Prueba el navegador web

### 🔮 Próximas Mejoras Sugeridas

- [ ] Favoritos en el navegador
- [ ] Modo incógnito
- [ ] Historial persistente
- [ ] Tabs múltiples
- [ ] Zoom controls
- [ ] Download manager
- [ ] Integración con voice commands

### 📄 Licencia

Continúa bajo MIT License con disclaimer de seguridad.

### 🙏 Créditos

- Inspiración navegador: [BoardingGate](https://boardinggate.github.io/Tesla/tesla.html)
- API Clima: [Open-Meteo](https://open-meteo.com)

---

**Versión:** 1.1.0  
**Fecha:** 7 de febrero de 2026  
**Autor:** Tesla Drive Hub Contributors
