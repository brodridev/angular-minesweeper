import { Component, computed, signal, effect } from '@angular/core';

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
  row: number;
  col: number;
}

type GameState = 'playing' | 'won' | 'lost';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly ROWS = 10;
  private readonly COLS = 10;
  private readonly MINES = 15;

  protected readonly gameState = signal<GameState>('playing');
  protected readonly board = signal<Cell[][]>([]);
  protected readonly flagsUsed = signal(0);
  protected readonly timeElapsed = signal(0);
  private timer: any;
  
  // Dark mode functionality
  protected readonly isDarkMode = signal(false);

  protected readonly remainingFlags = computed(() => this.MINES - this.flagsUsed());
  protected readonly revealedCells = computed(() => {
    return this.board().flat().filter(cell => cell.isRevealed).length;
  });

  constructor() {
    this.initializeGame();
    this.loadDarkModePreference();
    
    // Effect to apply dark mode to document
    effect(() => {
      if (this.isDarkMode()) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
  }

  protected initializeGame(): void {
    this.gameState.set('playing');
    this.flagsUsed.set(0);
    this.timeElapsed.set(0);
    this.stopTimer();
    this.createBoard();
    this.placeMines();
    this.calculateNeighborMines();
    this.startTimer();
  }

  private createBoard(): void {
    const newBoard: Cell[][] = [];
    for (let row = 0; row < this.ROWS; row++) {
      newBoard[row] = [];
      for (let col = 0; col < this.COLS; col++) {
        newBoard[row][col] = {
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
          row,
          col
        };
      }
    }
    this.board.set(newBoard);
  }

  private placeMines(): void {
    const board = this.board();
    let minesPlaced = 0;
    
    while (minesPlaced < this.MINES) {
      const row = Math.floor(Math.random() * this.ROWS);
      const col = Math.floor(Math.random() * this.COLS);
      
      if (!board[row][col].isMine) {
        board[row][col].isMine = true;
        minesPlaced++;
      }
    }
    this.board.set([...board]);
  }

  private calculateNeighborMines(): void {
    const board = this.board();
    for (let row = 0; row < this.ROWS; row++) {
      for (let col = 0; col < this.COLS; col++) {
        if (!board[row][col].isMine) {
          board[row][col].neighborMines = this.countNeighborMines(row, col);
        }
      }
    }
    this.board.set([...board]);
  }

  private countNeighborMines(row: number, col: number): number {
    let count = 0;
    const board = this.board();
    
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newRow = row + i;
        const newCol = col + j;
        
        if (newRow >= 0 && newRow < this.ROWS && newCol >= 0 && newCol < this.COLS) {
          if (board[newRow][newCol].isMine) {
            count++;
          }
        }
      }
    }
    return count;
  }

  protected onCellClick(cell: Cell): void {
    if (this.gameState() !== 'playing' || cell.isFlagged || cell.isRevealed) {
      return;
    }

    this.revealCell(cell);
    this.checkGameState();
  }

  protected onCellRightClick(event: MouseEvent, cell: Cell): void {
    event.preventDefault();
    
    if (this.gameState() !== 'playing' || cell.isRevealed) {
      return;
    }

    const board = this.board();
    if (cell.isFlagged) {
      board[cell.row][cell.col].isFlagged = false;
      this.flagsUsed.update(count => count - 1);
    } else if (this.flagsUsed() < this.MINES) {
      board[cell.row][cell.col].isFlagged = true;
      this.flagsUsed.update(count => count + 1);
    }
    
    this.board.set([...board]);
  }

  private revealCell(cell: Cell): void {
    const board = this.board();
    
    if (cell.isMine) {
      board[cell.row][cell.col].isRevealed = true;
      this.gameState.set('lost');
      this.stopTimer();
      this.revealAllMines();
      return;
    }

    const cellsToReveal: Cell[] = [cell];
    const visited = new Set<string>();

    while (cellsToReveal.length > 0) {
      const currentCell = cellsToReveal.pop()!;
      const key = `${currentCell.row}-${currentCell.col}`;
      
      if (visited.has(key) || currentCell.isRevealed || currentCell.isFlagged) {
        continue;
      }

      visited.add(key);
      board[currentCell.row][currentCell.col].isRevealed = true;

      if (currentCell.neighborMines === 0) {
        // Reveal neighbors for empty cells
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const newRow = currentCell.row + i;
            const newCol = currentCell.col + j;
            
            if (newRow >= 0 && newRow < this.ROWS && newCol >= 0 && newCol < this.COLS) {
              cellsToReveal.push(board[newRow][newCol]);
            }
          }
        }
      }
    }
    
    this.board.set([...board]);
  }

  private revealAllMines(): void {
    const board = this.board();
    for (let row = 0; row < this.ROWS; row++) {
      for (let col = 0; col < this.COLS; col++) {
        if (board[row][col].isMine) {
          board[row][col].isRevealed = true;
        }
      }
    }
    this.board.set([...board]);
  }

  private checkGameState(): void {
    const board = this.board();
    const totalCells = this.ROWS * this.COLS;
    const revealedCount = board.flat().filter(cell => cell.isRevealed).length;
    
    if (revealedCount === totalCells - this.MINES) {
      this.gameState.set('won');
      this.stopTimer();
    }
  }

  private startTimer(): void {
    this.timer = setInterval(() => {
      this.timeElapsed.update(time => time + 1);
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  protected getCellClass(cell: Cell): string {
    const baseClasses = 'w-8 h-8 border flex items-center justify-center text-sm font-bold cursor-pointer select-none transition-all duration-150';
    const borderClass = this.isDarkMode() ? 'border-blue-600' : 'border-blue-400';
    
    if (cell.isRevealed) {
      if (cell.isMine) {
        return `${baseClasses} ${borderClass} bg-red-500 text-white`;
      } else {
        const bgClass = this.isDarkMode() ? 'bg-slate-700 hover:bg-slate-600' : 'bg-blue-100 hover:bg-blue-200';
        return `${baseClasses} ${borderClass} ${bgClass}`;
      }
    } else if (cell.isFlagged) {
      const flagClass = this.isDarkMode() 
        ? 'bg-blue-600 text-blue-200 hover:bg-blue-700' 
        : 'bg-blue-300 text-blue-800 hover:bg-blue-400';
      return `${baseClasses} ${borderClass} ${flagClass}`;
    } else {
      const unrevealedClass = this.isDarkMode() 
        ? 'bg-blue-700 hover:bg-blue-800 text-white' 
        : 'bg-blue-500 hover:bg-blue-600 text-white';
      return `${baseClasses} ${borderClass} ${unrevealedClass}`;
    }
  }

  protected getCellContent(cell: Cell): string {
    if (cell.isFlagged) {
      return '🚩';
    }
    
    if (cell.isRevealed) {
      if (cell.isMine) {
        return '💣';
      } else if (cell.neighborMines > 0) {
        return cell.neighborMines.toString();
      }
    }
    
    return '';
  }

  protected getNumberColor(num: number): string {
    const colors = [
      '', 'text-blue-600', 'text-green-600', 'text-red-600',
      'text-purple-600', 'text-yellow-600', 'text-pink-600',
      'text-black', 'text-gray-600'
    ];
    return colors[num] || 'text-black';
  }

  protected formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  // Dark mode methods
  protected toggleDarkMode(): void {
    this.isDarkMode.set(!this.isDarkMode());
    this.saveDarkModePreference();
  }
  
  private loadDarkModePreference(): void {
    const savedPreference = localStorage.getItem('minesweeper-dark-mode');
    if (savedPreference !== null) {
      this.isDarkMode.set(savedPreference === 'true');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkMode.set(prefersDark);
    }
  }
  
  private saveDarkModePreference(): void {
    localStorage.setItem('minesweeper-dark-mode', this.isDarkMode().toString());
  }
}
