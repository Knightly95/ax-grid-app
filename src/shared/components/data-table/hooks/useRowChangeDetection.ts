import { useState, useEffect, useRef } from 'react';

const HIGHLIGHT_DURATION_MS = 3000;

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

    if (newRowIds.size > 0 || changedCellsMap.size > 0) {
      const flashTimer = setTimeout(() => {
        if (newRowIds.size > 0) setNewRows(newRowIds);
        if (changedCellsMap.size > 0) setChangedCells(changedCellsMap);
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
  }, [rows]);

  return { newRows, changedCells };
}
