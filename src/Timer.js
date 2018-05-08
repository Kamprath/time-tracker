class Timer {
    constructor(isNew) {
        this.new = isNew || false;
        this.editing = isNew || false;
        this.active = false;
        this.text = null;
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