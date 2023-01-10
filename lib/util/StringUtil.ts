export const useReplaceLnToBr = (str: string) => {
  str = str.replace(/\r/g, '')
  str = str.replace(/\n/g, '<br />')
  return str
}
