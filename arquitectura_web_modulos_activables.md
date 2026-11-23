# Manual de Arquitectura: Generador-Editor de Webs con Módulos Activables

> **Sistema Generador-Editor Visual para 5 Plantillas de Radio Online**  
> **Prestador Oficial:** Stream KSM (Rosario del Tala, Entre Ríos) · [streamksm.com.ar](https://streamksm.com.ar) · Cel: 11 6650-8379

---

## 1. Visión y Objetivo del Sistema

El sistema funcionará como un **Generador y Editor Visual de Sitios Web para Radios Online**, desacoplado de las plantillas y basado en configuración (**Config-Driven Architecture**).

### Objetivos Clave:
1. **Adopción Automática de Colores del Logo:** Al cargar el logotipo de la radio, el sistema analiza y extrae automáticamente los colores predominantes del logo e inyecta la paleta en las variables CSS nativas de la plantilla.
2. **Los 4 Módulos Oficiales Oficializados:**
   * **Módulo Feed de Facebook:** Página oficial / publicaciones de la emisora.
   * **Módulo Ventana de YouTube:** Transmisión en vivo o canal propio de YouTube.
   * **Módulo Contador de Visitas:** Oyentes en vivo de SonicPanel + contador de visitas acumuladas.
   * **Módulo de Publicidades (Hasta 4 Publicidades):** Espacios publicitarios independientes con imagen, link y control individual.
3. **Generador y Editor de 5 Plantillas Previamente Creadas:**
   * Permite previsualizar en tiempo real (*Live Preview*) la radio en cualquiera de las 5 plantillas.
   * Compilar el sitio web final sin código basura ni módulos desactivados, listo para subir al hosting.

---

## 2. Flujo del Generador-Editor Visual

```
┌────────────────────────────────────────────────────────────────────────┐
│                   INTERFAZ DEL GENERADOR - EDITOR                      │
├──────────────────────────────────┬─────────────────────────────────────┤
│      PANEL DE CONFIGURACIÓN      │         VISTA PREVIA EN VIVO        │
│                                  │             (Live Preview)          │
│ 1. Selector de Plantilla (1 a 5) │                                     │
│ 2. Carga de Logo Emisora         │  ┌───────────────────────────────┐  │
│    └─ Extractor Automático Color │  │   Plantilla seleccionada      │  │
│ 3. Configuración del Stream      │  │   con los colores del logo    │  │
│ 4. Interruptores de Módulos:     │  │   aplicados automáticamente   │  │
│    • [ON/OFF] Feed Facebook      │  │                               │  │
│    • [ON/OFF] Ventana YouTube    │  │   + Módulos seleccionados     │  │
│    • [ON/OFF] Contador Visitas   │  │   + Hasta 4 Publicidades      │  │
│    • [ON/OFF] Publicidades (1-4) │  └───────────────────────────────┘  │
│                                  │                                     │
│ 5. Botón: "COMPILAR Y EXPORTAR"  │                                     │
└──────────────────────────────────┴─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      SITIO WEB COMPILADO (DIST)                        │
│   • HTML5 semántico limpio                                             │
│   • CSS con Variables Nativas (--radio-primary, --radio-accent)        │
│   • Módulos inactivos eliminados físicamente del código                │
│   • Listo para subir al hosting del cliente                            │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Extracción y Adopción Automática de los Colores del Logo

La web debe adoptar automáticamente la identidad visual de la radio a partir de su logo.

### 3.1 Cómo opera el algoritmo de extracción:
1. El usuario sube el archivo de imagen del logo (`logo.png`, `logo.jpg` o `logo.webp`).
2. Un algoritmo de análisis cromático (mediante la API nativa de `<canvas>` en el navegador o la librería `colorthief`) recorre los píxeles de la imagen:
   * **Ignora píxeles transparentes** (canal alfa < 125).
   * **Ignora blancos puros y negros absolutos de fondo**.
   * Identifica el **Color Dominante** (que será el color primario de la emisora).
   * Identifica el **Color Secundario / Acento** (para botones de play, badges, bordes activos y detalles interactivos).
3. Esos colores se reflejan en el editor para que el operador pueda ajustarlos si lo desea y se inyectan en las **Variables Nativas de CSS** de la plantilla:

```css
:root {
  /* Colores extraídos automáticamente del Logo */
  --radio-primary: #0284c7;       /* Color dominante del logo */
  --radio-primary-hover: #0369a1; /* Variante tonal para hovers */
  --radio-accent: #f59e0b;        /* Color secundario / vivo del logo */
  --radio-accent-glow: rgba(245, 158, 11, 0.35);

  /* Fondos y textos adaptativos */
  --radio-bg-page: #0b0f19;
  --radio-bg-card: #131c2e;
  --radio-text-main: #f8fafc;
  --radio-text-muted: #94a3b8;
  --radio-border: rgba(255, 255, 255, 0.08);
}
```

### 3.2 Código JavaScript nativo para extraer colores del logo:

```javascript
// extractor-color-logo.js
export function extraerColoresDelLogo(imageElement) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = imageElement.naturalWidth || imageElement.width;
  canvas.height = imageElement.naturalHeight || imageElement.height;

  ctx.drawImage(imageElement, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  const colorCounts = {};
  let maxCount = 0;
  let dominantColor = '#0284c7'; // Fallback por defecto

  for (let i = 0; i < imageData.length; i += 16) { // Muestreo eficiente cada 4 píxeles
    const r = imageData[i];
    const g = imageData[i + 1];
    const b = imageData[i + 2];
    const a = imageData[i + 3];

    // Ignorar transparentes y casi blancos/negros
    if (a < 128) continue;
    if (r > 240 && g > 240 && b > 240) continue;
    if (r < 20 && g < 20 && b < 20) continue;

    // Agrupar tonos similares
    const rgbKey = `${Math.round(r / 10) * 10},${Math.round(g / 10) * 10},${Math.round(b / 10) * 10}`;
    colorCounts[rgbKey] = (colorCounts[rgbKey] || 0) + 1;

    if (colorCounts[rgbKey] > maxCount) {
      maxCount = colorCounts[rgbKey];
      dominantColor = `rgb(${rgbKey})`;
    }
  }

  return {
    primary: dominantColor,
    accent: calcularColorContraste(dominantColor)
  };
}

// Inyección en la plantilla
export function aplicarColoresAPlantilla(colores) {
  document.documentElement.style.setProperty('--radio-primary', colores.primary);
  document.documentElement.style.setProperty('--radio-accent', colores.accent);
}
```

---

## 4. Estructura Oficial de los 4 Módulos Activables

El archivo maestro de configuración `radio.config.json` estructura los 4 módulos oficiales:

```json
{
  "client": {
    "name": "Radio Ciudad FM",
    "dial": "FM 98.7",
    "slogan": "La radio de la ciudad",
    "city": "Rosario del Tala, Entre Ríos",
    "domain": "radiociudad987.com.ar"
  },
  "branding": {
    "logoUrl": "assets/logo.png",
    "extractedColors": {
      "primary": "#0284c7",
      "accent": "#f59e0b"
    }
  },
  "stream": {
    "url": "https://stream.streamksm.com.ar:8000/live",
    "type": "audio/aac",
    "mount": "/live",
    "sonicPanelStatsUrl": "https://sonic.streamksm.com.ar:2083/api/nowplaying"
  },
  "modules": {
    "feedFacebook": {
      "enabled": true,
      "pageUrl": "https://www.facebook.com/radiociudad987",
      "tabs": "timeline,events",
      "smallHeader": true
    },
    "ventanaYoutube": {
      "enabled": true,
      "channelUrl": "https://www.youtube.com/@radiociudad987",
      "liveEmbedUrl": "https://www.youtube.com/embed/live_stream?channel=UCxxxxxxxxxxxx",
      "tituloVentana": "Estudio en Vivo por YouTube"
    },
    "contadorVisitas": {
      "enabled": true,
      "mostrarOyentesEnVivo": true,
      "mostrarVisitasWeb": true,
      "visitasBase": 1500,
      "intervaloSegundos": 15
    },
    "sectoresPublicidad": {
      "enabled": true,
      "maxSlots": 4,
      "slots": [
        {
          "id": "publi-1",
          "nombre": "Publicidad 1 — Cabecera Superior",
          "posicion": "top_banner",
          "imagen": "assets/ads/ad1_supermercado.jpg",
          "enlace": "https://anunciante1.com",
          "alt": "Supermercado Central",
          "activo": true
        },
        {
          "id": "publi-2",
          "nombre": "Publicidad 2 — Lateral Reproductor",
          "posicion": "sidebar",
          "imagen": "assets/ads/ad2_concesionaria.jpg",
          "enlace": "https://wa.me/5491100000000",
          "alt": "Automotores Tala",
          "activo": true
        },
        {
          "id": "publi-3",
          "nombre": "Publicidad 3 — Bajo Reproductor",
          "posicion": "under_player",
          "imagen": "assets/ads/ad3_farmacia.jpg",
          "enlace": "https://anunciante3.com",
          "alt": "Farmacia Rivadavia",
          "activo": true
        },
        {
          "id": "publi-4",
          "nombre": "Publicidad 4 — Pie de Página",
          "posicion": "bottom_footer",
          "imagen": "assets/ads/ad4_ferreteria.jpg",
          "enlace": "https://anunciante4.com",
          "alt": "Ferretería Industrial",
          "activo": false
        }
      ]
    }
  }
}
```

---

## 5. Implementación en Plantillas: Los 4 Módulos

### Módulo 1: Feed de Facebook

```html
<!-- data-module="feedFacebook" -->
<section class="module-feed-facebook" data-module="feedFacebook">
  <div class="module-header">
    <h3 class="module-title">Encontranos en Facebook</h3>
  </div>
  <div class="facebook-embed-wrapper" id="fbContainer">
    <!-- El plugin oficial de Facebook SDK se inyecta de forma asíncrona -->
    <div class="fb-page" 
         data-href="" 
         data-tabs="timeline" 
         data-width="500" 
         data-small-header="true" 
         data-adapt-container-width="true" 
         data-hide-cover="false">
    </div>
  </div>
</section>
```

### Módulo 2: Ventana de YouTube

```html
<!-- data-module="ventanaYoutube" -->
<section class="module-ventana-youtube" data-module="ventanaYoutube">
  <div class="module-header">
    <h3 class="module-title">Transmisión de Video en Vivo</h3>
    <span class="badge-live-video">EN DIRECTO</span>
  </div>
  <div class="youtube-responsive-frame">
    <iframe id="ytPlayerIframe" 
            src="" 
            title="Transmisión en Vivo YouTube" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
    </iframe>
  </div>
</section>
```

### Módulo 3: Contador de Visitas

```html
<!-- data-module="contadorVisitas" -->
<div class="module-contador" data-module="contadorVisitas">
  <div class="counter-item counter-item--listeners">
    <span class="pulse-indicator"></span>
    <span class="counter-label">Oyentes Online:</span>
    <strong id="contadorOyentes" class="counter-value">0</strong>
  </div>
  <div class="counter-item counter-item--visits">
    <span class="counter-icon">👁️</span>
    <span class="counter-label">Visitas a la Web:</span>
    <strong id="contadorVisitas" class="counter-value">0</strong>
  </div>
</div>
```

### Módulo 4: Sectores de Publicidad (Hasta 4 Publicidades)

Cada una de las 4 publicidades tiene su ubicación estratégica definida en la plantilla:

```html
<!-- PUBLICIDAD 1: CABECERA (TOP BANNER) -->
<div class="ad-slot ad-slot--top" data-ad-slot="1" style="display: none;">
  <a id="ad1_link" href="#" target="_blank" rel="noopener noreferrer">
    <img id="ad1_img" src="" alt="Publicidad 1" loading="lazy">
  </a>
</div>

<!-- PUBLICIDAD 2: LATERAL (SIDEBAR) -->
<div class="ad-slot ad-slot--sidebar" data-ad-slot="2" style="display: none;">
  <a id="ad2_link" href="#" target="_blank" rel="noopener noreferrer">
    <img id="ad2_img" src="" alt="Publicidad 2" loading="lazy">
  </a>
</div>

<!-- PUBLICIDAD 3: BAJO REPRODUCTOR -->
<div class="ad-slot ad-slot--under-player" data-ad-slot="3" style="display: none;">
  <a id="ad3_link" href="#" target="_blank" rel="noopener noreferrer">
    <img id="ad3_img" src="" alt="Publicidad 3" loading="lazy">
  </a>
</div>

<!-- PUBLICIDAD 4: PIE DE PÁGINA (FOOTER BANNER) -->
<div class="ad-slot ad-slot--bottom" data-ad-slot="4" style="display: none;">
  <a id="ad4_link" href="#" target="_blank" rel="noopener noreferrer">
    <img id="ad4_img" src="" alt="Publicidad 4" loading="lazy">
  </a>
</div>
```

---

## 6. Las 5 Plantillas Previamente Creadas

Todas las 5 plantillas implementan la misma API de módulos y variables CSS, cambiando radicalmente su estilo visual:

| N° | Nombre | Concepto Estético | Disposición de los 4 Módulos |
| :--- | :--- | :--- | :--- |
| **01** | **Clásica Informativa (Noticias FM)** | Estilo periodístico, sobrio, cabecera formal, tipografía nítida de lectura. | • Publi 1 en cabecera.<br>• Reproductor superior.<br>• Publi 2 en sidebar derecho.<br>• Feeds abajo en 2 columnas.<br>• Contador en barra de estado superior. |
| **02** | **Dark Neon (Urbana & Electrónica)** | Fondo noche profundo (`#080b11`), bordes con glow del color del logo, ondas canvas reactivas al audio. | • Publi 1 y 2 integradas en cards oscuras con borde neón.<br>• YouTube centrado con efecto cine.<br>• Contador en badge flotante translúcido. |
| **03** | **Minimalista Élite (Acoustic & Vinyl)** | Ultra limpia, disco de vinilo gigante giratorio al reproducir, cero saturación. | • Publicidades discretas y elegantes.<br>• Feeds en pestañas minimalistas conmutables.<br>• Contador sutil junto a la ficha técnica del stream. |
| **04** | **Portal Magazine Multimedia** | Diario digital multimedia con noticias locales y barra de audio adhesiva inferior (*sticky player*). | • Publi 1 en top bar.<br>• Publi 2 y 3 entre noticias.<br>• Publi 4 en footer.<br>• Ventana YouTube destacada como "Estudio en Vivo". |
| **05** | **Retro Vintage (Rock & Classic Hits)** | Texturas analógicas, vúmetro retro (VU meter) con aguja analógica animada, estética rock & blues. | • Las 4 publicidades enmarcadas con estética vintage.<br>• Feeds sociales con marcos estilo afiche.<br>• Contador con dígitos tipo display digital retro. |

---

## 7. Arquitectura del Generador-Editor Visual

El generador constará de dos partes:

### 7.1 El Editor Visual (Frontend de Gestión):
* Creado en HTML/JS o React liviano.
* Panel de control donde el operador:
  1. Elige una de las 5 plantillas.
  2. Arrastra el logo de la radio -> Se ejecuta el extractor de color y se previsualiza la paleta.
  3. Ingresa la URL del stream SonicPanel / Icecast V2.
  4. Activa o desactiva con switches visuales:
     * Switch **Feed Facebook** (pide URL de página).
     * Switch **Ventana YouTube** (pide URL canal/live).
     * Switch **Contador de Visitas**.
     * Gestor de **Publicidades (1 a 4)**: cada una con botón para subir imagen, campo de URL y switch activo.
  5. **Iframe con Live Preview:** Muestra en tiempo real cómo queda la web en desktop y móvil.

### 7.2 El Compilador / Exportador (`builder.js`):
* Al hacer clic en **"Exportar Sitio Web"**:
  1. Toma la carpeta de la plantilla elegida (`/plantillas/template-02/`).
  2. Inyecta el `radio.config.json` con los datos cargados y los colores extraídos del logo.
  3. **Purga Física del Código:** Si un módulo está desactivado (`enabled: false`), el compilador elimina las etiquetas HTML y las funciones JS de ese módulo para entregar un sitio liviano y protegido.
  4. Guarda las imágenes de los banners y el logo en `/assets/`.
  5. Genera la carpeta lista para producción (`/dist/radio-cliente/`) que se sube directamente por FTP o panel al hosting.

---

## 8. Resumen de Ventajas para Stream KSM

1. **Rapidez Insuperable:** Generar una web profesional a medida toma menos de **3 minutos** usando el editor visual.
2. **Identidad Instantánea:** Cada radio queda personalizada con los colores de su propio logo sin tocar una sola línea de código CSS a mano.
3. **Escalabilidad Comercial:** El cliente puede empezar con la web básica y cuando contrate módulos posteriores (Contador, Facebook, YouTube o hasta 4 Publicidades), simplemente se abren en el editor, se activan y se exporta la actualización.
