import { Injectable } from '@angular/core';

export interface ChatbotKnowledgeEntry {
  id: string;
  title: string;
  keywords: string[];
  answer: string;
  sampleQuestions: string[];
}

export interface ChatbotResponse {
  answer: string;
  matchedEntry?: ChatbotKnowledgeEntry;
  fallback: boolean;
}

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private readonly learningStorageKey = 'auro-chatbot-learning';
  private readonly suggestionIndexKey = 'auro-chatbot-suggestion-index';
  private learnedAssociations: Record<string, string> = {};

  private readonly knowledgeBase: ChatbotKnowledgeEntry[] = [
    {
      id: 'radna-ploca',
      title: 'Radna ploča',
      keywords: ['radna', 'ploča', 'dashboard', 'pocetna', 'sažetak'],
      answer: 'Radna ploča prikazuje sažetak ključnih zadataka i statusa. Do nje dolaziš preko "Radna ploča" u glavnom meniju.',
      sampleQuestions: ['Šta vidim na radnoj ploči?'],
    },
    {
      id: 'dnevni-zadaci',
      title: 'Dnevni zadaci',
      keywords: ['dnevni', 'zadaci', 'plan', 'obaveze'],
      answer: 'Modul "Dnevni zadaci" služi za praćenje i razradu svakodnevnih obaveza prodavnica. Otvara se kroz meni Dnevni zadaci.',
      sampleQuestions: ['Kako da vidim dnevne zadatke?'],
    },
    {
      id: 'otpis-redovni',
      title: 'Redovni otpis',
      keywords: ['redovni', 'otpis', 'nema otpisa', 'prodavnica'],
      answer: 'Za redovni otpis koristi opcije u meniju Otpis > Redovni. Tu možeš dodati novi otpis, pregledati postojeće ili prijaviti da nema otpisa.',
      sampleQuestions: ['Kako prijaviti da nema otpisa?'],
    },
    {
      id: 'otpis-vanredni',
      title: 'Vanredni otpis',
      keywords: ['vanredni', 'otpis', 'hitno', 'odobrenje'],
      answer: 'Vanredni otpis se unosi kroz Otpis > Vanredni. Nakon unosa zahtjev ide na odobrenje kroz modul Zahtjevi.',
      sampleQuestions: ['Gdje unosim vanredni otpis?'],
    },
    {
      id: 'inventure',
      title: 'Inventure',
      keywords: ['inventura', 'parcijalna', 'pregled', 'odobrenje', 'unos'],
      answer: 'Inventure imaju dva dijela: unos parcijalnih inventura i pregled/odobrenje. U meniju Inventure pronađi "Unos" za nove zapise ili "Pregled" za nadzor postojećih.',
      sampleQuestions: ['Kako da unesem parcijalnu inventuru?'],
    },
    {
      id: 'zahtjevi',
      title: 'Zahtjevi',
      keywords: ['zahtjev', 'odobrenje', 'redovni otpis', 'vanredni otpis', 'izdatnice'],
      answer: 'Modul Zahtjevi okuplja sve zahtjeve za redovne i vanredne otpise te izdatnice troška. Koristi ga za pregled i odobravanje po roli.',
      sampleQuestions: ['Gdje pregledam zahtjeve za otpis?'],
    },
    {
      id: 'pregled',
      title: 'Pregled',
      keywords: ['pregled', 'izvještaj', 'neuslovna roba', 'prodavnice bez otpisa'],
      answer: 'Sekcija Pregled daje uvid u redovne i vanredne otpise, neuslovnu robu, izdatnice troška i spisak prodavnica bez otpisa.',
      sampleQuestions: ['Kako vidjeti prodavnice bez otpisa?'],
    },
    {
      id: 'datumi',
      title: 'Datumi i odobrenja',
      keywords: ['datumi', 'redovni otpis', 'odobrenje inventure', 'kalendar'],
      answer: 'Ako trebaš podesiti datume redovnog otpisa ili odobrenje inventure, koristi meni Datumi i odaberi odgovarajuću stavku.',
      sampleQuestions: ['Gdje mijenjam datum redovnog otpisa?'],
    },
    {
      id: 'dinamika-otpisa',
      title: 'Pregled dinamike otpisa',
      keywords: ['dinamika', 'otpis', 'trend', 'statistika'],
      answer: 'Pregled dinamike otpisa pruža statistiku i trendove redovnih otpisa. Dostupan je kroz stavku "Pregled dinamike otpisa".',
      sampleQuestions: ['Imamo li statistiku otpisa?'],
    },
    {
      id: 'zavrseni-zahtjevi',
      title: 'Završeni zahtjevi',
      keywords: ['završeni', 'odobreni', 'zahtjev', 'otpis'],
      answer: 'Završene zahtjeve za redovne i vanredne otpise možeš pregledati u meniju "Završeni zahtjevi".',
      sampleQuestions: ['Kako naći završene zahtjeve?'],
    },
    {
      id: 'akcije',
      title: 'Akcije i vikend akcije',
      keywords: ['akcije', 'vikend', 'promocija', 'kampanja'],
      answer: 'Za unos akcija koristi stavku "Akcije", a za pregled i status vikend akcija koristi meni "Vikend akcije".',
      sampleQuestions: ['Gdje vidim vikend akcije?'],
    },
    {
      id: 'vip-kvaliteta',
      title: 'Kvaliteta VIP-a',
      keywords: ['vip', 'kvaliteta', 'reklamacija', 'voće povrće'],
      answer: 'Modul "Kvaliteta VIP-a" služi za prijave i praćenje reklamacija voća i povrća. Otvara se kroz istoimenu stavku u meniju.',
      sampleQuestions: ['Kako prijaviti reklamaciju VIP?'],
    },
  ];

  private readonly suggestionPool: string[] = this.buildSuggestionPool();

  constructor() {
    this.learnedAssociations = this.loadLearnedAssociations();
  }

  getNextSuggestion(): string {
    if (!this.suggestionPool.length) {
      return '';
    }

    const currentIndex = this.getStoredSuggestionIndex();
    const suggestion = this.suggestionPool[currentIndex];
    const nextIndex = (currentIndex + 1) % this.suggestionPool.length;
    this.storeSuggestionIndex(nextIndex);

    return suggestion;
  }

  askQuestion(question: string): ChatbotResponse {
    const normalized = question.trim().toLowerCase();
    if (!normalized) {
      return { answer: 'Molim te unesi pitanje.', fallback: true };
    }

    const learnedMatch = this.findLearnedMatch(normalized);
    const bestMatch = learnedMatch ?? this.findBestMatch(normalized);

    if (bestMatch) {
      this.reinforceLearning(normalized, bestMatch.id);
      return { answer: bestMatch.answer, matchedEntry: bestMatch, fallback: false };
    }

    return {
      answer: 'Za ovo trenutno nemam odgovor u bazi. Molimo te obrati se IT službi.',
      fallback: true,
    };
  }

  private findBestMatch(question: string): ChatbotKnowledgeEntry | undefined {
    const tokens = this.tokenize(question);
    let bestScore = 0;
    let best: ChatbotKnowledgeEntry | undefined;

    for (const entry of this.knowledgeBase) {
      const score = this.scoreEntry(entry, tokens);
      if (score > bestScore) {
        bestScore = score;
        best = entry;
      }
    }

    return bestScore > 0 ? best : undefined;
  }

  private scoreEntry(entry: ChatbotKnowledgeEntry, tokens: string[]): number {
    const keywordHits = entry.keywords.reduce((hits, keyword) => {
      return hits + (tokens.includes(keyword) ? 2 : 0);
    }, 0);

    const titleTokens = this.tokenize(entry.title);
    const titleHits = titleTokens.reduce((hits, keyword) => {
      return hits + (tokens.includes(keyword) ? 1 : 0);
    }, 0);

    return keywordHits + titleHits;
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .split(/[^a-zčćžšđ0-9]+/i)
      .filter(token => token.length > 2);
  }

  private findLearnedMatch(question: string): ChatbotKnowledgeEntry | undefined {
    const tokens = this.tokenize(question);
    for (const token of tokens) {
      const entryId = this.learnedAssociations[token];
      if (entryId) {
        const match = this.knowledgeBase.find(item => item.id === entryId);
        if (match) {
          return match;
        }
      }
    }
    return undefined;
  }

  private reinforceLearning(question: string, entryId: string): void {
    const tokens = this.tokenize(question).slice(0, 5);
    let updated = false;

    tokens.forEach(token => {
      if (!this.learnedAssociations[token]) {
        this.learnedAssociations[token] = entryId;
        updated = true;
      }
    });

    if (updated) {
      this.persistLearning();
    }
  }

  private loadLearnedAssociations(): Record<string, string> {
    if (typeof localStorage === 'undefined') {
      return {};
    }

    try {
      const raw = localStorage.getItem(this.learningStorageKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  private persistLearning(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(this.learningStorageKey, JSON.stringify(this.learnedAssociations));
    } catch {
      // Ignored: localStorage may be unavailable.
    }
  }

  private buildSuggestionPool(): string[] {
    const baseQuestions = this.knowledgeBase.reduce((questions: string[], item) => {
      questions.push(...item.sampleQuestions);
      return questions;
    }, []);

    const uniqueQuestions = Array.from(new Set(baseQuestions));
    const pool = uniqueQuestions.slice(0, 10);

    while (pool.length < 10 && uniqueQuestions.length) {
      pool.push(uniqueQuestions[pool.length % uniqueQuestions.length]);
    }

    return pool;
  }

  private getStoredSuggestionIndex(): number {
    if (typeof localStorage === 'undefined') {
      return 0;
    }

    try {
      const stored = localStorage.getItem(this.suggestionIndexKey);
      const parsed = stored ? parseInt(stored, 10) : 0;
      return Number.isFinite(parsed) && parsed >= 0 && parsed < this.suggestionPool.length ? parsed : 0;
    } catch {
      return 0;
    }
  }

  private storeSuggestionIndex(index: number): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(this.suggestionIndexKey, index.toString());
    } catch {
      // Ignored: localStorage may be unavailable.
    }
  }
}
