const numberFormatter = new Intl.NumberFormat('fr-FR');

export function formatNumber(value: number): string {
  return numberFormatter.format(value).replace(/\u202f|\u00a0/g, ' ');
}

export function pad2(value: number): string {
  return value.toString().padStart(2, '0');
}
