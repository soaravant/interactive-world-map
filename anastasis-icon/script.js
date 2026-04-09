const POINTS = [
    {
        id: 'christ',
        title: 'Ο Χριστός στο κέντρο της δόξας',
        short: 'Το κέντρο της σύνθεσης και η νίκη πάνω στον θάνατο.',
        description: 'Η εστίαση πηγαίνει στο κέντρο της σύνθεσης, όπου ο Χριστός εικονίζεται μέσα στη δόξα, φωτισμένος και νικητής επί του Άδη.',
        detail: 'Κεντρικός άξονας της εικόνας',
        x: 0.49,
        y: 0.35,
        zoom: 2.2
    },
    {
        id: 'adam',
        title: 'Ο Αδάμ',
        short: 'Ο Χριστός ανασύρει τον Αδάμ από τον τάφο.',
        description: 'Η λεπτομέρεια δείχνει τον Αδάμ να ανασύρεται από τον τάφο, υπογραμμίζοντας την καθολικότητα της σωτηρίας του ανθρώπου.',
        detail: 'Αριστερό κάτω τμήμα του κέντρου',
        x: 0.43,
        y: 0.62,
        zoom: 2.65
    },
    {
        id: 'eve',
        title: 'Η Εύα',
        short: 'Η Εύα απαντά στην κίνηση της σωτηρίας.',
        description: 'Στη δεξιά πλευρά ο Χριστός αρπάζει και την Εύα από τον τάφο, παρουσιάζοντας τη λύτρωση ολόκληρου του ανθρωπίνου γένους.',
        detail: 'Δεξιό κάτω τμήμα του κέντρου',
        x: 0.67,
        y: 0.62,
        zoom: 2.65
    },
    {
        id: 'kings',
        title: 'Οι βασιλείς Δαβίδ και Σολομών',
        short: 'Οι δίκαιοι της Παλαιάς Διαθήκης περιμένουν την Ανάσταση.',
        description: 'Η ομάδα στα αριστερά, με βασιλικά ενδύματα και στέμματα, αποδίδεται ως οι δίκαιοι της Παλαιάς Διαθήκης που αναμένουν τον Χριστό.',
        detail: 'Αριστερή μεσαία ομάδα μορφών',
        x: 0.31,
        y: 0.46,
        zoom: 2.45
    },
    {
        id: 'forerunner',
        title: 'Ο Τίμιος Πρόδρομος',
        short: 'Ο Ιωάννης ο Πρόδρομος ξεχωρίζει πίσω από τους δικαίους.',
        description: 'Πίσω από τις βασιλικές μορφές διακρίνεται ο Τίμιος Πρόδρομος, που προαναγγέλλει και στον Άδη την έλευση του Χριστού.',
        detail: 'Προφητική μορφή πίσω από τους δικαίους',
        x: 0.39,
        y: 0.31,
        zoom: 2.7
    },
    {
        id: 'right-righteous',
        title: 'Οι δίκαιοι στη δεξιά πλευρά',
        short: 'Οι μορφές που υποδέχονται το γεγονός της Αναστάσεως.',
        description: 'Στη δεξιά ομάδα της εικόνας φαίνονται επιπλέον δίκαιοι και προφήτες που συμμετέχουν οπτικά στο γεγονός της καθόδου στον Άδη.',
        detail: 'Δεξιά μεσαία ομάδα μορφών',
        x: 0.72,
        y: 0.47,
        zoom: 2.45
    },
    {
        id: 'myrrhbearers',
        title: 'Οι Μυροφόρες και ο άγγελος',
        short: 'Η αριστερή χαμηλή σκηνή με τις γυναικείες μορφές και τον άγγελο.',
        description: 'Στο αριστερό χαμηλό μέρος της εικόνας, οι Μυροφόρες και ο άγγελος θυμίζουν την ευαγγελική μαρτυρία του κενού μνημείου.',
        detail: 'Αριστερή χαμηλή σκηνή',
        x: 0.11,
        y: 0.7,
        zoom: 2.5
    },
    {
        id: 'cross-gates',
        title: 'Ο Σταυρός και οι συντριμμένες πύλες',
        short: 'Τα σπασμένα φύλλα των πυλών κάτω από τα πόδια του Χριστού.',
        description: 'Η εστίαση δείχνει τον Χριστό να πατά επάνω στις συντριμμένες πύλες του Άδη, σύμβολο της οριστικής κατάργησης της εξουσίας του θανάτου.',
        detail: 'Κάτω από την κεντρική μορφή',
        x: 0.5,
        y: 0.75,
        zoom: 2.55
    },
    {
        id: 'hades',
        title: 'Ο δεμένος Άδης και τα κλειδιά',
        short: 'Ο πεσμένος Άδης ανάμεσα στα σπασμένα κλειδιά και δεσμά.',
        description: 'Στο χαμηλό κέντρο διακρίνεται η μορφή του δεμένου Άδη, περιστοιχισμένη από σπασμένα κλειδιά και εργαλεία, ως σημείο της συντριβής του θανάτου.',
        detail: 'Κάτω κεντρικό τμήμα',
        x: 0.51,
        y: 0.94,
        zoom: 2.95
    },
    {
        id: 'guards',
        title: 'Οι κοιμώμενοι φρουροί',
        short: 'Η δεξιά χαμηλή λεπτομέρεια με τους πεσμένους φρουρούς.',
        description: 'Στη δεξιά χαμηλή πλευρά της σύνθεσης, οι πεσμένοι φρουροί συμπληρώνουν τη δραματικότητα της σκηνής και την αδυναμία της ανθρώπινης ισχύος μπροστά στην Ανάσταση.',
        detail: 'Δεξιά χαμηλή λεπτομέρεια',
        x: 0.89,
        y: 0.79,
        zoom: 2.7
    }
];

