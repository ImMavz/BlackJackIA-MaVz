# 🃏 Blackjack con IA

Bienvenido a **Blackjack con IA**, un juego interactivo implementado en **React + TailwindCSS + Framer Motion**, con una lógica de inteligencia artificial que simula al crupier (dealer) como en un casino real.

---

## 🤖 ¿Dónde está la "IA"?

La inteligencia artificial del juego está implementada en el archivo [`blackjack-game.tsx`](./blackjack-game.tsx), dentro de la función `dealerPlay`.

El dealer (IA):
- Sigue las reglas oficiales del Blackjack: **saca cartas hasta alcanzar al menos 17 puntos**.
- Evalúa su mano y la del jugador para determinar el ganador.
- Simula turnos con `setTimeout` y `await` para parecer humano.
- Gestiona los resultados con lógica basada en el valor de las manos.

---

## 🚀 Tecnologías utilizadas

| Tecnología       | Uso principal                              |
|------------------|---------------------------------------------|
| **React**        | Interfaz y lógica de juego                  |
| **Tailwind CSS** | Estilización, temas claro/oscuro            |
| **Framer Motion**| Animaciones suaves para cartas y fichas     |
| **TypeScript**   | Tipado fuerte y organización del código     |

---

## 📦 Componentes principales

### 🎮 `blackjack-game.tsx`
Contiene toda la lógica del juego:
- Generación del mazo
- Control del turno del jugador y del dealer (IA)
- Control de estados: menú, reglas, partida
- Evaluación de ganador
- Animaciones de cartas y flujo de juego

### 🎲 `FichasApuestas.tsx`
Permite al jugador seleccionar montos de apuesta mediante fichas de diferentes valores y colores.

### 🪙 `AnimatedBetChip.tsx`
Muestra una ficha animada que:
- Vuela al centro cuando apuestas.
- Regresa al jugador si ganas.
- Desaparece si pierdes.

### 💰 `PlayerChips.tsx`
Visualiza las fichas del jugador de forma apilada, reflejando su saldo actual.

### 🌗 `ThemeToggle.tsx`
Permite cambiar entre tema claro y oscuro con persistencia en `localStorage`.

---

## 🧠 Lógica de Blackjack

- Se reparte una mano inicial a jugador y dealer.
- El jugador puede pedir cartas (`hit`) o plantarse (`stand`).
- El dealer (IA) toma su turno automáticamente:
  - Si tiene menos de 17, sigue sacando.
  - Compara la mano con la del jugador.
  - Declara un ganador.

Las cartas se animan y las fichas se mueven para mejorar la experiencia visual.

---

## 🛠 Instalación local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/blackjack-ia.git
   cd blackjack-ia
   ```

2. Instala dependencias:
   ```bash
   npm install
   ```

3. Corre el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abre en tu navegador:  
   [http://localhost:3000](http://localhost:3000)

---

## 🌈 Funcionalidades destacadas

- ✅ IA que simula el comportamiento del dealer
- ✅ Animaciones suaves con `Framer Motion`
- ✅ Tema claro/oscuro con `ThemeToggle`
- ✅ Sistema de apuestas con fichas visuales
- ✅ Feedback visual (ganaste, perdiste, empate)
- ✅ Componente modularizado y escalable

---

## 🗂 Estructura del proyecto (simplificada)

```
src/
├── components/
│   ├── AnimatedBetChip.tsx
│   ├── FichasApuestas.tsx
│   ├── PlayerChips.tsx
│   └── ThemeToggle.tsx
├── app/
│   └── blackjack-game.tsx
├── styles/
│   └── globals.css
```

---

## 📌 Pendientes / Futuras mejoras

- [ ] Historial de partidas (ganadas/perdidas)
- [ ] Sistema de múltiples jugadores o ranking
- [ ] Sonidos al ganar/perder o al repartir cartas
- [ ] Integración backend con guardado de progreso


## 🙌 Autor

Desarrollado por **Joseph Herrera**  
