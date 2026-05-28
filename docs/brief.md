# RuedaMaestra

## Prompt maestro para Codex

Este documento contiene el prompt principal que se usará para iniciar el desarrollo de RuedaMaestra en Codex.

La idea es copiarlo en Codex cuando el repositorio esté creado y el archivo HTML actual de la ruleta esté incluido en el proyecto.

---

# Prompt maestro

````txt
Quiero que actúes como un desarrollador senior full-stack especializado en Astro, JavaScript, SEO técnico, rendimiento web y arquitectura de proyectos escalables.

Vamos a crear una web llamada RuedaMaestra.

RuedaMaestra será una plataforma educativa sobre ruleta europea centrada en simulación, análisis de estrategias, guías para principiantes, pruebas con saldo ficticio y juego responsable.

No es una web para prometer ganancias ni para promocionar juego con dinero real. El enfoque debe ser educativo, analítico y responsable.

## Objetivo principal

Convertir el prototipo actual en un proyecto Astro completo, modular, mantenible, rápido, SEO-friendly y preparado para desplegar en Cloudflare Pages.

El prototipo actual está en un único archivo HTML y contiene una ruleta europea funcional con:

- ruleta 0-36;
- colores correctos de números;
- mesa de apuestas interactiva;
- fichas de 0,1 €, 0,5 €, 1 €, 5 €, 10 €, 25 €, 50 € y 100 €;
- ficha de 1 € seleccionada por defecto;
- drag and drop sobre la mesa;
- apuestas a número, calle, seisena, docena, columna, rojo/negro, par/impar, 1-18 y 19-36;
- saldo ficticio;
- historial de números;
- botón Girar ruleta;
- botón Reapostar;
- botón Doblar;
- botón Deshacer;
- botón Limpiar apuestas;
- botón Reiniciar juego;
- posibilidad de girar sin apostar;
- responsive para escritorio;
- responsive móvil vertical con mesa en formato largo;
- responsive móvil horizontal con mesa escalada;
- interfaz en castellano de España;
- nombre de marca RuedaMaestra.

Tu primera prioridad es conservar todo el funcionamiento actual.

No elimines ninguna funcionalidad del prototipo sin explicarlo antes.

---

## Stack requerido

Usa:

- Astro;
- JavaScript moderno;
- CSS modular o archivos CSS separados;
- componentes Astro;
- sin backend en la primera versión;
- sin base de datos en la primera versión;
- preparado para Cloudflare Pages;
- preparado para SEO.

No uses Next.js en esta fase.

No uses dependencias pesadas si no son necesarias.

---

## Estructura recomendada

Crea una estructura parecida a esta:

