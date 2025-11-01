# 💣 Buscaminas - Angular 20

Un juego de Buscaminas moderno creado con **Angular 20** usando las nuevas características de control flow (`@if`, `@for`) y signals reactivos.

![Buscaminas Screenshot](https://via.placeholder.com/800x600/1e40af/ffffff?text=Buscaminas+Angular+20)

## 🎮 Características

### ⚡ Funcionalidades del Juego
- **Tablero 10x10** con 15 minas ocultas
- **Clic izquierdo** para revelar casillas  
- **Clic derecho** para colocar/quitar banderas 🚩
- **Revelado automático** de áreas vacías
- **Cronómetro** en tiempo real ⏱️
- **Contador de banderas** restantes
- **Estados del juego**: Jugando, Ganaste, Perdiste
- **Botón "Nuevo Juego"** para reiniciar

### 🌙 Modo Oscuro
- **Alternancia instantánea** entre modo claro y oscuro
- **Persistencia** de preferencias en localStorage
- **Detección automática** de preferencia del sistema
- **Transiciones suaves** y elegantes
- **Tema azul** personalizado para ambos modos

### 🔧 Tecnologías Modernas
- **Angular 20** - Última versión con nuevas características
- **Control Flow** - Sintaxis moderna `@if`, `@for`, `@else`
- **Signals** - Reactividad moderna de Angular
- **TypeScript** - Tipado fuerte y moderno
- **CSS3** - Estilos responsive y transiciones

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+ 
- npm 9+
- Angular CLI 20+

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/[tu-usuario]/angular-minesweeper.git
cd angular-minesweeper

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start
```

### Acceder al Juego
Abre tu navegador en `http://localhost:4200` 🌐

## 🎯 Cómo Jugar

1. **Clic izquierdo** en una casilla para revelarla
2. **Clic derecho** para colocar una bandera 🚩
3. **Los números** indican cuántas minas hay alrededor
4. **Objetivo**: Revelar todas las casillas sin minas
5. **¡Evita las minas!** 💣 o perderás

### Controles Especiales
- **🌙/☀️** - Alternar modo oscuro/claro
- **"Nuevo Juego"** - Reiniciar partida
- **Banderas** - Marcar minas sospechosas

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── app.ts          # Lógica principal del juego
│   ├── app.html        # Template con @if/@for
│   └── app.css         # Estilos del componente
├── styles.css          # Estilos globales + modo oscuro
└── main.ts            # Bootstrap de la aplicación
```

## 🎨 Características Técnicas

### Angular 20 Control Flow
```typescript
// Nuevo sintaxis condicional
@if (gameState() === 'playing') {
  <span>😊 Jugando</span>
} @else if (gameState() === 'won') {
  <span>😎 ¡Ganaste!</span>
} @else {
  <span>😵 Perdiste</span>
}

// Nuevo sintaxis de bucles
@for (row of board(); track $index) {
  @for (cell of row; track cell.row + '-' + cell.col) {
    <button (click)="onCellClick(cell)">
      {{ getCellContent(cell) }}
    </button>
  }
}
```

### Signals Reactivos
```typescript
// Estados reactivos
protected readonly gameState = signal<GameState>('playing');
protected readonly isDarkMode = signal(false);
protected readonly flagsUsed = signal(0);

// Computadas automáticas
protected readonly remainingFlags = computed(() => 
  this.MINES - this.flagsUsed()
);
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## 🌈 Temas y Colores

### Modo Claro 🌞
- **Fondo**: Gradiente azul cielo
- **Casillas**: Azul -> Azul claro al revelar
- **Texto**: Azul oscuro con buen contraste

### Modo Oscuro 🌙  
- **Fondo**: Gradiente azul profundo
- **Casillas**: Azul oscuro -> Slate al revelar
- **Texto**: Colores claros optimizados

## 📱 Responsive Design

- ✅ **Desktop** - Experiencia completa
- ✅ **Tablet** - Interfaz adaptada  
- ✅ **Mobile** - Táctil optimizado

## 🛠️ Desarrollo

### Construir el proyecto
```bash
ng build
```

### Ejecutar tests
```bash
ng test
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- **Angular Team** por las increíbles nuevas características
- **Community** por el feedback y soporte
- **GitHub Copilot** por la asistencia en desarrollo

---

⭐ **¡Dale una estrella si te gustó el proyecto!** ⭐

**Desarrollado con ❤️ usando Angular 20 y las últimas tecnologías web**
