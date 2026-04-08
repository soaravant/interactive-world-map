// Paschal greetings compiled for the interactive globe.
// Greeting variants and transliterations were verified against:
// https://www.oca.org/orthodoxy/paschal-greetings
// https://orthodoxwiki.org/Paschal_greeting

const placeholderSlides = countryName => ([
    { src: '../images/country1.jpg', title: `${countryName} · θέση για εικόνα 1` },
    { src: '../images/country2.jpg', title: `${countryName} · θέση για εικόνα 2` },
    { src: '../images/country3.jpg', title: `${countryName} · θέση για εικόνα 3` }
]);

export const GREETING_COUNTRIES = [
    {
        name: 'Ελλάδα',
        polygonNames: ['Greece'],
        flag: 'gr',
        lat: 39.1,
        lng: 22.9,
        language: 'Ελληνικά',
        greeting: 'Χριστός Ανέστη!',
        response: 'Αληθώς Ανέστη!',
        ttsLang: 'el',
        ttsText: 'Χριστός Ανέστη!',
        greetingAudioSrc: './audio/greece-el.mp3',
        responseAudioSrc: './audio/greece-el-response.mp3',
        images: placeholderSlides('Ελλάδα')
    },
    {
        name: 'Αλβανία',
        polygonNames: ['Albania'],
        flag: 'al',
        lat: 41.2,
        lng: 20.1,
        language: 'Αλβανικά',
        greeting: 'Krishti u ngjall!',
        response: 'Vërtet u ngjall!',
        ttsLang: 'sq',
        ttsText: 'Krishti u ngjall!',
        greetingAudioSrc: './audio/albania-sq.mp3',
        responseAudioSrc: './audio/albania-sq-response.mp3',
        images: [
            { src: '../images/alvania/photo_1.jpg', title: 'Ναός της Αναστάσεως' },
            { src: '../images/alvania/photo_2.jpg', title: 'π. Αναστάσιος μαζί με πιστούς' },
            { src: '../images/alvania/photo_3.jpg', title: 'Κυριακή του Πάσχα' },
            { src: '../images/alvania/photo_4.jpg', title: 'Ιεραποστολή Αλβανία' }
        ]
    },
    {
        name: 'Ρουμανία',
        polygonNames: ['Romania'],
        flag: 'ro',
        lat: 45.9,
        lng: 24.9,
        language: 'Ρουμανικά',
        greeting: 'Hristos a înviat!',
        response: 'Adevărat a înviat!',
        ttsLang: 'ro',
        ttsText: 'Hristos a înviat!',
        greetingAudioSrc: './audio/romania-ro.mp3',
        responseAudioSrc: './audio/romania-ro-response.mp3',
        images: placeholderSlides('Ρουμανία')
    },
    {
        name: 'Βουλγαρία',
        polygonNames: ['Bulgaria'],
        flag: 'bg',
        lat: 42.7,
        lng: 25.3,
        language: 'Βουλγαρικά',
        greeting: 'Христос възкресе!',
        response: 'Воистина възкресе!',
        ttsLang: 'bg',
        ttsText: 'Христос възкресе!',
        greetingAudioSrc: './audio/bulgaria-bg.mp3',
        responseAudioSrc: './audio/bulgaria-bg-response.mp3',
        images: placeholderSlides('Βουλγαρία')
    },
    {
        name: 'Σερβία',
        polygonNames: ['Serbia'],
        flag: 'rs',
        lat: 44.0,
        lng: 20.8,
        language: 'Σερβικά',
        greeting: 'Христос васкрсе!',
        response: 'Ваистину васкрсе!',
        ttsLang: 'sr',
        ttsText: 'Христос васкрсе!',
        greetingAudioSrc: './audio/serbia-sr.mp3',
        responseAudioSrc: './audio/serbia-sr-response.mp3',
        images: placeholderSlides('Σερβία')
    },
    {
        name: 'Ρωσία',
        polygonNames: ['Russia', 'Russian Federation'],
        flag: 'ru',
        lat: 61.5,
        lng: 96.0,
        language: 'Ρωσικά',
        greeting: 'Христос воскресе!',
        response: 'Воистину воскресе!',
        ttsLang: 'ru',
        ttsText: 'Христос воскресе!',
        greetingAudioSrc: './audio/russia-ru.mp3',
        responseAudioSrc: './audio/russia-ru-response.mp3',
        images: placeholderSlides('Ρωσία')
    },
    {
        name: 'Ουκρανία',
        polygonNames: ['Ukraine'],
        flag: 'ua',
        lat: 49.0,
        lng: 31.4,
        language: 'Ουκρανικά',
        greeting: 'Христос воскрес!',
        response: 'Воістину воскрес!',
        ttsLang: 'uk',
        ttsText: 'Христос воскрес!',
        greetingAudioSrc: './audio/ukraine-uk.mp3',
        responseAudioSrc: './audio/ukraine-uk-response.mp3',
        images: placeholderSlides('Ουκρανία')
    },
    {
        name: 'Μεξικό',
        polygonNames: ['Mexico'],
        flag: 'mx',
        lat: 23.6,
        lng: -102.5,
        language: 'Ισπανικά',
        greeting: '¡Cristo ha resucitado!',
        response: '¡En verdad ha resucitado!',
        ttsLang: 'es',
        ttsText: 'Cristo ha resucitado!',
        greetingAudioSrc: './audio/mexico-es.mp3',
        responseAudioSrc: './audio/mexico-es-response.mp3',
        images: [
            { src: '../images/mexiko/photo_1.jpg', title: 'Κυριακή της Ορθοδοξίας' },
            { src: '../images/mexiko/photo_2.jpg', title: 'Ιεραποστολή στους Αζτέκους' },
            { src: '../images/mexiko/photo_3.jpg', title: 'Άγιος Νικόλαος' },
            { src: '../images/mexiko/photo_4.jpg', title: 'Ιεραποστολή Μεξικό' }
        ]
    },
    {
        name: 'Βραζιλία',
        polygonNames: ['Brazil'],
        flag: 'br',
        lat: -14.2,
        lng: -51.9,
        language: 'Πορτογαλικά',
        greeting: 'Cristo ressuscitou!',
        response: 'Em verdade ressuscitou!',
        ttsLang: 'pt',
        ttsText: 'Cristo ressuscitou!',
        greetingAudioSrc: './audio/brazil-pt.mp3',
        responseAudioSrc: './audio/brazil-pt-response.mp3',
        images: placeholderSlides('Βραζιλία')
    },
    {
        name: 'Αίγυπτος',
        polygonNames: ['Egypt'],
        flag: 'eg',
        lat: 26.8,
        lng: 30.8,
        language: 'Αραβικά',
        greeting: 'المسيح قام!',
        response: 'حقا قام!',
        ttsLang: 'ar',
        ttsText: 'المسيح قام!',
        greetingAudioSrc: './audio/egypt-ar.mp3',
        responseAudioSrc: './audio/egypt-ar-response.mp3',
        images: placeholderSlides('Αίγυπτος')
    },
    {
        name: 'Κένυα',
        polygonNames: ['Kenya'],
        flag: 'ke',
        lat: -0.2,
        lng: 37.9,
        language: 'Σουαχίλι',
        greeting: 'Kristo amefufukka!',
        response: 'Kweli amefufukka!',
        ttsLang: 'sw',
        ttsText: 'Kristo amefufukka!',
        greetingAudioSrc: './audio/kenya-sw.mp3',
        responseAudioSrc: './audio/kenya-sw-response.mp3',
        images: [
            { src: '../images/kenya/photo_1.jpg', title: 'Λιτανεία' },
            { src: '../images/kenya/photo_2.jpg', title: 'Ιερός Ναός & Σχολείο' },
            { src: '../images/kenya/photo_3.jpg', title: 'Παιδιά στην Κένυα' },
            { src: '../images/kenya/photo_4.jpg', title: 'Ιεραποστολή Κένυα' }
        ]
    },
    {
        name: 'Ινδονησία',
        polygonNames: ['Indonesia'],
        flag: 'id',
        lat: -2.2,
        lng: 117.4,
        language: 'Ινδονησιακά',
        greeting: 'Kristus telah bangkit!',
        response: 'Dia benar-benar telah bangkit!',
        ttsLang: 'id',
        ttsText: 'Kristus telah bangkit!',
        greetingAudioSrc: './audio/indonesia-id.mp3',
        responseAudioSrc: './audio/indonesia-id-response.mp3',
        images: [
            { src: '../images/indonisia/photo_1.jpg', title: 'Θεία Κοινωνία' },
            { src: '../images/indonisia/photo_2.jpg', title: 'Σχολείο' },
            { src: '../images/indonisia/photo_3.jpg', title: 'Βοήθεια στους πληγέντες από το τσουνάμι' },
            { src: '../images/indonisia/photo_4.jpg', title: 'Ιεραποστολή Ινδονησία' }
        ]
    }
];
