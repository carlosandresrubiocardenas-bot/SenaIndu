# Sincronización Automática y Persistente en Google Sheets (SENA Inducción)

Automatización completa del flujo de datos entre el prototipo de inducción SENA y la hoja de cálculo en Google Drive, eliminando cualquier intervención manual repetitiva y ejecutando el guardado en segundo plano en tiempo real con notificaciones sutiles y no intrusivas.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Decisiones confirmadas por el usuario:**
> - **Momento de sincronización:** En tiempo real al avanzar en los módulos temáticos y automáticamente al culminar y aprobar la evaluación final.
> - **Estilo de notificación:** Guardado silencioso en segundo plano acompañado de un aviso flotante (toast) sutil y no intrusivo, sin ventanas modales que bloqueen la interacción del aprendiz.

- **Conexión inicial (Onboarding 1-Clic):** La autorización de Google OAuth solo se solicitará una única vez al ingresar o activar la cuenta. A partir de ese momento, la sesión se mantiene persistente en el navegador y todas las actualizaciones futuras se transmiten de forma totalmente transparente e inadvertida para el usuario.
- **Resiliencia sin conexión (Cola local):** Si se presenta intermitencia en la red o expiración momentánea del token, los avances se almacenan en cola local cifrada en el navegador y se sincronizan automáticamente con Google Drive en cuanto se restablezca la conexión.

---

## 1. Overview & Core Concept

- **Qué hace:** Transforma el mecanismo manual de sincronización en un motor de sincronización automática continuo en segundo plano (*Background Auto-Sync Engine*). Cada vez que el aprendiz completa una sección de inducción, responde preguntas del simulador interactivo o aprueba la evaluación con generación de certificado, el sistema actualiza de inmediato su fila correspondiente en Google Sheets sin requerir confirmaciones manuales ni aperturas de menús.
- **Audiencia objetivo:** Aprendices SENA, instructores y líderes de bienestar y coordinación académica que necesitan un consolidado fidedigno, en vivo y sin esfuerzo humano de todos los estudiantes que cursan la inducción oficial bajo el Acuerdo No. 0009 de 2024.
- **Valor clave:** Cero fricción operativa. El aprendiz se enfoca al 100% en su aprendizaje, mientras que la coordinación institucional recibe los registros actualizados en su Google Drive institucional de manera instantánea.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Flujo de Conexión Automática (Sesión Activa):**
   - Al cargar la aplicación, el servicio detecta la sesión guardada de Google mediante Firebase Auth.
   - De forma silenciosa y en milisegundos, localiza o inicializa la hoja oficial `"SENA - Registro de Inducción de Aprendices"`.
   - Si no hay sesión previa, una tarjeta discreta en el encabezado de bienvenida ofrece `"Vincular Google Drive en 1 clic"` con el botón oficial de Google.

2. **Flujo de Guardado en Tiempo Real (Módulos & Progreso):**
   - El aprendiz navega los módulos (Reglamento del Aprendiz, Derechos, Deberes, Faltas, Medidas Formativas, Bienestar).
   - Al marcar un tema como comprendido o avanzar de porcentaje, el motor ejecuta un guardado automático con *debounce* (espera de 1.5s para agrupar cambios).
   - En la esquina inferior derecha aparece un toast compacto y elegante:
     - Estado sincronizando: Ícono giratorio sutil + texto `"Guardando avance en Google Sheets..."`
     - Estado completado: Ícono verde SENA + texto `"✓ Avance del 60% sincronizado en tu Drive"`
   - El toast desaparece suavemente tras 3 segundos sin bloquear clics ni navegación.

3. **Flujo de Culminación & Certificación Oficial:**
   - El aprendiz supera la evaluación con nota $\ge 3.5/5.0$.
   - El sistema calcula el hash criptográfico del certificado oficial y sincroniza de inmediato la fila en la hoja de cálculo, cambiando el estado a `"CERTIFICADO APROBADO"` junto con la nota final, fecha/hora y hash de validación.
   - Toast destacado: `"✓ Certificado oficial e inducción registrados exitosamente en Google Sheets"`.