```txt
ruedamaestra/
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── images/
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── SEOHead.astro
│   │   ├── StrategyCard.astro
│   │   ├── ResponsibleGamingNotice.astro
│   │   └── RouletteSimulator.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── ArticleLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── simulador-ruleta-europea.astro
│   │   ├── estrategias/
│   │   │   └── index.astro
│   │   ├── guias/
│   │   │   ├── como-jugar-ruleta-europea.astro
│   │   │   └── pagos-ruleta-europea.astro
│   │   ├── laboratorio-estrategias.astro
│   │   ├── juego-responsable.astro
│   │   ├── privacidad.astro
│   │   ├── cookies.astro
│   │   └── contacto.astro
│   ├── scripts/
│   │   └── roulette-simulator.js
│   └── styles/
│       ├── global.css
│       └── roulette.css
├── astro.config.mjs
├── package.json
└── README.md
````

Puedes ajustar esta estructura si tienes una razón técnica clara, pero mantén el proyecto ordenado y fácil de escalar.

---

## Páginas que debes crear en el MVP

Crea estas páginas:

1. `/`
2. `/simulador-ruleta-europea/`
3. `/estrategias/`
4. `/guias/como-jugar-ruleta-europea/`
5. `/guias/pagos-ruleta-europea/`
6. `/laboratorio-estrategias/`
7. `/juego-responsable/`
8. `/privacidad/`
9. `/cookies/`
10. `/contacto/`

---

## Página de inicio

La home debe presentar RuedaMaestra.

H1 recomendado:

```txt
Simulador de ruleta europea y laboratorio de estrategias
```

Texto principal:

```txt
Practica con una ruleta europea interactiva, prueba sistemas de apuesta con saldo ficticio y aprende a analizar el riesgo antes de jugar.
```

Botones:

* Probar simulador gratis
* Ver estrategias

Secciones:

* Qué es RuedaMaestra.
* Qué puedes hacer.
* Estrategias populares.
* Juego responsable.
* Acceso al simulador.

---

## Página del simulador

Ruta:

```txt
/simulador-ruleta-europea/
```

Debe integrar el simulador actual.

H1:

```txt
Simulador de ruleta europea gratis
```

Texto introductorio:

```txt
Usa el simulador de RuedaMaestra para practicar con una ruleta europea interactiva, colocar fichas sobre la mesa y probar distintas formas de apuesta con saldo ficticio.
```

El simulador debe conservar exactamente estas funciones:

* giro con apuesta;
* giro sin apuesta;
* saldo ficticio;
* apuestas a números;
* apuestas a calles;
* apuestas a seisenas;
* apuestas a docenas;
* apuestas a columnas;
* apuestas exteriores;
* fichas de distinto valor y color;
* drag and drop;
* reapostar;
* doblar;
* deshacer;
* limpiar apuestas;
* reiniciar juego;
* historial;
* último resultado;
* responsive móvil vertical;
* responsive móvil horizontal.

---

## Página de estrategias

Ruta:

```txt
/estrategias/
```

H1:

```txt
Estrategias de ruleta: guía para probar sistemas con saldo ficticio
```

Incluye tarjetas para:

* Martingala;
* Fibonacci;
* D’Alembert;
* Labouchere;
* Dos docenas;
* Columnas;
* Seisenas;
* 12 números.

Cada tarjeta debe mostrar:

* nombre;
* descripción breve;
* dificultad;
* nivel de riesgo;
* enlace futuro.

Texto de advertencia:

```txt
Ninguna estrategia garantiza beneficios. La ruleta europea tiene una ventaja matemática para la casa debido al cero. Usa estas guías como material educativo y de simulación.
```

---

## Guía: cómo jugar a la ruleta europea

Ruta:

```txt
/guias/como-jugar-ruleta-europea/
```

H1:

```txt
Cómo jugar a la ruleta europea
```

Debe explicar:

* qué es la ruleta europea;
* números del 0 al 36;
* colores rojo, negro y verde;
* cómo funciona una tirada;
* tipos de apuestas;
* pagos básicos;
* consejo para practicar con saldo ficticio.

---

## Guía: pagos de la ruleta europea

Ruta:

```txt
/guias/pagos-ruleta-europea/
```

H1:

```txt
Pagos de la ruleta europea
```

Incluye una tabla:

| Tipo de apuesta | Números cubiertos | Pago habitual |
| --------------- | ----------------: | ------------: |
| Pleno           |                 1 |          35:1 |
| Calle           |                 3 |          11:1 |
| Seisena         |                 6 |           5:1 |
| Docena          |                12 |           2:1 |
| Columna         |                12 |           2:1 |
| Rojo/negro      |                18 |           1:1 |
| Par/impar       |                18 |           1:1 |
| 1-18 / 19-36    |                18 |           1:1 |

Añade una nota responsable sobre la ventaja de la casa.

---

## Página laboratorio

Ruta:

```txt
/laboratorio-estrategias/
```

En esta primera versión puede ser una landing de funcionalidad futura.

Texto:

```txt
El laboratorio de estrategias permitirá simular sistemas de apuesta con banca inicial, apuesta base, número de tiradas, límite de pérdida y objetivo de beneficio.
```

Incluye una lista de funciones futuras:

* simulaciones automáticas;
* comparación de estrategias;
* gráficos de saldo;
* peor racha;
* banca recomendada;
* exportación CSV.

---

## Página juego responsable

Ruta:

```txt
/juego-responsable/
```

H1:

```txt
Juego responsable
```

Debe dejar claro:

* RuedaMaestra usa saldo ficticio;
* no permite apostar dinero real;
* la ruleta es azar;
* ninguna estrategia garantiza beneficios;
* las simulaciones no predicen resultados reales;
* no se debe apostar dinero necesario;
* las rachas negativas pueden aparecer en cualquier momento.

Texto recomendado:

```txt
RuedaMaestra es una herramienta educativa de simulación. No permite jugar con dinero real y no debe interpretarse como una forma de predecir resultados de una ruleta real.
```

---

## Páginas legales

Crea páginas básicas para:

* privacidad;
* cookies;
* contacto.

No inventes datos personales del propietario.

Usa textos genéricos con marcadores como:

```txt
[Nombre del responsable]
[Email de contacto]
[Fecha de última actualización]
```

---

## SEO técnico

Cada página debe tener:

* title único;
* meta description;
* canonical si procede;
* estructura H1/H2 correcta;
* enlaces internos;
* diseño responsive;
* buen rendimiento.

Titles recomendados:

```txt
RuedaMaestra | Simulador de Ruleta Europea y Estrategias
Simulador de Ruleta Europea Gratis | RuedaMaestra
Estrategias de Ruleta: Guía para Probar Sistemas | RuedaMaestra
Cómo Jugar a la Ruleta Europea: Guía para Principiantes | RuedaMaestra
Pagos de la Ruleta Europea: Tabla de Apuestas y Premios | RuedaMaestra
Juego Responsable y Ruleta | RuedaMaestra
```

---

## Estilo visual

Mantén un diseño:

* oscuro;
* elegante;
* moderno;
* premium;
* legible;
* sobrio;
* con estética de casino responsable, no agresivo.

Paleta base:

* verde oscuro;
* dorado;
* blanco roto;
* rojo ruleta;
* negro profundo.

Evita:

* estética de casino barato;
* exceso de neones;
* mensajes agresivos;
* promesas de ganar dinero.

---

## Footer

El footer debe incluir:

* breve descripción de RuedaMaestra;
* enlaces principales;
* enlaces legales;
* aviso de juego responsable.

Texto recomendado:

```txt
RuedaMaestra es un simulador educativo con saldo ficticio. Ninguna estrategia de ruleta garantiza beneficios reales. Juega siempre de forma responsable.
```

---

## Requisitos del simulador

La lógica de la ruleta debe cumplir:

1. No usar Math.random para el número ganador.
2. Usar Web Crypto API.
3. Usar muestreo sin sesgo.
4. Mantener ruleta europea 0-36.
5. Mantener pagos correctos.
6. Mantener colores correctos.
7. Mantener coincidencia entre número ganador y posición visual de la rueda.
8. Mantener responsive.
9. Mantener drag and drop.
10. Mantener deshacer.

---

## Comentarios de código

Añade comentarios únicamente donde ayuden a entender:

* generación aleatoria;
* cálculo de pagos;
* lógica de deshacer;
* responsive móvil;
* drag and drop.

Evita comentarios obvios.

---

## Checklist final

Antes de terminar, comprueba:

* `npm install` funciona;
* `npm run dev` funciona;
* `npm run build` funciona;
* no hay errores de consola;
* el simulador funciona;
* la ruleta gráfica coincide con el resultado;
* el drag and drop funciona;
* el botón Deshacer funciona;
* la ficha de 1 € está seleccionada por defecto;
* la versión móvil vertical es usable;
* la versión móvil horizontal es usable;
* las páginas tienen metadatos SEO;
* existe página de juego responsable;
* existe página de privacidad;
* existe página de cookies;
* existe página de contacto;
* el proyecto está preparado para Cloudflare Pages.

---

## Forma de trabajar

Trabaja por fases:

1. Crear proyecto base Astro.
2. Crear layout y estilos globales.
3. Integrar simulador conservando funcionalidad.
4. Crear páginas principales.
5. Añadir SEO básico.
6. Revisar responsive.
7. Ejecutar build.
8. Proponer mejoras futuras.

No hagas una reescritura agresiva del simulador en la primera iteración si puede romper funcionalidad.

Primero conserva. Después mejora.

````

---

# Prompt corto alternativo

Este prompt puede usarse si Codex necesita una instrucción más breve:

```txt
Convierte el prototipo HTML de RuedaMaestra en una web Astro completa y SEO-friendly.

