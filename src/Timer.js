class Timer {
    constructor(text) {
        this.active = false;
        this.editing = false;
        this.text = text || null;
        this.seconds = this.minutes = this.hours = 0;
        this.start = {
            time: null,
            hours: 0,
            minutes: 0,
            seconds: 0
        };
    }
}

export default Timer;