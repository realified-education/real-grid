export function useTitleCase(str: string): string {
  return str
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ')
}
