// Mission Countries Data - Extracted from PowerPoint "Χάρτης Εξωτερικής Ιεραποστολής"
// Each entry: name (Greek), lat/lng for globe pin, stats from the stats image, images with captions from the slideshow

const MISSION_COUNTRIES = [
    {
        name: "Αλάσκα",
        flag: "us",
        lat: 64.2, lng: -153.5,
        stats: [
            { value: "722.728", label: "ΠΛΗΘΥΣΜΟΣ" },
            { value: "13", label: "ΦΟΡΕΣ Η ΑΘΗΝΑ ΣΕ ΕΚΤΑΣΗ" },
            { value: "1900", label: "ΠΡΩΤΗ ΧΡΟΝΙΑ ΠΑΡΟΥΣΙΑΣ" }
        ],
        images: [
            { src: "images/alaska/photo_1.jpg", title: "Ορθόδοξη Εκκλησία" },
            { src: "images/alaska/photo_2.jpg", title: "Ορθόδοξη κατασκήνωση" },
            { src: "images/alaska/photo_3.jpg", title: "Θεία λειτουργία" },
            { src: "images/alaska/photo_4.jpg", title: "Ιεραποστολή Αλάσκα" }
        ]
    },
    {
        name: "Μεξικό",
        flag: "mx",
        lat: 23.6, lng: -102.5,
        stats: [
            { value: "12.900.000", label: "ΠΛΗΘΥΣΜΟΣ" },
            { value: "14,9", label: "ΦΟΡΕΣ Η ΕΛΛΑΔΑ ΣΕ ΕΚΤΑΣΗ" },
            { value: "1996", label: "ΠΡΩΤΗ ΧΡΟΝΙΑ ΠΑΡΟΥΣΙΑΣ" }
        ],
        images: [
            { src: "images/mexiko/photo_1.jpg", title: "Κυριακή της Ορθοδοξίας" },
            { src: "images/mexiko/photo_2.jpg", title: "Ιεραποστολή στους Αζτέκους" },
            { src: "images/mexiko/photo_3.jpg", title: "Άγιος Νικόλαος" },
            { src: "images/mexiko/photo_4.jpg", title: "Ιεραποστολή Μεξικό" }
        ]
    },
    {
        name: "Ταϊβάν",
        flag: "tw",
        lat: 23.7, lng: 121.0,
        stats: [
            { value: "23.590.744", label: "ΠΛΗΘΥΣΜΟΣ" },
            { value: "1", label: "ΝΑΟΙ" },
            { value: "4,3", label: "ΦΟΡΕΣ Η ΚΡΗΤΗ ΣΕ ΕΚΤΑΣΗ" },
            { value: "1", label: "ΙΕΡΕΙΣ" },
            { value: "2001", label: "ΠΡΩΤΗ ΧΡΟΝΙΑ ΠΑΡΟΥΣΙΑΣ" }
        ],
        images: [
            { src: "images/taivan/photo_1.jpg", title: "π. Ιωνάς - Ιεραπόστολος στην Ταϊβάν" },
            { src: "images/taivan/photo_2.jpg", title: "Γάμος" },
            { src: "images/taivan/photo_3.jpg", title: "Ιερός Ναός Αγίας Τριάδος" },
            { src: "images/taivan/photo_4.jpg", title: "Ιεραποστολή Ταϊβάν" }
        ]
    },
    {
        name: "Σιέρα Λεόνε",
        flag: "sl",
        lat: 8.5, lng: -11.8,
        stats: [
            { value: "7.883.123", label: "ΠΛΗΘΥΣΜΟΣ" },
            { value: "2.000", label: "ΧΡΙΣΤΙΑΝΟΙ" },
            { value: "3,3", label: "ΦΟΡΕΣ Η ΠΕΛΟΠΟΝΝΗΣΟΣ ΣΕ ΕΚΤΑΣΗ" },
            { value: "2012", label: "ΠΡΩΤΗ ΧΡΟΝΙΑ ΠΑΡΟΥΣΙΑΣ" }
        ],
        images: [
            { src: "images/siera_leone/photo_1.jpg", title: "π. Θεμιστοκλής - Ιεραπόστολος" },
            { src: "images/siera_leone/photo_2.jpg", title: "Βάπτιση" },
            { src: "images/siera_leone/photo_3.jpg", title: "Καταπολέμηση του ιού Ebola" },
            { src: "images/siera_leone/photo_4.jpg", title: "Ιεραποστολή Σιέρα Λεόνε" }
        ]
    },
    {
        name: "Γουατεμάλα",
        flag: "gt",
        lat: 15.8, lng: -90.2,
        stats: [
            { value: "17.680.000", label: "ΠΛΗΘΥΣΜΟΣ" },
            { value: "1", label: "ΦΟΡΕΣ Η ΕΛΛΑΔΑ ΣΕ ΕΚΤΑΣΗ" }
        ],
        images: [
            { src: "images/goyatemala/photo_1.jpg", title: "Ορθόδοξη Εκκλησία" },
            { src: "images/goyatemala/photo_2.jpg", title: "Βάπτιση" },
            { src: "images/goyatemala/photo_3.jpg", title: "Κυριακή Βαΐων" },
            { src: "images/goyatemala/photo_4.jpg", title: "Ιεραποστολή Γουατεμάλα" }
        ]
    },
    {
        name: "Καμερούν",
        flag: "cm",
        lat: 7.4, lng: 12.4,
        stats: [
            { value: "26.500.000", label: "ΠΛΗΘΥΣΜΟΣ" },
            { value: "42", label: "ΕΝΟΡΙΕΣ" },
            { value: "4", label: "ΦΟΡΕΣ Η ΕΛΛΑΔΑ ΣΕ ΕΚΤΑΣΗ" }
        ],
        images: [
            { src: "images/kameroyn/photo_1.jpg", title: "Σχολείο" },
            { src: "images/kameroyn/photo_2.jpg", title: "Θεία Λειτουργία" },
            { src: "images/kameroyn/photo_3.jpg", title: "Κατήχηση εντός Ιερού Ναού" },
            { src: "images/kameroyn/photo_4.jpg", title: "Ιεραποστολή Καμερούν" }
        ]
    },
    {
        name: "Ζαΐρ",
        flag: "cd",
        lat: -4.0, lng: 21.8,
        stats: [],
        images: [
            { src: "images/zair/photo_1.jpg", title: "Βάπτιση π. Κοσμάς" },
            { src: "images/zair/photo_2.jpg", title: "Ιερός Ναός" },
            { src: "images/zair/photo_3.jpg", title: "Θεία Λειτουργία" },
            { src: "images/zair/photo_4.jpg", title: "Ιεραποστολή Ζαΐρ" }
        ]
    },
    {
        name: "Κονγκό",
        flag: "cg",
        lat: -4.3, lng: 15.3,
        stats: [
            { value: "5.542.197", label: "ΠΛΗΘΥΣΜΟΣ" },
            { value: "8", label: "ΝΑΟΙ" },
            { value: "5", label: "ΕΝΟΡΙΕΣ" },
            { value: "1990", label: "ΠΡΩΤΗ ΧΡΟΝΙΑ ΠΑΡΟΥΣΙΑΣ" },
            { value: "2,5", label: "ΦΟΡΕΣ Η ΕΛΛΑΔΑ ΣΕ ΕΚΤΑΣΗ" }
        ],
        images: [
            { src: "images/kongko/photo_1.jpg", title: "Βάπτιση" },
            { src: "images/kongko/photo_2.jpg", title: "Θεία Λειτουργία" },
            { src: "images/kongko/photo_3.jpg", title: "Θεία Κοινωνία" },
            { src: "images/kongko/photo_4.jpg", title: "Ιεραποστολή Κονγκό" }
        ]
    },
    {
        name: "Ουγκάντα",
        flag: "ug",
        lat: 1.4, lng: 32.3,
        stats: [],
        images: [
            { src: "images/oygkanta/photo_1.jpg", title: "Καλύβα-Πρεσβυτέριο" },
            { src: "images/oygkanta/photo_2.jpg", title: "Θεία Λειτουργία" },
            { src: "images/oygkanta/photo_3.jpg", title: "π. Χρυσόστομος - Βάπτιση" },
            { src: "images/oygkanta/photo_4.jpg", title: "Ιεραποστολή Ουγκάντα" }
        ]
    },
    {
        name: "Τανζανία",
        flag: "tz",
        lat: -6.4, lng: 34.9,
        stats: [
            { value: "55.890.000", label: "ΠΛΗΘΥΣΜΟΣ" },
            { value: "85.000", label: "ΧΡΙΣΤΙΑΝΟΙ" },
            { value: "7,2", label: "ΦΟΡΕΣ Η ΠΕΛΟΠΟΝΝΗΣΟΣ ΣΕ ΕΚΤΑΣΗ" },
            { value: "133", label: "ΝΑΟΙ" }
        ],
        images: [
            { src: "images/tanzania/photo_1.jpg", title: "Θεοφάνεια - ρίψη τιμίου Σταυρού" },
            { src: "images/tanzania/photo_2.jpg", title: "Ομαδική Βάπτιση" },
            { src: "images/tanzania/photo_3.jpg", title: "Ιεραπόστολος με παιδιά" },
            { src: "images/tanzania/photo_4.png", title: "Ιεραποστολή Τανζανία" }
        ]
    },
    {
        name: "Κένυα",
        flag: "ke",
        lat: -0.02, lng: 37.9,
        stats: [
            { value: "52.214.791", label: "ΠΛΗΘΥΣΜΟΣ" },
            { value: "300", label: "ΝΑΟΙ" },
            { value: "300", label: "ΕΝΟΡΙΕΣ" },
            { value: "1940", label: "ΠΡΩΤΗ ΧΡΟΝΙΑ ΠΑΡΟΥΣΙΑΣ" },
            { value: "4,4", label: "ΦΟΡΕΣ Η ΕΛΛΑΔΑ ΣΕ ΕΚΤΑΣΗ" },
            { value: "750.000", label: "ΧΡΙΣΤΙΑΝΟΙ" }
        ],
        images: [
            { src: "images/kenya/photo_1.jpg", title: "Λιτανεία" },
            { src: "images/kenya/photo_2.jpg", title: "Ιερός Ναός & Σχολείο" },
            { src: "images/kenya/photo_3.jpg", title: "Παιδιά στην Κένυα" },
            { src: "images/kenya/photo_4.jpg", title: "Ιεραποστολή Κένυα" }
        ]
    },
    {
        name: "Μαδαγασκάρη",
        flag: "mg",
        lat: -18.8, lng: 46.9,
        stats: [
            { value: "26.969.642", label: "ΠΛΗΘΥΣΜΟΣ" },
            { value: "75", label: "ΝΑΟΙ" },
            { value: "120", label: "ΕΝΟΡΙΕΣ" },
            { value: "25.000", label: "ΧΡΙΣΤΙΑΝΟΙ" },
            { value: "4,4", label: "ΦΟΡΕΣ Η ΕΛΛΑΔΑ ΣΕ ΕΚΤΑΣΗ" }
        ],
        images: [
            { src: "images/madagaskari/photo_1.jpg", title: "π. Νεκτάριος Κελλής - πρώτος Ιεραπόστολος" },
            { src: "images/madagaskari/photo_2.jpg", title: "Ορφανοτροφείο" },
            { src: "images/madagaskari/photo_3.jpg", title: "Διανομή νερού στους κατοίκους" },
            { src: "images/madagaskari/photo_4.jpg", title: "Ιεραποστολή Μαδαγασκάρη" }
        ]
    },
    {
        name: "Ινδία",
        flag: "in",
        lat: 20.6, lng: 79.0,
        stats: [
            { value: "1.339.000.000", label: "ΠΛΗΘΥΣΜΟΣ" },
            { value: "10", label: "ΝΑΟΙ" },
            { value: "10", label: "ΕΝΟΡΙΕΣ" },
            { value: "1994", label: "ΠΡΩΤΗ ΧΡΟΝΙΑ ΠΑΡΟΥΣΙΑΣ" },
            { value: "24,9", label: "ΦΟΡΕΣ Η ΕΛΛΑΔΑ ΣΕ ΕΚΤΑΣΗ" },
            { value: "5.000", label: "ΧΡΙΣΤΙΑΝΟΙ" }
        ],
        images: [
            { src: "images/india/photo_1.jpg", title: "Ορφανοτροφείο" },
            { src: "images/india/photo_2.jpg", title: "Ιεραπόστολος περιθάλπει παιδί" },
            { src: "images/india/photo_3.jpg", title: "Αγιασμός" },
            { src: "images/india/photo_4.jpg", title: "Ιεραποστολή Ινδία" }
        ]
    },
    {
        name: "Ινδονησία",
        flag: "id",
        lat: -0.8, lng: 113.9,
        stats: [
            { value: "268.074.600", label: "ΠΛΗΘΥΣΜΟΣ" },
            { value: "15", label: "ΝΑΟΙ" },
            { value: "13", label: "ΕΝΟΡΙΕΣ" },
            { value: "2003", label: "ΠΡΩΤΗ ΧΡΟΝΙΑ ΠΑΡΟΥΣΙΑΣ" },
            { value: "14,4", label: "ΦΟΡΕΣ Η ΕΛΛΑΔΑ ΣΕ ΕΚΤΑΣΗ" },
            { value: "6.000", label: "ΧΡΙΣΤΙΑΝΟΙ" }
        ],
        images: [
            { src: "images/indonisia/photo_1.jpg", title: "Θεία Κοινωνία" },
            { src: "images/indonisia/photo_2.jpg", title: "Σχολείο" },
            { src: "images/indonisia/photo_3.jpg", title: "Βοήθεια στους πληγέντες από το τσουνάμι" },
            { src: "images/indonisia/photo_4.jpg", title: "Ιεραποστολή Ινδονησία" }
        ]
    },
    {
        name: "Νότια Κορέα",
        flag: "kr",
        lat: 35.9, lng: 127.8,
        stats: [
            { value: "51.811.167", label: "ΠΛΗΘΥΣΜΟΣ" },
            { value: "8", label: "ΕΝΟΡΙΕΣ" },
            { value: "1", label: "ΦΟΡΕΣ Η ΕΛΛΑΔΑ ΣΕ ΕΚΤΑΣΗ" },
            { value: "3.500", label: "ΧΡΙΣΤΙΑΝΟΙ" },
            { value: "2010", label: "ΠΡΩΤΗ ΧΡΟΝΙΑ ΠΑΡΟΥΣΙΑΣ" }
        ],
        images: [
            { src: "images/notia_korea/photo_1.jpg", title: "Ιεραπόστολοι μαζί με πιστούς" },
            { src: "images/notia_korea/photo_2.jpg", title: "Κήρυγμα" },
            { src: "images/notia_korea/photo_3.jpg", title: "Προσευχή πριν το φαγητό" },
            { src: "images/notia_korea/photo_4.jpg", title: "Ιεραποστολή Νότια Κορέα" }
        ]
    },
    {
        name: "Αλβανία",
        flag: "al",
        lat: 41.2, lng: 20.2,
        stats: [
            { value: "2.862.427", label: "ΠΛΗΘΥΣΜΟΣ" },
            { value: "792.000", label: "ΧΡΙΣΤΙΑΝΟΙ" },
            { value: "1,4", label: "ΦΟΡΕΣ Η ΠΕΛΟΠΟΝΝΗΣΟΣ ΣΕ ΕΚΤΑΣΗ" },
            { value: "370", label: "ΝΑΟΙ" },
            { value: "460", label: "ΕΝΟΡΙΕΣ" },
            { value: "18", label: "ΑΙΩΝΕΣ ΠΑΡΟΥΣΙΑΣ" }
        ],
        images: [
            { src: "images/alvania/photo_1.jpg", title: "Ναός της Αναστάσεως" },
            { src: "images/alvania/photo_2.jpg", title: "π. Αναστάσιος μαζί με πιστούς" },
            { src: "images/alvania/photo_3.jpg", title: "Κυριακή του Πάσχα" },
            { src: "images/alvania/photo_4.jpg", title: "Ιεραποστολή Αλβανία" }
        ]
    },
    {
        name: "Ιαπωνία",
        flag: "jp",
        lat: 36.2, lng: 138.3,
        stats: [],
        images: [
            { src: "images/iaponia/photo_1.jpg", title: "Θεία λειτουργία" },
            { src: "images/iaponia/photo_2.jpg", title: "Ιεροδιάκονος" },
            { src: "images/iaponia/photo_3.jpg", title: "Ιερός ναός Αγίου Νικολάου" },
            { src: "images/iaponia/photo_4.jpg", title: "Ιεραποστολή Ιαπωνία" }
        ]
    },
    {
        name: "Ζιμπάμπουε",
        flag: "zw",
        lat: -19.0, lng: 29.2,
        stats: [],
        images: [
            { src: "images/zimpampoye/photo_1.jpg", title: "Διανομή Βιβλίων" },
            { src: "images/zimpampoye/photo_2.jpg", title: "Βάπτιση" },
            { src: "images/zimpampoye/photo_3.jpg", title: "Ομαδική Εξομολόγηση" },
            { src: "images/zimpampoye/photo_4.jpg", title: "Ιεραποστολή Ζιμπάμπουε" }
        ]
    },
    {
        name: "Κολομβία",
        flag: "co",
        lat: 4.6, lng: -74.3,
        stats: [],
        images: [
            { src: "images/kolomvia/photo_1.jpg", title: "Μεγάλη Παρασκευή - Επιτάφιος" },
            { src: "images/kolomvia/photo_2.jpg", title: "Βάπτισμα" },
            { src: "images/kolomvia/photo_3.jpg", title: "Κυριακή του Πάσχα" },
            { src: "images/kolomvia/photo_4.jpg", title: "Ιεραποστολή Κολομβία" }
        ]
    },
    {
        name: "Κούβα",
        flag: "cu",
        lat: 21.5, lng: -77.8,
        stats: [],
        images: [
            { src: "images/koyva/photo_1.jpg", title: "Βάπτισμα" },
            { src: "images/koyva/photo_2.jpg", title: "Προσφορά" },
            { src: "images/koyva/photo_3.jpg", title: "Χειροτονία ιερέα" },
            { src: "images/koyva/photo_4.jpg", title: "Ιεραποστολή Κούβα" }
        ]
    },
    {
        name: "Νιγηρία",
        flag: "ng",
        lat: 9.1, lng: 8.7,
        stats: [
            { value: "201.000.000", label: "ΠΛΗΘΥΣΜΟΣ" },
            { value: "7", label: "ΦΟΡΕΣ Η ΕΛΛΑΔΑ ΣΕ ΕΚΤΑΣΗ" },
            { value: "43", label: "ΕΝΟΡΙΕΣ" }
        ],
        images: [
            { src: "images/nigiria/photo_1.jpg", title: "Θεία Λειτουργία" },
            { src: "images/nigiria/photo_2.jpg", title: "Βάπτισμα" },
            { src: "images/nigiria/photo_3.jpg", title: "Σχολείο" },
            { src: "images/nigiria/photo_4.jpg", title: "Ιεραποστολή Νιγηρία" }
        ]
    },
    {
        name: "Ταϋλάνδη",
        flag: "th",
        lat: 15.9, lng: 100.5,
        stats: [],
        images: [
            { src: "images/taylandi/photo_1.jpg", title: "Αγιογράφηση Ναού" },
            { src: "images/taylandi/photo_2.jpg", title: "Θεία Κοινωνία" },
            { src: "images/taylandi/photo_3.jpg", title: "Χριστούγεννα" },
            { src: "images/taylandi/photo_4.jpg", title: "Ιεραποστολή Ταϋλάνδη" }
        ]
    },
    {
        name: "Φιλιππίνες",
        flag: "ph",
        lat: 12.9, lng: 121.8,
        stats: [],
        images: [
            { src: "images/filippines/photo_1.jpg", title: "Κυριακή Σταυροπροσκυνήσεως" },
            { src: "images/filippines/photo_2.jpg", title: "Θεία Κοινωνία" },
            { src: "images/filippines/photo_3.jpg", title: "Θεία Λειτουργία" },
            { src: "images/filippines/photo_4.jpg", title: "Ιεραποστολή Φιλιππίνες" }
        ]
    }
];
