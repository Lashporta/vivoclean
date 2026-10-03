import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export const LANGUAGES = ['cz', 'en'];
const DEFAULT_LANG = 'cz';
const STORAGE_KEY = 'vivoclean-lang';

const translations = {
  cz: {
    'nav.home': 'Domů',
    'nav.services': 'Služby',
    'nav.prices': 'Ceník',
    'nav.about': 'O nás',
    'nav.contact': 'Kontakt',
    'nav.requestQuote': 'Vyžádat nabídku',
    'nav.toggleMenu': 'Otevřít menu',

    'footer.services': 'Služby',
    'footer.company': 'Společnost',
    'footer.aboutUs': 'O nás',
    'footer.priceList': 'Ceník',
    'footer.requestQuote': 'Vyžádat nabídku',
    'footer.admin': 'Admin',
    'footer.contact': 'Kontakt',
    'footer.allRights': 'Všechna práva vyhrazena.',
    'footer.ecoLine': 'Eco úklid · Plně pojištěno · Praha',

    'booking.fillNameEmail': 'Vyplňte prosím jméno a e-mail.',
    'booking.somethingWrong': 'Něco se pokazilo. Zkuste to prosím znovu.',
    'booking.thankYou': 'Děkujeme!',
    'booking.received': 'Vaše poptávka byla přijata. Připravíme nabídku a ozveme se vám ještě ten samý den.',
    'booking.submitAnother': 'Odeslat další poptávku',
    'booking.fullName': 'Jméno a příjmení *',
    'booking.yourName': 'Vaše jméno',
    'booking.email': 'E-mail *',
    'booking.phone': 'Telefon',
    'booking.cleaningAddress': 'Adresa úklidu',
    'booking.addressPlaceholder': 'Ulice, město',
    'booking.service': 'Služba',
    'booking.selectService': 'Vyberte službu',
    'booking.other': 'Jiné / nevím',
    'booking.preferredTime': 'Preferovaný termín',
    'booking.timePlaceholder': 'např. příští pondělí ráno',
    'booking.message': 'Zpráva',
    'booking.messagePlaceholder': 'Popište nám rozsah úklidu…',
    'booking.vacuumMop': 'Máte vlastní vysavač a mop?',
    'booking.yes': 'Ano',
    'booking.no': 'Ne',
    'booking.promoCode': 'Promo / voucher kód',
    'booking.promoPlaceholder': 'Pokud nějaký máte',
    'booking.getQuote': 'Získat nabídku',
    'booking.agreeNote': 'Odesláním souhlasíte s tím, že vás budeme kontaktovat ohledně vaší poptávky. Bez závazku.',

    'card.learnMore': 'Dozvědět se více',

    'home.seePrices': 'Zobrazit ceny',
    'home.aboutVivoclean': 'O VivoClean',
    'home.readMore': 'Dočtěte se o nás',
    'home.ourServices': 'Naše služby',
    'home.servicesHeading': 'Kompletní úklidové služby pro každý prostor',
    'home.whyChooseUs': 'Proč si vybrat nás',
    'home.whyHeading': 'Vaše spokojenost je naší prioritou',
    'home.howItWorks': 'Jak to funguje',
    'home.testimonials': 'Reference',
    'home.testimonialsHeading': 'Co říkají naši klienti',
    'home.faq': 'Časté dotazy',
    'home.faqHeading': 'Často kladené otázky',
    'home.requestQuoteHeading': 'Vyžádejte si nabídku bez závazku',
    'home.replySameDay': 'Odpovídáme ještě ten samý den.',

    'about.aboutUs': 'O nás',
    'about.aboutText2': 'Ve VivoClean vždy přizpůsobujeme naše úklidové služby vašim konkrétním potřebám, požadavkům a lokalitě. Máte-li dotazy, kontaktujte nás přímo. Budeme rádi, když vám pomůžeme dosáhnout nového standardu čistoty a údržby — doma i v práci.',
    'about.requestQuote': 'Vyžádat nabídku',
    'about.ourValues': 'Naše hodnoty',
    'about.whyClients': 'Proč u nás klienti zůstávají',
    'about.letUsTakeCare': 'Přenechte péči o váš prostor nám',
    'about.letUsText': 'Spolehlivý, důkladný a šetrný úklid — rezervujte si termín ještě dnes.',
    'about.getQuote': 'Získat nabídku',

    'contact.contact': 'Kontakt',
    'contact.requestNoObligation': 'Vyžádejte si nabídku bez závazku',
    'contact.fillForm': 'Vyplňte formulář níže a my odpovíme ještě ten samý den.',
    'contact.getInTouch': 'Spojte se s námi',
    'contact.phone': 'Telefon',
    'contact.email': 'E-mail',
    'contact.address': 'Adresa',
    'contact.openingHours': 'Otevírací doba',
    'contact.hoursValue': 'Denně, 8:00 – 20:00',
    'contact.hoursNote': 'Včetně víkendů — na přání prodlouženo',

    'prices.priceList': 'Ceník',
    'prices.heading': 'Průhledné ceny za kvalitní úklid',
    'prices.intro': 'Zakládáme si na průhlednosti. Ceny níže jsou orientační — přesnou částku s vámi upravíme po krátké konzultaci. Nabízíme také slevy, benefity a dárkové poukazy.',
    'prices.updating': 'Ceník se právě aktualizuje. Pro nabídku nás prosím ',
    'prices.contactUs': 'kontaktujte',
    'prices.browseServices': 'Procházet naše služby',
    'prices.notSure': 'Nevíte, co potřebujete?',
    'prices.notSureText': 'Popište nám váš prostor a my doporučíme správnou službu za správnou cenu.',
    'prices.getQuote': 'Získat nabídku',

    'service.notFound': 'Služba nenalezena',
    'service.notFoundText': 'Služba, kterou hledáte, neexistuje nebo byla přesunuta.',
    'service.backHome': 'Zpět domů',
    'service.whatsIncluded': 'Co je zahrnuto',
    'service.standardScope': 'Náš standardní rozsah',
    'service.requestQuote': 'Vyžádat nabídku',
    'service.faq': 'Časté dotazy',
    'service.faqHeading': 'Často kladené otázky',
    'service.bookService': 'Rezervovat tuto službu',
    'service.noObligation': 'Bez závazku. Odpovídáme ještě ten samý den.',
    'service.exploreMore': 'Prozkoumat více',
    'service.otherServices': 'Další služby',

    'notfound.title': 'Stránka nenalezena',
    'notfound.text': 'Stránku „{page}" se v této aplikaci nepodařilo najít.',
    'notfound.goHome': 'Přejít domů',
  },
  en: {
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.prices': 'Prices',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.requestQuote': 'Request a quote',
    'nav.toggleMenu': 'Toggle menu',

    'footer.services': 'Services',
    'footer.company': 'Company',
    'footer.aboutUs': 'About us',
    'footer.priceList': 'Price list',
    'footer.requestQuote': 'Request a quote',
    'footer.admin': 'Admin',
    'footer.contact': 'Contact',
    'footer.allRights': 'All rights reserved.',
    'footer.ecoLine': 'Eco cleaning · Fully insured · Prague',

    'booking.fillNameEmail': 'Please fill in your name and email.',
    'booking.somethingWrong': 'Something went wrong. Please try again.',
    'booking.thankYou': 'Thank you!',
    'booking.received': 'Your request has been received. We will prepare a quote and get back to you the same day.',
    'booking.submitAnother': 'Submit another request',
    'booking.fullName': 'Full name *',
    'booking.yourName': 'Your name',
    'booking.email': 'Email *',
    'booking.phone': 'Phone',
    'booking.cleaningAddress': 'Cleaning address',
    'booking.addressPlaceholder': 'Street, city',
    'booking.service': 'Service',
    'booking.selectService': 'Select a service',
    'booking.other': 'Other / not sure',
    'booking.preferredTime': 'Preferred time',
    'booking.timePlaceholder': 'e.g. next Monday morning',
    'booking.message': 'Message',
    'booking.messagePlaceholder': 'Tell us about the scope of cleaning...',
    'booking.vacuumMop': 'Do you have your own vacuum & mop?',
    'booking.yes': 'Yes',
    'booking.no': 'No',
    'booking.promoCode': 'Promo / voucher code',
    'booking.promoPlaceholder': 'If you have one',
    'booking.getQuote': 'Get my quote',
    'booking.agreeNote': 'By submitting you agree to be contacted about your request. No obligation.',

    'card.learnMore': 'Learn more',

    'home.seePrices': 'See prices',
    'home.aboutVivoclean': 'About VivoClean',
    'home.readMore': 'Read more about us',
    'home.ourServices': 'Our services',
    'home.servicesHeading': 'A complete cleaning service for every space',
    'home.whyChooseUs': 'Why choose us',
    'home.whyHeading': 'Your satisfaction is our priority',
    'home.howItWorks': 'How it works',
    'home.testimonials': 'Testimonials',
    'home.testimonialsHeading': 'What our clients say',
    'home.faq': 'FAQ',
    'home.faqHeading': 'Frequently asked questions',
    'home.requestQuoteHeading': 'Request your no-obligation quote',
    'home.replySameDay': 'We reply the same day.',

    'about.aboutUs': 'About us',
    'about.aboutText2': 'At VivoClean we always tailor our cleaning services to your specific needs, requirements and location. If you have questions, contact us directly. It will be our pleasure to help you reach a new standard of cleanliness and maintenance — at home or at work.',
    'about.requestQuote': 'Request a quote',
    'about.ourValues': 'Our values',
    'about.whyClients': 'Why clients stay with us',
    'about.letUsTakeCare': 'Let us take care of your space',
    'about.letUsText': 'Reliable, thorough and eco-friendly cleaning — book your slot today.',
    'about.getQuote': 'Get a quote',

    'contact.contact': 'Contact',
    'contact.requestNoObligation': 'Request a no-obligation quote',
    'contact.fillForm': 'Fill in the form below and we will reply the same day.',
    'contact.getInTouch': 'Get in touch',
    'contact.phone': 'Phone',
    'contact.email': 'Email',
    'contact.address': 'Address',
    'contact.openingHours': 'Opening hours',
    'contact.hoursValue': 'Every day, 8:00 – 20:00',
    'contact.hoursNote': 'Weekends included — extended on request',

    'prices.priceList': 'Price list',
    'prices.heading': 'Transparent prices for quality cleaning',
    'prices.intro': 'We pride ourselves on transparency. The prices below are indicative — we finalise the exact amount with you after a quick consultation. We also offer discounts, benefits and gift vouchers.',
    'prices.updating': 'The price list is being updated. Please ',
    'prices.contactUs': 'contact us',
    'prices.browseServices': 'Browse our services',
    'prices.notSure': 'Not sure what you need?',
    'prices.notSureText': 'Tell us about your space and we will recommend the right service at the right price.',
    'prices.getQuote': 'Get a quote',

    'service.notFound': 'Service not found',
    'service.notFoundText': 'The service you are looking for does not exist or has been moved.',
    'service.backHome': 'Back to home',
    'service.whatsIncluded': "What's included",
    'service.standardScope': 'Our standard scope',
    'service.requestQuote': 'Request a quote',
    'service.faq': 'FAQ',
    'service.faqHeading': 'Frequently asked questions',
    'service.bookService': 'Book this service',
    'service.noObligation': 'No obligation. We reply the same day.',
    'service.exploreMore': 'Explore more',
    'service.otherServices': 'Other services',

    'notfound.title': 'Page Not Found',
    'notfound.text': 'The page "{page}" could not be found in this application.',
    'notfound.goHome': 'Go Home',
  },
};

const LanguageContext = createContext({ lang: DEFAULT_LANG, setLang: () => {}, t: (k) => k });

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_LANG;
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = useCallback((l) => {
    if (LANGUAGES.includes(l)) setLangState(l);
  }, []);

  const t = useCallback((key, vars) => {
    let str = translations[lang]?.[key] ?? translations[DEFAULT_LANG]?.[key] ?? key;
    if (vars) {
      Object.keys(vars).forEach((v) => {
        str = str.replace(`{${v}}`, vars[v]);
      });
    }
    return str;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useI18n() {
  return useContext(LanguageContext);
}