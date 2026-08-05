import { BingoLetter, Cell, GamePattern, WinResult, WinningLineDetail } from '../types';

export const BINGO_LETTERS: BingoLetter[] = ['B', 'I', 'N', 'G', 'O'];

export const COLUMN_RANGES: Record<BingoLetter, { min: number; max: number }> = {
  B: { min: 1, max: 5 },
  I: { min: 6, max: 10 },
  N: { min: 11, max: 15 },
  G: { min: 16, max: 20 },
  O: { min: 21, max: 25 },
};

export const BINGO_LETTER_COLORS: Record<BingoLetter, { bg: string; text: string; border: string; highlight: string }> = {
  B: { bg: 'bg-rose-500', text: 'text-rose-500', border: 'border-rose-400', highlight: 'from-rose-500 to-pink-600' },
  I: { bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-400', highlight: 'from-amber-500 to-orange-600' },
  N: { bg: 'bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-400', highlight: 'from-emerald-500 to-teal-600' },
  G: { bg: 'bg-sky-500', text: 'text-sky-500', border: 'border-sky-400', highlight: 'from-sky-500 to-blue-600' },
  O: { bg: 'bg-purple-500', text: 'text-purple-500', border: 'border-purple-400', highlight: 'from-purple-500 to-indigo-600' },
};

export function getLetterForNumber(num: number): BingoLetter {
  if (num <= 5) return 'B';
  if (num <= 10) return 'I';
  if (num <= 15) return 'N';
  if (num <= 20) return 'G';
  return 'O';
}

function getRandomNumbersInRange(min: number, max: number, count: number): number[] {
  const nums: number[] = [];
  for (let i = min; i <= max; i++) {
    nums.push(i);
  }
  // Fisher-Yates shuffle
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  return nums.slice(0, count);
}

/**
 * Generates a standard 5x5 BingoBlitz Card where each column has numbers from its respective range (1-5 for B, 6-10 for I, etc.) shuffled vertically.
 */
export function generateBingoCard(): Cell[][] {
  const columnNumbers: Record<BingoLetter, number[]> = {
    B: getRandomNumbersInRange(1, 5, 5),
    I: getRandomNumbersInRange(6, 10, 5),
    N: getRandomNumbersInRange(11, 15, 5),
    G: getRandomNumbersInRange(16, 20, 5),
    O: getRandomNumbersInRange(21, 25, 5),
  };

  const grid: Cell[][] = Array.from({ length: 5 }, () => Array(5));

  for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
    for (let colIndex = 0; colIndex < 5; colIndex++) {
      const letter = BINGO_LETTERS[colIndex];
      const number = columnNumbers[letter][rowIndex];

      grid[rowIndex][colIndex] = {
        id: `cell-r${rowIndex}-c${colIndex}`,
        number,
        letter,
        row: rowIndex,
        col: colIndex,
        isMarked: false,
        isFree: false,
      };
    }
  }

  return grid;
}

/**
 * Checks for winning patterns on the card (Row, Column, or Diagonal)
 */
export function checkWinPattern(grid: Cell[][], _pattern: GamePattern = 'line'): WinResult {
  const winningCellIds = new Set<string>();
  const winningLines: string[] = [];
  const winningLineDetails: WinningLineDetail[] = [];

  const isCellMarked = (r: number, c: number): boolean => {
    const cell = grid[r]?.[c];
    return cell ? cell.isMarked : false;
  };

  // 1. Check Rows
  for (let r = 0; r < 5; r++) {
    if ([0, 1, 2, 3, 4].every((c) => isCellMarked(r, c))) {
      winningLines.push(`Row ${r + 1}`);
      winningLineDetails.push({ type: 'row', index: r, label: `Row ${r + 1}` });
      for (let c = 0; c < 5; c++) {
        winningCellIds.add(grid[r][c].id);
      }
    }
  }

  // 2. Check Columns
  for (let c = 0; c < 5; c++) {
    if ([0, 1, 2, 3, 4].every((r) => isCellMarked(r, c))) {
      winningLines.push(`Column ${BINGO_LETTERS[c]}`);
      winningLineDetails.push({ type: 'col', index: c, label: `Column ${BINGO_LETTERS[c]}` });
      for (let r = 0; r < 5; r++) {
        winningCellIds.add(grid[r][c].id);
      }
    }
  }

  // 3. Main Diagonal (TL to BR)
  if ([0, 1, 2, 3, 4].every((i) => isCellMarked(i, i))) {
    winningLines.push('Diagonal (Top-Left to Bottom-Right)');
    winningLineDetails.push({ type: 'diag-main', index: 0, label: 'Diagonal ↘' });
    for (let i = 0; i < 5; i++) {
      winningCellIds.add(grid[i][i].id);
    }
  }

  // 4. Anti Diagonal (TR to BL)
  if ([0, 1, 2, 3, 4].every((i) => isCellMarked(i, 4 - i))) {
    winningLines.push('Diagonal (Top-Right to Bottom-Left)');
    winningLineDetails.push({ type: 'diag-anti', index: 1, label: 'Diagonal ↙' });
    for (let i = 0; i < 5; i++) {
      winningCellIds.add(grid[i][4 - i].id);
    }
  }

  return {
    isWin: winningLines.length >= 5,
    winningCellIds,
    winningLines,
    winningLineDetails,
  };
}

