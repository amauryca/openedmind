import { supabase } from '@/integrations/supabase/client';

// Fallback phrases for when API is unavailable - organized by language
const MULTILINGUAL_EMERGENCY_PHRASES: Record<string, string[]> = {
  english: [
    'kill myself', 'killing myself', 'end my life', 'take my life', 'commit suicide', 'suicide',
    'want to die', "i want to die", "i'm going to kill myself", 'hurt myself', 'harm myself',
    'self harm', 'self-harm', 'end it all', 'ending it all', 'not worth living', 'better off dead',
    'can\'t go on', 'done with life', 'give up on life', 'no point living', 'no reason to live',
    'life is hopeless', 'want it to end', 'planning to die', 'thinking of dying', 'ready to die',
    'wish i was dead', 'wish i were dead', 'nothing to live for', 'life isn\'t worth it',
    'overdose', 'cut myself', 'cutting myself', 'slash my wrists', 'jump off', 'hanging myself',
    'suffocate myself', 'poison myself', 'shoot myself', 'drown myself', 'worthless life',
    'hate my life', 'life is meaningless', 'can\'t take it anymore', 'too much pain',
    'rather be dead', 'escape this pain'
  ],
  spanish: [
    'matarme', 'quitarme la vida', 'terminar mi vida', 'suicidarme', 'suicidio',
    'quiero morir', 'quiero morirme', 'voy a matarme', 'hacerme daño', 'autolesión',
    'terminar con todo', 'no vale la pena vivir', 'mejor muerto', 'no puedo seguir',
    'acabar con mi vida', 'no hay razón para vivir', 'la vida no tiene sentido',
    'quiero que termine', 'planeando morir', 'pensando en morir', 'listo para morir',
    'desearía estar muerto', 'nada por lo que vivir', 'sobredosis', 'cortarme',
    'ahorcarme', 'envenenarme', 'odio mi vida', 'no puedo más', 'demasiado dolor'
  ],
  french: [
    'me tuer', 'mettre fin à ma vie', 'me suicider', 'suicide', 'veux mourir',
    'je veux mourir', 'vais me tuer', 'me faire du mal', 'automutilation',
    'en finir', 'plus la peine de vivre', 'mieux mort', 'ne peux plus continuer',
    'fini avec la vie', 'aucune raison de vivre', 'la vie est sans espoir',
    'veux que ça se termine', 'prêt à mourir', 'souhaite être mort',
    'rien pour vivre', 'overdose', 'me couper', 'me pendre', "m'empoisonner",
    'déteste ma vie', 'ne peux plus supporter', 'trop de douleur'
  ],
  german: [
    'mich umbringen', 'mein leben beenden', 'selbstmord', 'suizid', 'sterben will',
    'will sterben', 'werde mich töten', 'mir wehtun', 'selbstverletzung',
    'allem ein ende setzen', 'nicht wert zu leben', 'besser tot',
    'kann nicht weitermachen', 'mit dem leben fertig', 'kein grund zu leben',
    'das leben ist hoffnungslos', 'will dass es endet', 'bereit zu sterben',
    'wünschte ich wäre tot', 'nichts wofür es sich zu leben lohnt',
    'überdosis', 'mich schneiden', 'mich erhängen', 'mich vergiften',
    'hasse mein leben', 'kann nicht mehr', 'zu viel schmerz'
  ],
  italian: [
    'uccidermi', 'togliermi la vita', 'suicidarmi', 'suicidio', 'voglio morire',
    'morire', 'sto per uccidermi', 'farmi del male', 'autolesionismo',
    'farla finita', 'non vale la pena vivere', 'meglio morto', 'non posso andare avanti',
    'finita con la vita', 'nessun motivo per vivere', 'la vita è senza speranza',
    'voglio che finisca', 'pronto a morire', 'vorrei essere morto',
    'niente per cui vivere', 'overdose', 'tagliarmi', 'impiccarmi', 'avvelenarmi',
    'odio la mia vita', 'non ce la faccio più', 'troppo dolore'
  ],
  portuguese: [
    'me matar', 'tirar minha vida', 'me suicidar', 'suicídio', 'quero morrer',
    'morrer', 'vou me matar', 'me machucar', 'automutilação', 'acabar com tudo',
    'não vale a pena viver', 'melhor morto', 'não posso continuar',
    'acabei com a vida', 'nenhuma razão para viver', 'a vida não tem esperança',
    'quero que acabe', 'pronto para morrer', 'gostaria de estar morto',
    'nada para viver', 'overdose', 'me cortar', 'me enforcar', 'me envenenar',
    'odeio minha vida', 'não aguento mais', 'dor demais'
  ],
  russian: [
    'убить себя', 'покончить с жизнью', 'самоубийство', 'суицид', 'хочу умереть',
    'умереть', 'собираюсь убить себя', 'причинить себе вред', 'самоповреждение',
    'покончить со всем', 'не стоит жить', 'лучше мертвым', 'не могу продолжать',
    'покончил с жизнью', 'нет причин жить', 'жизнь безнадежна',
    'хочу чтобы это закончилось', 'готов умереть', 'хотел бы быть мертвым',
    'не ради чего жить', 'передозировка', 'порезаться', 'повеситься', 'отравиться',
    'ненавижу свою жизнь', 'больше не могу', 'слишком много боли'
  ],
  japanese: [
    '自殺', '死にたい', '死ぬ', '命を絶つ', '自分を殺す', '自傷',
    '終わりにしたい', '生きる価値がない', '死んだほうがまし', '続けられない',
    '人生に意味がない', '生きる理由がない', '終わらせたい', '死ぬ準備ができている',
    '死んでいればよかった', '生きるものがない', '自分を傷つける',
    '首を吊る', '毒を飲む', '人生が嫌い', 'もう耐えられない', '痛みが多すぎる'
  ],
  chinese: [
    '自杀', '想死', '结束生命', '了结生命', '杀死自己', '自残',
    '结束一切', '不值得活', '死了更好', '无法继续', '人生无望',
    '没有理由活着', '想要结束', '准备死', '希望我死了',
    '没有什么值得活', '过量', '割伤自己', '上吊', '毒死自己',
    '讨厌我的生活', '受不了了', '太痛苦'
  ],
  korean: [
    '자살', '죽고싶어', '목숨을 끊다', '자해', '스스로 해치다',
    '모든 것을 끝내다', '살 가치가 없다', '죽는 게 낫다', '계속할 수 없다',
    '인생이 희망 없다', '살 이유가 없다', '끝내고 싶다', '죽을 준비가 됐다',
    '죽었으면 좋겠다', '살 것이 없다', '과다복용', '자르다', '목매달다',
    '독살하다', '내 인생이 싫다', '더 이상 못 참겠다', '너무 아프다'
  ],
  hindi: [
    'आत्महत्या', 'मरना चाहता हूं', 'जीवन समाप्त करना', 'खुद को मारना',
    'आत्म-हानि', 'सब कुछ खत्म करना', 'जीने लायक नहीं', 'मरा हुआ बेहतर',
    'जारी नहीं रख सकता', 'जीवन निराशाजनक है', 'जीने का कोई कारण नहीं',
    'समाप्त करना चाहता हूं', 'मरने के लिए तैयार', 'काश मैं मर गया होता',
    'जीने के लिए कुछ नहीं', 'ओवरडोज', 'खुद को काटना', 'फांसी लगाना',
    'जहर देना', 'अपने जीवन से नफरत', 'अब और नहीं सह सकता', 'बहुत दर्द'
  ],
  arabic: [
    'الانتحار', 'أريد أن أموت', 'إنهاء حياتي', 'قتل نفسي', 'إيذاء النفس',
    'إنهاء كل شيء', 'لا يستحق العيش', 'الموت أفضل', 'لا أستطيع الاستمرار',
    'الحياة ميؤوس منها', 'لا سبب للعيش', 'أريد أن ينتهي', 'مستعد للموت',
    'أتمنى لو كنت ميتا', 'لا شيء يستحق العيش من أجله', 'جرعة زائدة',
    'جرح نفسي', 'شنق نفسي', 'تسميم نفسي', 'أكره حياتي', 'لا أستطيع تحمل المزيد',
    'ألم كثير'
  ]
};

