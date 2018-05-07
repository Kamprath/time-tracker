<template>
    <div :class="timerClass">
        <div class="col control">
            <a class="icon" @click="toggle">
                <i :class="iconClass"></i>
            </a>
        </div>
        <div class="col time">
            <p v-if="!editing">{{ timeString }}</p>
            <p v-else>
                <input type="text"
                       v-model="edit.hours"
                       class="input"
                       @keydown="filterNumericKey"
                       @keyup="filterHours"
                       @keydown.enter="saveEdit"
                       @keydown.esc="toggleEdit"> :
                <input type="text"
                       v-model="edit.minutes"
                       class="input"
                       @keydown.enter="saveEdit"
                       @keydown.esc="toggleEdit"
                       @keydown="filterNumericKey"
                       @keyup="filterMinutes"> :
                <input type="text"
                       v-model="edit.seconds"
                       class="input"
                       @keydown.enter="saveEdit"
                       @keydown.esc="toggleEdit"
                       @keydown="filterNumericKey"
                       @keyup="filterSeconds">
            </p>
        </div>
        <div class="col task">
            <p v-if="!editing">{{ text }}</p>
            <input v-else
                   class="input"
                   type="text"
                   v-model="edit.text"
                   @keyup.enter="saveEdit"
                   @keyup.esc="toggleEdit"
                   autofocus
                   placeholder="Enter a task">
        </div>
        <div class="col has-text-right">
            <p v-if="!editing">
                <a @click="reset" class="icon" title="Reset"><i class="fas fa-redo-alt"></i></a>
                <a @click="toggleEdit" class="icon" title="Edit"><i class="fas fa-edit fa-md"></i></a>
                <a class="delete is-medium" @click="remove" title="Remove"></a>
            </p>
            <p v-else>
                <a class="button is-primary" @click="saveEdit">Save</a>
                <a class="button is-text" @click="toggleEdit">Cancel</a>
            </p>
        </div>
    </div>
</template>

