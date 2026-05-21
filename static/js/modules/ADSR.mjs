export function createADSR(ctx, audioParam, options = {}) {

    // Default ADSR values (can be updated later)
    let attack = options.attack ?? 0.01;
    let decay = options.decay ?? 0.2;
    let sustain = options.sustain ?? 0.7;
    let release = options.release ?? 0.3;

    let maxValue = options.maxValue ?? 1;

    let gateOpen = false;

    function now() {
        return ctx.currentTime;
    }

    // ---- Core envelope phases ----

    function trigger(velocity = 1) {
        const t = now();

        audioParam.cancelScheduledValues(t);

        // Start from current value (prevents clicks)
        audioParam.setValueAtTime(audioParam.value, t);

        const peak = velocity * maxValue;

        // Attack
        audioParam.linearRampToValueAtTime(peak, t + attack);

        // Decay → sustain
        audioParam.linearRampToValueAtTime(
            peak * sustain,
            t + attack + decay
        );

        gateOpen = true;
    }

    function gateOn(velocity = 1) {
        trigger(velocity);
    }

    function gateOff() {
        if (!gateOpen) return;

        const t = now();

        audioParam.cancelScheduledValues(t);

        audioParam.setValueAtTime(audioParam.value, t);

        audioParam.linearRampToValueAtTime(0, t + release);

        gateOpen = false;
    }

    function retrigger(velocity = 1) {
        trigger(velocity);
    }

    // ---- Event listeners ----

    function handleTrigger(e) {
        trigger(e.detail?.velocity ?? 1);
    }

    function handleGateOn(e) {
        gateOn(e.detail?.velocity ?? 1);
    }

    function handleGateOff() {
        gateOff();
    }

    function handleRetrigger(e) {
        retrigger(e.detail?.velocity ?? 1);
    }

    function attach(bus = globalThis.synthBus) {
        if (!bus) return;

        bus.addEventListener('trigger', handleTrigger);
        bus.addEventListener('gateOn', handleGateOn);
        bus.addEventListener('gateOff', handleGateOff);
        bus.addEventListener('retrigger', handleRetrigger);
    }

    function detach(bus = globalThis.synthBus) {
        if (!bus) return;

        bus.removeEventListener('trigger', handleTrigger);
        bus.removeEventListener('gateOn', handleGateOn);
        bus.removeEventListener('gateOff', handleGateOff);
        bus.removeEventListener('retrigger', handleRetrigger);
    }

    // ---- Allow runtime config ----

    function setADSR({ a, d, s, r }) {
        if (a !== undefined) attack = a;
        if (d !== undefined) decay = d;
        if (s !== undefined) sustain = s;
        if (r !== undefined) release = r;
    }

    return {
        attach,
        detach,
        setADSR,
        trigger,
        gateOn,
        gateOff
    };
}