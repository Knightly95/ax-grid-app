import { useState, useEffect, useRef } from 'react';

const HIGHLIGHT_DURATION_MS = 3000;
const MAX_NEW_ROWS_TO_FLASH = 1;

interface UseRowChangeDetectionReturn {
  newRows: Set<string | number>;
  changedCells: Map<string | number, Set<string>>;
}

export function useRowChangeDetection<T extends { id: string | number }>(
  rows: T[],
): UseRowChangeDetectionReturn {
  const [newRows, setNewRows] = useState<Set<string | number>>(() => new Set());
  const [changedCells, setChangedCells] = useState<Map<string | number, Set<string>>>(
    () => new Map(),
  );
  const prevRowsRef = useRef<Map<string | number, T>>(new Map());
  const isFirstRender = useRef(true);

  useEffect(() => {
    const newRowIds = new Set<string | number>();
    const changedCellsMap = new Map<string | number, Set<string>>();

    rows.forEach((row) => {
      const rowId = row.id;
      const prevRow = prevRowsRef.current.get(rowId);

      if (!prevRow) {
        newRowIds.add(rowId);
      } else {
        const changedFields = new Set<string>();
        Object.keys(row).forEach((key) => {
          if (JSON.stringify(row[key as keyof T]) !== JSON.stringify(prevRow[key as keyof T])) {
            changedFields.add(key);
          }
        });
        if (changedFields.size > 0) {
          changedCellsMap.set(rowId, changedFields);
        }
      }
    });

    const newRowsMap = new Map<string | number, T>();
    rows.forEach((row) => newRowsMap.set(row.id, row));
    prevRowsRef.current = newRowsMap;

    const shouldFlashNewRows =
      !isFirstRender.current && newRowIds.size > 0 && newRowIds.size <= MAX_NEW_ROWS_TO_FLASH;
    const shouldFlashChangedCells = !isFirstRender.current && changedCellsMap.size > 0;

    if (shouldFlashNewRows || shouldFlashChangedCells) {
      const flashTimer = setTimeout(() => {
        if (shouldFlashNewRows) setNewRows(newRowIds);
        if (shouldFlashChangedCells) setChangedCells(changedCellsMap);
      }, 0);

      const clearTimer = setTimeout(() => {
        setNewRows(new Set());
        setChangedCells(new Map());
      }, HIGHLIGHT_DURATION_MS);

      return () => {
        clearTimeout(flashTimer);
        clearTimeout(clearTimer);
      };
    }

    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
  }, [rows]);

  return { newRows, changedCells };
}