<script>
    import Timer from '../Timer';
    import moment from 'moment';

    export default {
        name: 'Timer.vue',

        props: ['index', 'data'],

        data() {
            return {
                new: this.data.new || false,
                active: this.data.active,
                text: this.data.text,
                seconds: this.data.seconds,
                minutes: this.data.minutes,
                hours: this.data.hours,
                editing: this.data.editing,
                autofocused: true,
                interval: null,
                edit: { hours: '00', minutes: '00', seconds: '00', text: null },
                start: {
                    hours: this.data.start.hours,
                    minutes: this.data.start.minutes,
                    seconds: this.data.start.seconds,
                    time: this.data.start.time ? moment(this.data.start.time) : null
                }
            }
        },

        computed: {
            timerClass() {
                return 'timer' + (this.active ? ' active' : '') + (this.editing ? ' editing' : '');
            },

            iconClass() {
                return 'fas fa-2x fa-' + (this.active ? 'pause' : 'play')
            },

            timeString() {
                return this.format(this.hours) + ':' + this.format(this.minutes) + ':' + this.format(this.seconds);
            }
        },

        methods: {
            toggle() {
                if (this.editing) return;

                if (this.active) {
                    this.stop();
                } else {
                    this.active = true;
                    this.start.time = moment();
                    this.start.hours = this.hours;
                    this.start.minutes = this.minutes;
                    this.start.seconds = this.seconds;
                    this.startTimer();
                }

                this.update();
            },

            startTimer() {
                this.interval = window.setInterval(this.sync, 1000);
            },

            stop() {
                window.clearInterval(this.interval);
                this.start.time = null;
                this.start.hours = this.start.minutes = this.start.seconds = 0;
                this.interval = null;
                this.active = false;
                this.update();
            },

            format(value) {
                let digits = value > 99 ? 3 : 2;
                return ('0' + value).slice(-digits);
            },

            remove(confirm = true) {
                if (!confirm || window.confirm('Remove this timer?')) {
                    this.$emit('remove', this.index);
                }
            },

            update() {
                let timer = new Timer();

                timer.active = this.active;
                timer.hours = this.hours;
                timer.minutes = this.minutes;
                timer.seconds = this.seconds;
                timer.start = this.start;
                timer.text = this.text;

                this.$emit('update', this.index, timer);
            },

            toggleEdit() {
                if (this.new) return this.remove(false);

                this.autofocused = false;
                this.editing = !this.editing;

                this.update();

                if (!this.editing) return;

                this.stop();

                this.edit.text = this.text;
                this.edit.hours = this.format(this.hours);
                this.edit.minutes = this.format(this.minutes);
                this.edit.seconds = this.format(this.seconds);
            },

            saveEdit() {
                this.new = false;
                this.text = this.edit.text;
                this.hours = Number.parseInt(this.edit.hours);
                this.minutes = Number.parseInt(this.edit.minutes);
                this.seconds = Number.parseInt(this.edit.seconds);

                this.toggleEdit();
            },

            /**
             * Stop event when a non-numeric key is pressed (excludes esc, space, etc.)
             * @param {Event} e
             */
            filterNumericKey(e) {
                let keyCode = e.keyCode || e.which;
                if (keyCode >= 96 && keyCode <= 105) keyCode -= 48;
                const char = String.fromCharCode(keyCode);
                const validKeys = [8, 27, 37, 38, 39, 40];

                if ((isNaN(char - 0) && validKeys.indexOf(keyCode) < 0) || keyCode === 32) e.preventDefault();
            },

            filterHours(e) {
                this.edit.hours = this.filterTimeInput(e, 999);
            },

            filterMinutes(e) {
                this.edit.minutes = this.filterTimeInput(e);
            },

            filterSeconds(e) {
                this.edit.seconds = this.filterTimeInput(e);
            },

            filterTimeInput(e, limit = 59) {
                const value = Number.parseInt(e.target.value) || 0;

                return this.format(
                    value > limit ? limit : value
                );
            },

            reset() {
                this.stop();
                this.hours = this.minutes = this.seconds = 0;
                this.update();
            },

            sync() {
                let duration = moment.duration(
                    (moment()).diff(this.start.time)
                );

                duration.add(this.start.hours, 'hours')
                    .add(this.start.minutes, 'minutes')
                    .add(this.start.seconds, 'seconds');

                this.hours = (duration.days() * 24) + duration.hours();
                this.minutes = duration.minutes();
                this.seconds = duration.seconds();
            }
        },

        updated() {
            const $autofocus = this.$el.querySelector('[autofocus]');

            if (!$autofocus || this.autofocused) return;

            $autofocus.focus();
            this.autofocused = true;
        },

        created() {
            if (this.active) {
                this.sync();
                this.startTimer();
            }
        }
    }
</script>

<style lang="less">
    .timer {
        display: flex;
        padding: 1em;
        font-size: 1.3em;
        border-bottom: 1px solid #eee;
        background-color: white;
        &.active {
            background-color: hsl(171, 100%, 41%);
            color: white;
        }
    }
    .icon {
        color: rgba(0,0,0,.35);
        transition: color 75ms linear;
    }
    .col {
        flex: 1 1 auto;
    }
    .control {
        flex-grow: 0;
        flex-basis: 3em;
        text-align: center;
    }
    .control a {
        width: 100%;
        text-align: right;
        display: block;
    }
    .editing .control {
        display: none;
    }
    .col p a {
        vertical-align: middle;
    }
    .task {
        font-size: .85em;
    }
    .task p {
        display: inline;
        vertical-align: middle;
        line-height: 1.85em;
    }
    .time {
        flex-basis: 9em;
        flex-grow: 0;
        text-align: center;
        font-weight: 600;
        color: hsl(171, 100%, 41%);
    }
    .active .time {
        color: white;
    }
    .time .input {
        display: inline;
        width: 2em;
        padding: 0;
        text-align: center;
    }
</style>