// AI-powered detection with fallback
export const detectEmergency = async (text: string, language: string = 'english'): Promise<boolean> => {
  try {
    // Try AI-powered detection first
    const { data, error } = await supabase.functions.invoke('detect-emergency', {
      body: { text, language }
    });

    if (error) {
      console.error('Emergency detection API error:', error);
      // Fall back to keyword matching
      return fallbackDetection(text, language);
    }

    if (!data?.success) {
      console.error('Emergency detection failed:', data?.error);
      return fallbackDetection(text, language);
    }

    // Use AI result if confidence is high enough
    if (data.confidence >= 0.7) {
      return data.isEmergency;
    }

    // If confidence is low, double-check with fallback
    const fallbackResult = fallbackDetection(text, language);
    return data.isEmergency || fallbackResult;

  } catch (error) {
    console.error('Error in emergency detection:', error);
    // Fall back to keyword matching on any error
    return fallbackDetection(text, language);
  }
};

// Fallback keyword-based detection (language-aware)
const fallbackDetection = (text: string, language: string): boolean => {
  const lower = text.toLowerCase();
  const phrases = MULTILINGUAL_EMERGENCY_PHRASES[language] || MULTILINGUAL_EMERGENCY_PHRASES['english'];
  return phrases.some((p) => lower.includes(p));
};

export const emergencyResponseMessage =
  "I'm very concerned about what you've shared. Your safety and well-being are the most important things right now. Please know that you're not alone and there are people who want to help you through this difficult time.";
