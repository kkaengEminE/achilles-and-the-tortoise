import { create } from 'zustand';
import { STRINGS, type Lang, type StringKey } from './strings';

const KEY = 'zeno.lang.v1';

function loadLang(): Lang {
  try {
    const v = localStorage.getItem(KEY);
    if (v === 'ko' || v === 'en') return v;
  } catch {
    // ignore
  }
  // default: KO if browser language is Korean, else EN
  if (typeof navigator !== 'undefined' && /^ko/i.test(navigator.language || '')) return 'ko';
  return 'en';
}

interface LangStore {
  lang: Lang;
  setLang: (l: Lang) => void;
}

export const useLangStore = create<LangStore>((set) => ({
  lang: loadLang(),
  setLang: (l) => {
    try {
      localStorage.setItem(KEY, l);
    } catch {
      // ignore
    }
    set({ lang: l });
  },
}));

export function useT() {
  const lang = useLangStore((s) => s.lang);
  return (key: StringKey) => STRINGS[key][lang] || STRINGS[key].en;
}

export function useLang() {
  return useLangStore((s) => s.lang);
}
