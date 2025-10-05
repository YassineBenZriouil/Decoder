export type CipherType = 'shifter' | 'caesar' | 'reverse' | 'rot13' | 'atbash';

export const cipherDescriptions: Record<CipherType, string> = {
  shifter: "Takes the last 2 letters of each word and moves them to the front",
  caesar: "Shifts each letter by 3 positions in the alphabet",
  reverse: "Reverses the entire text",
  rot13: "Rotates each letter by 13 positions (A↔N, B↔O, etc.)",
  atbash: "Reverses the alphabet (A↔Z, B↔Y, etc.)"
};

export const encode = (text: string, cipher: CipherType): string => {
  if (!text) return '';
  
  switch (cipher) {
    case 'shifter':
      return text.split(' ').map(word => {
        if (word.length <= 2) return word;
        const last2 = word.slice(-2);
        const rest = word.slice(0, -2);
        return last2 + rest;
      }).join(' ');
      
    case 'caesar':
      return text.split('').map(char => {
        if (char.match(/[a-z]/i)) {
          const code = char.charCodeAt(0);
          const isUpperCase = code >= 65 && code <= 90;
          const base = isUpperCase ? 65 : 97;
          return String.fromCharCode(((code - base + 3) % 26) + base);
        }
        return char;
      }).join('');
      
    case 'reverse':
      return text.split('').reverse().join('');
      
    case 'rot13':
      return text.split('').map(char => {
        if (char.match(/[a-z]/i)) {
          const code = char.charCodeAt(0);
          const isUpperCase = code >= 65 && code <= 90;
          const base = isUpperCase ? 65 : 97;
          return String.fromCharCode(((code - base + 13) % 26) + base);
        }
        return char;
      }).join('');
      
    case 'atbash':
      return text.split('').map(char => {
        if (char.match(/[a-z]/i)) {
          const code = char.charCodeAt(0);
          const isUpperCase = code >= 65 && code <= 90;
          const base = isUpperCase ? 65 : 97;
          return String.fromCharCode(base + (25 - (code - base)));
        }
        return char;
      }).join('');
      
    default:
      return text;
  }
};

export const decode = (text: string, cipher: CipherType): string => {
  if (!text) return '';
  
  switch (cipher) {
    case 'shifter':
      return text.split(' ').map(word => {
        if (word.length <= 2) return word;
        const first2 = word.slice(0, 2);
        const rest = word.slice(2);
        return rest + first2;
      }).join(' ');
      
    case 'caesar':
      return text.split('').map(char => {
        if (char.match(/[a-z]/i)) {
          const code = char.charCodeAt(0);
          const isUpperCase = code >= 65 && code <= 90;
          const base = isUpperCase ? 65 : 97;
          return String.fromCharCode(((code - base - 3 + 26) % 26) + base);
        }
        return char;
      }).join('');
      
    case 'reverse':
    case 'rot13':
    case 'atbash':
      return encode(text, cipher);
      
    default:
      return text;
  }
};
