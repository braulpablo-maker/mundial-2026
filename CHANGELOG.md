# Historial de Cambios (Changelog) — Mundial 2026

Registro cronológico de todas las tareas, correcciones e implementaciones realizadas en el proyecto siguiendo el Protocolo de Flujo de Trabajo Estándar.

---

## [20-JUNIO-2026]

### Rediseño de UI, Banderas y Tema Azul (`feat`)
* **Objetivo:** Se reemplazó el tema oscuro original por un tema claro con tarjetas blancas y fondos gris claro. Se implementó la API de flagcdn para renderizar las banderas reales de los 48 países (ISO 3166-1 alpha-2) en lugar de depender de los emojis nativos que no se veían en todos los sistemas operativos. El color de acento se modificó de verde a azul oscuro a pedido del usuario.
* **Estado:** Completado, verificado en QA y desplegado en producción.

---

## [15-JUNIO-2026]

### 3. Fecha de Hoy al Abrir la App (`fix`)
* **Objetivo:** Al iniciar la app, la pestaña "Grupos" ahora selecciona automáticamente el día de hoy en el calendario del torneo (en vez de mostrar siempre el 11 de Junio). Si la fecha actual no está dentro del calendario del torneo, cae al primer día como fallback.
* **Estado:** Completado, verificado en QA y desplegado en producción.

---

## [12-JUNIO-2026]

### 1. Fases Eliminatorias del Mundial 2026 (`feat`)
* **Objetivo:** Implementar los 32 partidos eliminatorios (Dieciséisavos, Octavos, Cuartos, Semifinal, 3°/4° puesto y Final), lógica de emparejamientos automáticos y mejores terceros, y añadir la pestaña "Eliminatorias" en la interfaz.
* **Estado:** Completado, verificado en QA y desplegado en producción.

### 2. Reinicio de Resultados Vacíos (`feat`)
* **Objetivo:** Resolver el problema de no poder volver a dejar un partido sin goles ("-:-"). Al presionar menos (-) en un marcador de 0, el valor se limpia y marca el partido como "No jugado" (vacío), actualizando automáticamente las tablas y brackets. Si el marcador está vacío y se presiona (+), inicia en 0.
* **Estado:** Completado, verificado en QA y desplegado en producción.
