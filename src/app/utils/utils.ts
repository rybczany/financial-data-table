import { MatSnackBar } from '@angular/material/snack-bar';

export function handleSnackBar(snackBar: MatSnackBar, ids: string) {
  snackBar.open(`Zamknięto zlecenie: ${ids}`, 'Ok', { duration: 5000 });
}

export function convertStringToNumber(data: string): number {
  return Number(data);
}
