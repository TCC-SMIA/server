export function hasOnlyNumbers(text: string): boolean {
  return !!text.match(/^[0-9]+$/);
}

export function hasNumbers(text: string): boolean {
  const regex = /\d/;
  return regex.test(text);
}

export function hasOnlyLetters(text: string): boolean {
  return !!text.match(/^[a-zA-Z\u00C0-\u00ff]+$/);
}

export function hasSpecialCharacter(text: string): boolean {
  const regex = /[@!#$%^&*]/;
  return regex.test(text);
}

export function hasIsolatedLetters(text: string): boolean {
  const name = text.split(' ').find(char => char.length === 1) || false;
  return !!name;
}

export function removeSpaces(text: string): string {
  return text.replace(/[\s]/g, '');
}