Debe incluir home, simulador, estrategias, guías, laboratorio, juego responsable, privacidad, cookies y contacto.

Conserva todas las funciones actuales del simulador: ruleta europea 0-36, Web Crypto API, fichas, drag and drop, saldo ficticio, reapostar, doblar, deshacer, limpiar apuestas, reiniciar juego, historial y responsive móvil vertical/horizontal.

Prioridad: conservar funcionamiento, modularizar código, mejorar estructura y preparar despliegue en Cloudflare Pages.
````

---

# Prompt de revisión posterior

Usar después de que Codex genere la primera versión:

```txt
Revisa el proyecto RuedaMaestra como desarrollador senior.

Comprueba:

- errores de JavaScript;
- problemas responsive;
- accesibilidad básica;
- estructura de componentes;
- SEO técnico;
- rendimiento;
- duplicación de código;
- posibles bugs en lógica de apuestas;
- compatibilidad con Cloudflare Pages.

No cambies funcionalidades que ya funcionan salvo que sea necesario. Si detectas mejoras, propón primero y aplica solo las seguras.
```

---

# Prompt para futuras funciones premium

```txt
Propón una arquitectura para añadir en RuedaMaestra un laboratorio de estrategias premium.

Debe permitir:

- seleccionar estrategia;
- configurar banca inicial;
- configurar apuesta base;
- definir número de tiradas;
- establecer objetivo de beneficio;
- establecer límite de pérdida;
- ejecutar simulaciones automáticas;
- mostrar gráfica de saldo;
- calcular peor racha;
- calcular drawdown máximo;
- exportar CSV;
- comparar estrategias.

No implementes todavía pagos ni login. Primero diseña arquitectura y componentes.
```
