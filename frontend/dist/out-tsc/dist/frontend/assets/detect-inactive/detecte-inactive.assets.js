// TimeoutId del user,
var timeoutID;
// Inicias el detecte
export function initDetecteInactive() {
    setup();
}
// Configuracion de escucha.
function setup() {
    window.addEventListener("mousemove", resetTimer, false);
    window.addEventListener("mousedown", resetTimer, false);
    window.addEventListener("keypress", resetTimer, false);
    window.addEventListener("DOMMouseScroll", resetTimer, false);
    window.addEventListener("mousewheel", resetTimer, false);
    window.addEventListener("touchmove", resetTimer, false);
    window.addEventListener("MSPointerMove", resetTimer, false);
    // iNICIA EL TEMPORIZADOR.
    startTimer();
}
function startTimer() {
    // Capturamos el id
    // wait 2 seconds before calling goInactive
    timeoutID = window.setTimeout(goInactive, 1000 * 30);
}
// Resetemos el tiempo.
function resetTimer(e) {
    // Borramos los timeout
    window.clearTimeout(timeoutID);
    // Volvemos activarlo.
    goActive();
}
// Inactivo
function goInactive() {
    // do something
    // alert("inactivo");
    // window.location.reload();
    alert('INACTIVO MUCHO TIEMPO');
    resetTimer(event);
}
// Volver activar el timeout
function goActive() {
    // do something
    startTimer();
}
//# sourceMappingURL=detecte-inactive.assets.js.map