<template>
    <div>
        <timer v-for="(timer, index) in timers"
               :data="timer"
               :index="index"
               @remove="removeTimer"
               @update="updateTimer">
        </timer>

        <section class="section">
            <div class="container has-text-centered">
                <button type="button" class="button is-primary is-outlined is-medium" @click="addTimer">Add a timer</button>
            </div>
        </section>
    </div>
</template>

<script>
    import Timer from './Timer';
    import TimerComponent from './components/Timer';

    // load CSS libraries via Webpack
    import bulma from 'bulma';
    import fontawesome from './styles/fontawesome.css';

    export default {
        name: 'App',

        components: {
            timer: TimerComponent
        },

        data() {
            return {
                timers: JSON.parse(window.localStorage.timers || '[]')
            }
        },

        methods: {
            addTimer() {
                const timer = new Timer();
                timer.editing = true;
                timer.new = true;
                this.timers.push(timer);
                this.save();
            },

            save() {
                window.localStorage.timers = JSON.stringify(this.timers);
            },

            updateTimer(index, timer) {
                this.timers[index] = timer;
                this.save();
            },

            removeTimer(index) {
                this.timers.splice(index, 1);
                this.save();
            }
        },

        updated() {
            const elements = document.querySelectorAll('[autofocus]');

            if (!elements.length) return;

            elements[elements.length - 1].focus();
        }
    }
</script>

<style lang="less">
    body, html {
        background-color: #fafafa;
        height: 100%;
    }
</style>
