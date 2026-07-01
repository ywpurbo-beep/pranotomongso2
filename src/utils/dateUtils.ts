import { Mangsa } from '../types';
import { MANGSAS_DATA } from '../data';

/**
 * Determines the active Mangsa (season) based on a given Date.
 */
export function getMangsaForDate(date: Date): Mangsa {
  const month = date.getMonth(); // 0 = Jan, 11 = Dec
  const day = date.getDate();

  // Jan 1 to Feb 2: Kapitu (ID 7)
  if ((month === 0) || (month === 1 && day <= 2)) {
    return MANGSAS_DATA.find(m => m.id === 7) || MANGSAS_DATA[6];
  }
  // Feb 3 to Feb 28/29: Kawolu (ID 8)
  if (month === 1 && day >= 3) {
    return MANGSAS_DATA.find(m => m.id === 8) || MANGSAS_DATA[7];
  }
  // Mar 1 to Mar 25: Kasanga (ID 9)
  if (month === 2 && day <= 25) {
    return MANGSAS_DATA.find(m => m.id === 9) || MANGSAS_DATA[8];
  }
  // Mar 26 to Apr 18: Kadasa (ID 10)
  if ((month === 2 && day >= 26) || (month === 3 && day <= 18)) {
    return MANGSAS_DATA.find(m => m.id === 10) || MANGSAS_DATA[9];
  }
  // Apr 19 to May 11: Desta (ID 11)
  if ((month === 3 && day >= 19) || (month === 4 && day <= 11)) {
    return MANGSAS_DATA.find(m => m.id === 11) || MANGSAS_DATA[10];
  }
  // May 12 to Jun 21: Saddha (ID 12)
  if ((month === 4 && day >= 12) || (month === 5 && day <= 21)) {
    return MANGSAS_DATA.find(m => m.id === 12) || MANGSAS_DATA[11];
  }
  // Jun 22 to Aug 1: Kasa (ID 1)
  if ((month === 5 && day >= 22) || (month === 6) || (month === 7 && day <= 1)) {
    return MANGSAS_DATA.find(m => m.id === 1) || MANGSAS_DATA[0];
  }
  // Aug 2 to Aug 24: Karo (ID 2)
  if (month === 7 && day >= 2 && day <= 24) {
    return MANGSAS_DATA.find(m => m.id === 2) || MANGSAS_DATA[1];
  }
  // Aug 25 to Sep 17: Katelu (ID 3)
  if ((month === 7 && day >= 25) || (month === 8 && day <= 17)) {
    return MANGSAS_DATA.find(m => m.id === 3) || MANGSAS_DATA[2];
  }
  // Sep 18 to Oct 12: Kapat (ID 4)
  if ((month === 8 && day >= 18) || (month === 9 && day <= 12)) {
    return MANGSAS_DATA.find(m => m.id === 4) || MANGSAS_DATA[3];
  }
  // Oct 13 to Nov 8: Kalima (ID 5)
  if ((month === 9 && day >= 13) || (month === 10 && day <= 8)) {
    return MANGSAS_DATA.find(m => m.id === 5) || MANGSAS_DATA[4];
  }
  // Nov 9 to Dec 21: Kanem (ID 6)
  if ((month === 10 && day >= 9) || (month === 11 && day <= 21)) {
    return MANGSAS_DATA.find(m => m.id === 6) || MANGSAS_DATA[5];
  }
  // Dec 22 to Dec 31: Kapitu (ID 7)
  if (month === 11 && day >= 22) {
    return MANGSAS_DATA.find(m => m.id === 7) || MANGSAS_DATA[6];
  }

  // Fallback
  return MANGSAS_DATA[0];
}

/**
 * Gets the start date of a Mangsa in a given year.
 */
export function getStartDateForMangsa(mangsaId: number, year: number = new Date().getFullYear()): Date {
  switch (mangsaId) {
    case 1: return new Date(year, 5, 22);
    case 2: return new Date(year, 7, 2);
    case 3: return new Date(year, 7, 25);
    case 4: return new Date(year, 8, 18);
    case 5: return new Date(year, 9, 13);
    case 6: return new Date(year, 10, 9);
    case 7: return new Date(year, 11, 22);
    case 8: return new Date(year, 1, 3);
    case 9: return new Date(year, 2, 1);
    case 10: return new Date(year, 2, 26);
    case 11: return new Date(year, 3, 19);
    case 12: return new Date(year, 4, 12);
    default: return new Date(year, 5, 22);
  }
}

/**
 * Formats a Date object to Indonesian local format.
 */
export function formatDateToID(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('id-ID', options);
}

/**
 * Formats a Date object to YYYY-MM-DD for standard html inputs.
 */
export function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
