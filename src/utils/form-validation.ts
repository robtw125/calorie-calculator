import axios from 'axios'

const API_URI = 'https://api.pwnedpasswords.com/range/'

const MIN_PASSWORD_LENGTH = 8

export function checkEmailValidity(email: string) {
  if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
    return { valid: false, message: 'Die E-Mail-Adresse ist ungültig.' }

  return { valid: true, message: 'Die E-Mail-Adresse ist gültig.' }
}

export async function checkPasswordValidity(
  password: string
): Promise<{ valid: boolean; message: string }> {
  if (password.length < MIN_PASSWORD_LENGTH)
    return {
      valid: false,
      message: `Das Passwort muss mindestens ${MIN_PASSWORD_LENGTH} Zeichen enthalten.`
    }

  if (!/[a-zA-Z]/.test(password))
    return { valid: false, message: 'Das Passwort muss mindestens einen Buchstaben enthalten.' }

  if (!/[a-z]/.test(password))
    return {
      valid: false,
      message: 'Das Passwort muss mindestens einen Kleinbuchstaben enthalten.'
    }

  if (!/[A-Z]/.test(password))
    return { valid: false, message: 'Das Passwort muss mindestens einen Großbuchstaben enthalten.' }

  if (!/[0-9]/.test(password))
    return { valid: false, message: 'Das Passwort muss mindestens eine Ziffer enthalten.' }

  if (/\s/.test(password))
    return { valid: false, message: 'Das Passwort darf keine Leerzeichen enthalten.' }

  if (/[^A-Za-z0-9@$!%*#?&.]/.test(password))
    return {
      valid: false,
      message:
        'Das Passwort darf nur Ziffern, Buchstaben und Sonderzeichen (@, $, !, %, *, #, ?, &, .) enthalten.'
    }

  if (!/[@$!%*#?&.]/.test(password))
    return { valid: false, message: 'Das Passwort muss ein Sonderzeichen enthalten.' }

  try {
    if (await passwordIsPwned(password))
      return {
        valid: false,
        message: 'Das eingegebene Passwort wurde in einem Datenleck gefunden!'
      }
  } catch (error) {
    if (error instanceof Error)
      console.error('API-Überprüfung für Passwort fehlgeschlagen!', error.message)

    return {
      valid: true,
      message:
        'Das Passwort ist gültig, konnte aber nicht auf das Auftauchen in einem Datenleck überprüft werden.'
    }
  }

  return { valid: true, message: 'Das Passwort ist gültig.' }
}

//API benötigt die ersten 5 Chars des SHA1-Hashes des Passworts
//https://haveibeenpwned.com/API/v3#SearchingPwnedPasswordsByRange
async function passwordIsPwned(password: string): Promise<boolean> {
  const hash = await getSHA1(password)

  const response = await axios.get(API_URI + hash.slice(0, 5))
  const map = convertDataToMap(response.data)

  //Liste von API ohne erste 5 Chars -> .slice
  return map.has(hash.slice(5, hash.length))
}

function convertDataToMap(data: string): Map<string, number> {
  const map = new Map<string, number>()
  const lines = data.split('\n')

  lines.forEach((line) => {
    const [key, value] = line.split(':')

    const hash = key.trim()
    const count = parseInt(value.trim())

    map.set(hash, count)
  })

  return map
}

async function getSHA1(text: string): Promise<string> {
  const textUint8 = new TextEncoder().encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-1', textUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('')
  return hashHex.toUpperCase()
}
