export type CipherType = 'shifter' | 'caesar' | 'reverse' | 'rot13' | 'atbash' | string;

export interface CustomCipher {
  name: string;
  description: string;
  pattern: Map<string, string>;
  reversePattern: Map<string, string>;
}

export const cipherDescriptions: Record<string, string> = {
  shifter: "Takes the last 2 letters of each word and moves them to the front",
  caesar: "Shifts each letter by 3 positions in the alphabet",
  reverse: "Reverses the entire text",
  rot13: "Rotates each letter by 13 positions (A↔N, B↔O, etc.)",
  atbash: "Reverses the alphabet (A↔Z, B↔Y, etc.)"
};

// Learn pattern from example
export const learnCipherFromExample = (original: string, encoded: string): CustomCipher | null => {
  if (original.length !== encoded.length) return null;
  
  const pattern = new Map<string, string>();
  const reversePattern = new Map<string, string>();
  
  for (let i = 0; i < original.length; i++) {
    const origChar = original[i].toLowerCase();
    const encChar = encoded[i].toLowerCase();
    
    if (pattern.has(origChar) && pattern.get(origChar) !== encChar) {
      return null; // Inconsistent pattern
    }
    
    pattern.set(origChar, encChar);
    reversePattern.set(encChar, origChar);
  }
  
  return {
    name: 'custom',
    description: 'Custom learned cipher',
    pattern,
    reversePattern
  };
};

export const encode = (text: string, cipher: CipherType, customCipher?: CustomCipher): string => {
  if (!text) return '';
  
  // Handle custom cipher
  if (customCipher) {
    return text.split('').map(char => {
      const lowerChar = char.toLowerCase();
      if (customCipher.pattern.has(lowerChar)) {
        const encoded = customCipher.pattern.get(lowerChar)!;
        return char === char.toUpperCase() ? encoded.toUpperCase() : encoded;
      }
      return char;
    }).join('');
  }
  
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

export const decode = (text: string, cipher: CipherType, customCipher?: CustomCipher): string => {
  if (!text) return '';
  
  // Handle custom cipher
  if (customCipher) {
    return text.split('').map(char => {
      const lowerChar = char.toLowerCase();
      if (customCipher.reversePattern.has(lowerChar)) {
        const decoded = customCipher.reversePattern.get(lowerChar)!;
        return char === char.toUpperCase() ? decoded.toUpperCase() : decoded;
      }
      return char;
    }).join('');
  }
  
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

// Combine multiple ciphers
export const encodeCombined = (text: string, ciphers: Array<{ type: CipherType; custom?: CustomCipher }>): string => {
  let result = text;
  for (const { type, custom } of ciphers) {
    result = encode(result, type, custom);
  }
  return result;
};

export const decodeCombined = (text: string, ciphers: Array<{ type: CipherType; custom?: CustomCipher }>): string => {
  let result = text;
  for (let i = ciphers.length - 1; i >= 0; i--) {
    const { type, custom } = ciphers[i];
    result = decode(result, type, custom);
  }
  return result;
};

// Local storage helpers
export const saveCustomCiphers = (ciphers: Record<string, CustomCipher>) => {
  const serializable = Object.entries(ciphers).reduce((acc, [key, cipher]) => {
    acc[key] = {
      ...cipher,
      pattern: Array.from(cipher.pattern.entries()),
      reversePattern: Array.from(cipher.reversePattern.entries())
    };
    return acc;
  }, {} as any);
  
  localStorage.setItem('customCiphers', JSON.stringify(serializable));
};

export const loadCustomCiphers = (): Record<string, CustomCipher> => {
  const stored = localStorage.getItem('customCiphers');
  if (!stored) return {};
  
  try {
    const parsed = JSON.parse(stored);
    return Object.entries(parsed).reduce((acc, [key, value]: [string, any]) => {
      acc[key] = {
        ...value,
        pattern: new Map(value.pattern),
        reversePattern: new Map(value.reversePattern)
      };
      return acc;
    }, {} as Record<string, CustomCipher>);
  } catch {
    return {};
  }
};
