function createADSR(ctx, param) {
    return {
        attack: 0.1,
        decay: 0.2,
        sustain: 0.7,
        release: 0.3,

        trigger(value) {
            const now = ctx.currentTime;

            param.cancelScheduledValues(now);

            // Attack
            param.setValueAtTime(0, now);
            param.linearRampToValueAtTime(value, now + this.attack);

            // Decay → sustain
            param.linearRampToValueAtTime(
                value * this.sustain,
                now + this.attack + this.decay
            );
        },

        releaseEnvelope() {
            const now = ctx.currentTime;

            param.cancelScheduledValues(now);

            param.setValueAtTime(param.value, now);
            param.linearRampToValueAtTime(0, now + this.release);
        }
    };
}