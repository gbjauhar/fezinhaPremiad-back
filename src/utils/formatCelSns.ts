export function formatCelSns(cel: string) {
  const formatedCel = cel.replace(/\D/g, '');

  if (cel.includes('+55')) {
    return '+55' + formatedCel.replace('55', '');
  }

  return '+55' + formatedCel;
}