### Visual Identity & Theme

- **Aesthetic Direction:** Estilo institucional SENA contemporáneo, limpio, técnico y de alta legibilidad, combinando el Verde Oficial SENA (`#39A900`), acentos esmeralda y pizarras profundas.
- **Color Palette & Contrast (Regla 60-30-10):**
  - **60% Lienzo:** Blanco puro (`#FFFFFF`) en modo claro / Pizarra profunda (`#0F172A`) en modo oscuro.
  - **30% Superficies Estructurales:** Tarjetas limpias con bordes finos de 1px (`#E2E8F0` / `#1E293B`) y fondo suave (`#F8FAFC` / `#1E293B/50`).
  - **10% Acentos Funcionales:** Verde SENA (`#39A900` / `#22C55E`) para confirmación de guardado, botones principales y estados de aprobación.
- **Tipografía:**
  - Títulos y encabezados: `Plus Jakarta Sans` en pesos Bold y SemiBold.
  - Cuerpo de texto y explicaciones: `DM Sans` con altura de línea relajada.
  - Datos numéricos, fichas, notas y hashes: `font-mono tabular-nums` para perfecta alineación.
- **Componente Toast de Notificación Flotante:**
  - Ubicación: `fixed bottom-5 right-5 z-50`.
  - Dimensiones: Altura compacta, bordes redondeados (`rounded-2xl`), sombra sutil (`shadow-lg shadow-black/5`).
  - Sin modales intrusivos de bloqueo.

---

## 3. Key Product Decisions & Trade-Offs

- **Decisión 1: Sincronización en segundo plano con Debounce inteligente**
  - *Enfoque elegido:* Cada vez que cambia el estado relevante del aprendiz (progreso, nota, certificación), se encola la actualización y se envía tras un retraso de 1.5 segundos para evitar peticiones repetitivas innecesarias a la API de Google Sheets si el aprendiz hace múltiples clics rápidos.
  - *Por qué:* Respeta las cuotas de la API de Google Sheets (máximo 60 peticiones/minuto por usuario) y garantiza fluidez total en la interfaz sin retrasos ni parpadeos.
  - *Alternativas descartadas:* Sincronización en cada evento de clic (saturaría la API de Google) o sincronización solo manual (que es justamente lo que el usuario pidió eliminar).

- **Decisión 2: Supresión de la ventana de confirmación repetitiva**
  - *Enfoque elegido:* Se elimina la obligatoriedad de abrir el modal y hacer clic en "Confirmar sobreescritura" en cada guardado. El usuario ya otorgó su aprobación explícita inicial y desea automatización integral.
  - *Por qué:* Cumple con la solicitud exacta: *"sin yo tener que tocar el prototipo y hacer la configuración continuamente"*.
  - *Alternativas descartadas:* Mantener el diálogo modal de confirmación en cada acción (bloquea la experiencia del estudiante).

- **Decisión 3: Modal existente reconvertido en Panel de Inspección y Auditoría**
  - *Enfoque elegido:* El botón "Google Sheets" en la barra de navegación se mantiene, pero ahora actúa como un centro de control opcional donde se puede ver el enlace directo a la hoja, copiar la URL en un clic, inspeccionar la tabla en vivo de todos los aprendices y consultar el historial, sin ser un requisito para que la sincronización ocurra.
  - *Por qué:* Permite al instructor verificar la información cuando lo desee sin obligar al aprendiz a usarlo.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PROTOTIPO INDUCCIÓN SENA                        │
