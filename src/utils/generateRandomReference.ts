export function generateRandomReference() {
  let numeros = '';

  for (let i = 0; i < 6; i++) {
    const numeroAleatorio = Math.floor(Math.random() * 10);
    numeros += numeroAleatorio.toString();
  }

  return numeros;
}
