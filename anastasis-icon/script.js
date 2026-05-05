const POINTS = [
    {
        id: 'christ',
        title: 'Ο Χριστός στο κέντρο της δόξας',
        short: 'Το κέντρο της σύνθεσης και η νίκη πάνω στον θάνατο.',
        description: 'Η εστίαση πηγαίνει στο κέντρο της σύνθεσης, όπου ο Χριστός εικονίζεται μέσα στη δόξα, φωτισμένος και νικητής επί του Άδη.',
        detail: 'Κεντρικός άξονας της εικόνας',
        x: 0.498,
        y: 0.166,
        zoom: 2.2
    },
    {
        id: 'adam',
        title: 'Ο Αδάμ',
        short: 'Ο Χριστός ανασύρει τον Αδάμ από τον τάφο.',
        description: 'Η λεπτομέρεια δείχνει τον Αδάμ να ανασύρεται από τον τάφο, υπογραμμίζοντας την καθολικότητα της σωτηρίας του ανθρώπου.',
        detail: 'Αριστερό κάτω τμήμα του κέντρου',
        x: 0.368,
        y: 0.4903,
        zoom: 2.65
    },
    {
        id: 'eve',
        title: 'Η Εύα',
        short: 'Η Εύα απαντά στην κίνηση της σωτηρίας.',
        description: 'Στη δεξιά πλευρά ο Χριστός αρπάζει και την Εύα από τον τάφο, παρουσιάζοντας τη λύτρωση ολόκληρου του ανθρωπίνου γένους.',
        detail: 'Δεξιό κάτω τμήμα του κέντρου',
        x: 0.618,
        y: 0.464,
        zoom: 2.65
    },
    {
        id: 'kings',
        title: 'Οι βασιλείς Δαβίδ και Σολομών',
        short: 'Οι δίκαιοι της Παλαιάς Διαθήκης περιμένουν την Ανάσταση.',
        description: 'Η ομάδα στα αριστερά, με βασιλικά ενδύματα και στέμματα, αποδίδεται ως οι δίκαιοι της Παλαιάς Διαθήκης που αναμένουν τον Χριστό.',
        detail: 'Αριστερή μεσαία ομάδα μορφών',
        x: 0.303,
        y: 0.2943,
        zoom: 2.45
    },
    {
        id: 'forerunner',
        title: 'Ο Τίμιος Πρόδρομος',
        short: 'Ο Ιωάννης ο Πρόδρομος ξεχωρίζει πίσω από τους δικαίους.',
        description: 'Πίσω από τις βασιλικές μορφές διακρίνεται ο Τίμιος Πρόδρομος, που προαναγγέλλει και στον Άδη την έλευση του Χριστού.',
        detail: 'Προφητική μορφή πίσω από τους δικαίους',
        x: 0.378,
        y: 0.2173,
        zoom: 2.7
    },
    {
        id: 'right-righteous',
        title: 'Οι δίκαιοι στη δεξιά πλευρά',
        short: 'Οι μορφές που υποδέχονται το γεγονός της Αναστάσεως.',
        description: 'Στη δεξιά ομάδα της εικόνας φαίνονται επιπλέον δίκαιοι και προφήτες που συμμετέχουν οπτικά στο γεγονός της καθόδου στον Άδη.',
        detail: 'Δεξιά μεσαία ομάδα μορφών',
        x: 0.686,
        y: 0.2753,
        zoom: 2.45
    },
    {
        id: 'myrrhbearers',
        title: 'Οι Μυροφόρες και ο άγγελος',
        short: 'Η αριστερή χαμηλή σκηνή με τις γυναικείες μορφές και τον άγγελο.',
        description: 'Στο αριστερό χαμηλό μέρος της εικόνας, οι Μυροφόρες και ο άγγελος θυμίζουν την ευαγγελική μαρτυρία του κενού μνημείου.',
        detail: 'Αριστερή χαμηλή σκηνή',
        x: 0.13,
        y: 0.507,
        zoom: 2.5
    },
    {
        id: 'cross-gates',
        title: 'Ο Σταυρός και οι συντριμμένες πύλες',
        short: 'Τα σπασμένα φύλλα των πυλών κάτω από τα πόδια του Χριστού.',
        description: 'Η εστίαση δείχνει τον Χριστό να πατά επάνω στις συντριμμένες πύλες του Άδη, σύμβολο της οριστικής κατάργησης της εξουσίας του θανάτου.',
        detail: 'Κάτω από την κεντρική μορφή',
        x: 0.501,
        y: 0.728,
        zoom: 2.55
    },
    {
        id: 'hades',
        title: 'Ο δεμένος Άδης και τα κλειδιά',
        short: 'Ο πεσμένος Άδης ανάμεσα στα σπασμένα κλειδιά και δεσμά.',
        description: 'Στο χαμηλό κέντρο διακρίνεται η μορφή του δεμένου Άδη, περιστοιχισμένη από σπασμένα κλειδιά και εργαλεία, ως σημείο της συντριβής του θανάτου.',
        detail: 'Κάτω κεντρικό τμήμα',
        x: 0.502,
        y: 0.861,
        zoom: 2.95
    },
    {
        id: 'guards',
        title: 'Οι κοιμώμενοι φρουροί',
        short: 'Η δεξιά χαμηλή λεπτομέρεια με τους πεσμένους φρουρούς.',
        description: 'Στη δεξιά χαμηλή πλευρά της σύνθεσης, οι πεσμένοι φρουροί συμπληρώνουν τη δραματικότητα της σκηνής και την αδυναμία της ανθρώπινης ισχύος μπροστά στην Ανάσταση.',
        detail: 'Δεξιά χαμηλή λεπτομέρεια',
        x: 0.873,
        y: 0.569,
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
const imageEl = document.getElementById('anastasis-image');
const resetViewButton = document.getElementById('reset-view');

let activePointId = null;
const view = {
    x: 0,
    y: 0,
    scale: 1
};
const pointers = new Map();
let dragStart = null;
let pinchStart = null;
let didDrag = false;
let ignoreNextFrameClick = false;

const MIN_SCALE = 1;
const MAX_SCALE = 4;

function init() {
    renderPins();
    resetView(false);
    requestLandscapeLock();

    resetViewButton?.addEventListener('click', () => resetView(true));
    closeModalButton.addEventListener('click', event => {
        event.stopPropagation();
        resetView(true);
    });
    imageFrameEl.addEventListener('click', event => {
        if (event.target.closest('.image-pin')) {
            return;
        }
        if (ignoreNextFrameClick) {
            ignoreNextFrameClick = false;
            return;
        }
        resetView(true);
    });
    window.addEventListener('resize', () => {
        if (!activePointId) {
            clampView();
            applyView(false);
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

    ['click', 'touchend'].forEach(eventName => {
        window.addEventListener(eventName, requestLandscapeLock, { once: true, passive: true });
    });

    imageStageEl.addEventListener('pointerdown', handlePointerDown);
    imageStageEl.addEventListener('pointermove', handlePointerMove);
    imageStageEl.addEventListener('pointerup', handlePointerEnd);
    imageStageEl.addEventListener('pointercancel', handlePointerEnd);
    imageStageEl.addEventListener('wheel', handleWheel, { passive: false });

    imageEl.addEventListener('load', () => applyView(false));
}

async function requestLandscapeLock() {
    if (!screen.orientation || typeof screen.orientation.lock !== 'function') {
        return;
    }

    try {
        await screen.orientation.lock('landscape');
    } catch (error) {
        /*
         * Most mobile browsers only allow orientation locks in fullscreen or
         * installed app contexts. CSS still presents this page as landscape.
         */
    }
}

function renderPins() {
    pinsLayerEl.innerHTML = '';

    POINTS.forEach((point, index) => {
        const pin = document.createElement('button');
        pin.type = 'button';
        pin.className = 'image-pin';
        pin.dataset.pointId = point.id;
        pin.title = point.title;
        pin.setAttribute('aria-label', point.title);
        pin.innerHTML = `<span>${index + 1}</span>`;
        pin.addEventListener('click', event => {
            event.stopPropagation();
            focusPoint(point, true);
        });
        pinsLayerEl.appendChild(pin);
    });

    updatePinPositions();
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

    const stageWidth = imageStageEl.clientWidth;
    const stageHeight = imageStageEl.clientHeight;
    const scale = point.zoom;
    const target = getPointStagePosition(point);
    const targetX = target.x;
    const targetY = target.y;
    const pinYOffset = getPhonePinYOffset();

    view.scale = scale;
    view.x = (stageWidth / 2) - (targetX * scale);
    view.y = (stageHeight / 2) - (targetY * scale) - pinYOffset;

    clampView();
    applyView(smooth);
}

function resetView(smooth = true) {
    activePointId = null;
    syncActiveState();
    modalEl.classList.add('hidden');
    titleEl.textContent = 'Η Ανάσταση';
    descriptionEl.textContent = 'Πάτησε ένα pin πάνω στην εικόνα για να μεγεθύνεις σε αυτό το τμήμα της σύνθεσης.';
    detailEl.textContent = 'Οι πληροφορίες εμφανίζονται μόνο όταν επιλέξεις σημείο, όπως και στα άλλα interactive maps.';
    view.x = 0;
    view.y = 0;
    view.scale = MIN_SCALE;
    applyView(smooth);
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

function getPhonePinYOffset() {
    const offset = getComputedStyle(document.documentElement).getPropertyValue('--phone-pin-y-offset');
    return Number.parseFloat(offset) || 0;
}

function getPointStagePosition(point) {
    const stageWidth = imageStageEl.clientWidth;
    const stageHeight = imageStageEl.clientHeight;
    const naturalWidth = imageEl.naturalWidth || 2656;
    const naturalHeight = imageEl.naturalHeight || 1600;
    const normalizedX = point.x > 1 ? point.x / naturalWidth : point.x;
    const normalizedY = point.y > 1 ? point.y / naturalHeight : point.y;

    return {
        x: stageWidth * normalizedX,
        y: stageHeight * normalizedY
    };
}

function updatePinPositions() {
    document.querySelectorAll('.image-pin').forEach(pin => {
        const point = POINTS.find(entry => entry.id === pin.dataset.pointId);
        if (!point) return;

        const position = getPointScreenPosition(point);
        pin.style.left = `${position.x}px`;
        pin.style.top = `${position.y}px`;
    });
}

function getPointScreenPosition(point) {
    const position = getPointStagePosition(point);

    return {
        x: (position.x * view.scale) + view.x,
        y: (position.y * view.scale) + view.y + getPhonePinYOffset()
    };
}

function applyView(smooth = true) {
    imageEl.style.transitionDuration = smooth ? '650ms' : '0ms';
    document.querySelectorAll('.image-pin').forEach(pin => {
        pin.style.transitionDuration = smooth ? '650ms, 650ms, 200ms' : '0ms';
    });
    imageEl.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
    updatePinPositions();
}

function clampView() {
    view.scale = clamp(view.scale, MIN_SCALE, MAX_SCALE);

    const stageWidth = imageStageEl.clientWidth;
    const stageHeight = imageStageEl.clientHeight;
    const scaledWidth = stageWidth * view.scale;
    const scaledHeight = stageHeight * view.scale;

    view.x = scaledWidth <= stageWidth
        ? (stageWidth - scaledWidth) / 2
        : clamp(view.x, stageWidth - scaledWidth, 0);
    view.y = scaledHeight <= stageHeight
        ? (stageHeight - scaledHeight) / 2
        : clamp(view.y, stageHeight - scaledHeight, 0);
}

function handleWheel(event) {
    event.preventDefault();
    activePointId = null;
    syncActiveState();
    modalEl.classList.add('hidden');

    const rect = imageStageEl.getBoundingClientRect();
    const stageX = event.clientX - rect.left;
    const stageY = event.clientY - rect.top;
    const zoomFactor = event.deltaY < 0 ? 1.12 : 0.88;

    zoomAt(stageX, stageY, view.scale * zoomFactor);
}

function zoomAt(stageX, stageY, nextScale) {
    const scale = clamp(nextScale, MIN_SCALE, MAX_SCALE);
    const imageX = (stageX - view.x) / view.scale;
    const imageY = (stageY - view.y) / view.scale;

    view.scale = scale;
    view.x = stageX - (imageX * scale);
    view.y = stageY - (imageY * scale);
    clampView();
    applyView(false);
}

function handlePointerDown(event) {
    if (event.target.closest('.image-pin')) {
        return;
    }

    event.preventDefault();
    imageStageEl.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY
    });
    imageStageEl.classList.add('is-dragging');
    didDrag = false;

    if (pointers.size === 1) {
        dragStart = {
            pointerId: event.pointerId,
            x: event.clientX,
            y: event.clientY,
            viewX: view.x,
            viewY: view.y
        };
        pinchStart = null;
    } else if (pointers.size === 2) {
        pinchStart = getPinchState();
        dragStart = null;
    }
}

function handlePointerMove(event) {
    if (!pointers.has(event.pointerId)) {
        return;
    }

    event.preventDefault();
    pointers.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY
    });

    if (pointers.size === 1 && dragStart) {
        const dx = event.clientX - dragStart.x;
        const dy = event.clientY - dragStart.y;
        didDrag = didDrag || Math.abs(dx) > 4 || Math.abs(dy) > 4;
        view.x = dragStart.viewX + dx;
        view.y = dragStart.viewY + dy;
        clampView();
        applyView(false);
        return;
    }

    if (pointers.size === 2 && pinchStart) {
        const pinch = getPinchState();
        if (!pinch) return;

        const scale = pinchStart.viewScale * (pinch.distance / pinchStart.distance);
        view.scale = clamp(scale, MIN_SCALE, MAX_SCALE);
        view.x = pinch.centerX - (pinchStart.imageX * view.scale);
        view.y = pinch.centerY - (pinchStart.imageY * view.scale);
        didDrag = true;
        clampView();
        applyView(false);
    }
}

function handlePointerEnd(event) {
    if (pointers.has(event.pointerId)) {
        pointers.delete(event.pointerId);
    }

    if (didDrag) {
        ignoreNextFrameClick = true;
        activePointId = null;
        syncActiveState();
        modalEl.classList.add('hidden');
    }

    if (pointers.size === 0) {
        imageStageEl.classList.remove('is-dragging');
        dragStart = null;
        pinchStart = null;
        didDrag = false;
        return;
    }

    if (pointers.size === 1) {
        const [remaining] = pointers.values();
        dragStart = {
            pointerId: event.pointerId,
            x: remaining.x,
            y: remaining.y,
            viewX: view.x,
            viewY: view.y
        };
        pinchStart = null;
    }
}

function getPinchState() {
    const activePointers = [...pointers.values()];
    if (activePointers.length < 2) {
        return null;
    }

    const rect = imageStageEl.getBoundingClientRect();
    const first = activePointers[0];
    const second = activePointers[1];
    const centerX = ((first.x + second.x) / 2) - rect.left;
    const centerY = ((first.y + second.y) / 2) - rect.top;
    const distance = Math.hypot(first.x - second.x, first.y - second.y);

    return {
        centerX,
        centerY,
        distance,
        viewScale: view.scale,
        imageX: (centerX - view.x) / view.scale,
        imageY: (centerY - view.y) / view.scale
    };
}

init();