│                                                                        │
│   ┌─────────────────────┐   ┌──────────────────────────────────────┐   │
│   │ Módulos Temáticos   │   │ Simulador & Evaluación de Inducción │   │
│   │ (Progreso 0 - 100%) │   │ (Calificación 1.0 - 5.0 & Certif.)   │   │
│   └──────────┬──────────┘   └──────────────────┬───────────────────┘   │
│              │                                 │                       │
│              ▼                                 ▼                       │
│     ┌──────────────────────────────────────────────────────────┐       │
│     │            useAutoSyncApprentice Hook / Listener         │       │
│     │  (Detecta cambios en progreso, respuestas y certificado) │       │
│     └────────────────────────────┬─────────────────────────────┘       │
│                                  │                                     │
│                                  ▼                                     │
│     ┌──────────────────────────────────────────────────────────┐       │
│     │                AutoSyncManager (Debounce 1.5s)           │       │
│     │  - Revisa token OAuth en memoria                         │       │
│     │  - Maneja cola de respaldo offline en localStorage       │       │
│     └──────────────┬────────────────────────────┬──────────────┘       │
└────────────────────┼────────────────────────────┼──────────────────────┘
                     │                            │
                     ▼                            ▼
      ┌──────────────────────────────┐   ┌──────────────────────────────┐
      │   Floating AutoSync Toast    │   │      Google Sheets API       │
      │   "Guardando en Drive..."    │   │  (Spreadsheet Oficial SENA)  │
      │   "✓ Datos actualizados"     │   │  - Hoja: Aprendices Inducc.  │
      └──────────────────────────────┘   │  - Fila: Upsert (Inserta/Act)│
                                         └──────────────────────────────┘
```

### Data Model & Record Schema

El motor actualiza la fila del aprendiz identificado unívocamente por su clave compuesta: `APP-{Documento}-{Ficha}`:

| Columna | Campo | Tipo | Fuente en el Prototipo |
| :--- | :--- | :--- | :--- |
| **A** | ID Registro | `string` | `APP-${apprentice.documentNumber}-${apprentice.fichaNumber}` |
| **B** | Fecha / Hora | `datetime` | Marca de tiempo oficial de Colombia (UTC-5) |
| **C** | Tipo Documento | `string` | CC, TI, CE, etc. |
| **D** | Número Documento | `string` | Documento del aprendiz |
| **E** | Nombre del Aprendiz| `string` | Nombre completo registrado |
| **F** | Programa Formativo| `string` | Nombre del programa de formación técnica/tecnológica |
| **G** | Ficha | `string` | Código de ficha asignada |
| **H** | Regional | `string` | Regional SENA |
| **I** | Centro de Formación| `string` | Centro formativo |
| **J** | Nivel Formativo | `string` | Tecnólogo, Técnico, etc. |
| **K** | Progreso Inducción | `percentage`| `0%` a `100%` en tiempo real |
| **L** | Calificación | `decimal` | `1.0` a `5.0` según las respuestas del test |
| **M** | Estado Certificado | `string` | `CERTIFICADO APROBADO` o `EN PROCESO DE INDUCCIÓN` |
| **N** | Hash Verificación | `string` | Hash alfanumérico único del certificado emitido |
| **O** | Reglamento Vigente | `string` | `Acuerdo No. 0009 de 2024 (Vigente)` |

### Interactive Component & State Mapping

1. **`useAutoSync` Custom Hook:**
   - Monitorea el estado reactivo `apprentice`, `progressPercent`, `score`, e `isCertified`.
   - Llama a `syncApprenticeToSheet` cuando cambian estos valores de manera automática.
   - Emite estados de sincronización: `'idle' | 'syncing' | 'saved' | 'offline_queued' | 'error'`.

2. **`AutoSyncToast` Component:**
   - Notificación flotante con transiciones suaves en la esquina inferior derecha.
   - Muestra el estado del guardado con indicador visual y mensaje claro.
   - Permite al usuario hacer clic para abrir directamente la hoja en una nueva pestaña si desea auditar el resultado en ese momento.

3. **`AutoSyncStatusIndicator` en la barra superior:**
   - Un discreto texto en la barra superior con el estado de sincronización:
     - Conectado: Ícono verde con `"Google Drive: Sincronización en vivo"`.
     - Desconectado: `"Google Drive: Sin conectar (clic para activar)"`.

4. **Persistencia y Resiliencia:**
   - La información del identificador de la hoja se almacena en `localStorage` (`'sena_induction_spreadsheet'`).
   - El token de acceso y la sesión se refrescan automáticamente mediante Firebase Auth.