const titleEl = document.getElementById('pin-title');
const descriptionEl = document.getElementById('pin-description');
const detailEl = document.getElementById('pin-detail');
const modalEl = document.getElementById('info-modal');
const closeModalButton = document.getElementById('close-modal');
const pinsLayerEl = document.getElementById('pins-layer');
const imageFrameEl = document.getElementById('image-frame');
const imageStageEl = document.getElementById('image-stage');
const resetViewButton = document.getElementById('reset-view');

let activePointId = null;

function init() {
    renderPins();
    resetView(false);

    resetViewButton.addEventListener('click', () => resetView(true));
    closeModalButton.addEventListener('click', event => {
        event.stopPropagation();
        resetView(true);
    });
    imageFrameEl.addEventListener('click', event => {
        if (event.target.closest('.image-pin')) {
            return;
        }
        resetView(true);
    });
    window.addEventListener('resize', () => {
        if (!activePointId) {
            resetView(false);
            return;
        }
        const point = POINTS.find(entry => entry.id === activePointId);
        if (point) focusPoint(point, false);
    });

    window.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            resetView(true);
        }
    });
}

function renderPins() {
    pinsLayerEl.innerHTML = '';

    POINTS.forEach((point, index) => {
        const pin = document.createElement('button');
        pin.type = 'button';
        pin.className = 'image-pin';
        pin.dataset.pointId = point.id;
        pin.style.left = `${point.x * 100}%`;
        pin.style.top = `${point.y * 100}%`;
        pin.title = point.title;
        pin.setAttribute('aria-label', point.title);
        pin.innerHTML = `<span>${index + 1}</span>`;
        pin.addEventListener('click', event => {
            event.stopPropagation();
            focusPoint(point, true);
        });
        pinsLayerEl.appendChild(pin);
    });
}

function focusPoint(point, smooth = true) {
    if (activePointId === point.id) {
        resetView(smooth);
        return;
    }

    activePointId = point.id;
    syncActiveState();
    updateInfo(point);
    modalEl.classList.remove('hidden');

    const frameWidth = imageStageEl.clientWidth;
    const frameHeight = imageStageEl.clientHeight;
    const scale = point.zoom;
    const targetX = frameWidth * point.x;
    const targetY = frameHeight * point.y;

    const minTranslateX = frameWidth - (frameWidth * scale);
    const minTranslateY = frameHeight - (frameHeight * scale);

    const translateX = clamp((frameWidth / 2) - (targetX * scale), minTranslateX, 0);
    const translateY = clamp((frameHeight / 2) - (targetY * scale), minTranslateY, 0);

    imageStageEl.style.transitionDuration = smooth ? '650ms' : '0ms';
    imageStageEl.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}

function resetView(smooth = true) {
    activePointId = null;
    syncActiveState();
    modalEl.classList.add('hidden');
    titleEl.textContent = 'Η Ανάσταση';
    descriptionEl.textContent = 'Πάτησε ένα pin πάνω στην εικόνα για να μεγεθύνεις σε αυτό το τμήμα της σύνθεσης.';
    detailEl.textContent = 'Οι πληροφορίες εμφανίζονται μόνο όταν επιλέξεις σημείο, όπως και στα άλλα interactive maps.';
    imageStageEl.style.transitionDuration = smooth ? '650ms' : '0ms';
    imageStageEl.style.transform = 'translate(0px, 0px) scale(1)';
}

function updateInfo(point) {
    titleEl.textContent = point.title;
    descriptionEl.textContent = point.description;
    detailEl.textContent = point.detail;
}

function syncActiveState() {
    document.querySelectorAll('.image-pin').forEach(pin => {
        const isActive = pin.dataset.pointId === activePointId;
        pin.classList.toggle('is-active', isActive);
        pin.classList.toggle('is-muted', Boolean(activePointId) && !isActive);
        pin.setAttribute('aria-pressed', String(isActive));
    });
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

init();
