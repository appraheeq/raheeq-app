// KSA is UTC+3 (Offset = +3 hours)
const KSA_OFFSET_MS = 3 * 60 * 60 * 1000;

export const ARABIC_DAYS = [
  'الأحد',
  'الاثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت',
];

export const ARABIC_MONTHS = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

export const HIJRI_MONTHS = [
  'مُحرَّم',
  'صَفَر',
  'ربيع الأول',
  'ربيع الآخر',
  'جُمادى الأولى',
  'جُمادى الآخرة',
  'رَجَب',
  'شَعبان',
  'رَمضان',
  'شَوّال',
  'ذو القِعدة',
  'ذو الحِجّة',
];

export interface KSATimeInfo {
  date: Date;
  dateKey: string; // YYYY-MM-DD
  time24Str: string; // HH:mm:ss
  hours: number;
  minutes: number;
  seconds: number;
  gregorianDateStr: string; // e.g. "السبت 29 أغسطس 2026"
  hijriDateStr: string; // e.g. "16 ربيع الأول 1448 هـ"
}

function getKSANow(): Date {
  const now = new Date();
  const utcMs = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  return new Date(utcMs + KSA_OFFSET_MS);
}

function getKSADateKey(date: Date = getKSANow()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function format24HourTime(date: Date = getKSANow()): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function formatArabicGregorian(date: Date = getKSANow()): string {
  const dayName = ARABIC_DAYS[date.getDay()];
  const day = date.getDate();
  const monthName = ARABIC_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${dayName} ${day} ${monthName} ${year} م`;
}

function getHijriDate(date: Date = getKSANow()): {
  day: number;
  month: number;
  monthName: string;
  year: number;
  formatted: string;
} {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  let m = month + 1;
  let y = year;
  if (m < 3) {
    y -= 1;
    m += 12;
  }

  let a = Math.floor(y / 100);
  let b = 2 - a + Math.floor(a / 4);
  if (y < 1583) b = 0;
  if (y === 1582) {
    if (m > 10) b = -10;
    if (m === 10) {
      b = 0;
      if (day > 4) b = -10;
    }
  }

  let jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524;
  b = 0;
  if (jd > 2299160) {
    a = Math.floor((jd - 1867216.25) / 36524.25);
    b = 1 + a - Math.floor(a / 4);
  }

  const bb = jd + b + 1524;
  const cc = Math.floor((bb - 122.1) / 365.25);
  const dd = Math.floor(365.25 * cc);
  const ee = Math.floor((bb - dd) / 30.6001);

  // Islamic Calendar calculation (Kuwaiti algorithm offset tuning)
  const epochJulian = 1948439.5;
  const daySinceEpoch = jd - epochJulian;
  const hijriYear = Math.floor((30 * daySinceEpoch + 10646) / 10631);
  const yearDay = daySinceEpoch - Math.floor((11 * hijriYear + 3) / 30) + 1;
  let hijriMonth = Math.min(12, Math.ceil((yearDay - 29) / 29.5) + 1);
  if (hijriMonth <= 0) hijriMonth = 1;

  const hijriMonthDays = Math.floor(29.5 * (hijriMonth - 1));
  let hijriDay = Math.floor(yearDay - hijriMonthDays);
  if (hijriDay < 1) hijriDay = 1;
  if (hijriDay > 30) hijriDay = 30;

  const monthIndex = (hijriMonth - 1) % 12;
  const monthName = HIJRI_MONTHS[monthIndex];
  const formatted = `${hijriDay} ${monthName} ${hijriYear} هـ`;

  return {
    day: hijriDay,
    month: hijriMonth,
    monthName,
    year: hijriYear,
    formatted,
  };
}

function getKSATimeInfo(): KSATimeInfo {
  const date = getKSANow();
  const dateKey = getKSADateKey(date);
  const time24Str = format24HourTime(date);
  const gregorianDateStr = formatArabicGregorian(date);
  const hijri = getHijriDate(date);

  return {
    date,
    dateKey,
    time24Str,
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
    gregorianDateStr,
    hijriDateStr: hijri.formatted,
  };
}

export const TimeService = {
  getKSANow,
  getKSADateKey,
  format24HourTime,
  formatArabicGregorian,
  getHijriDate,
  getKSATimeInfo,
};
