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
    import TimerContract from './Timer';
    import Timer from './components/Timer';
    import favicon from './favicon';

    // load CSS libraries via Webpack
    import bulma from 'bulma';
    import fontawesome from './styles/fontawesome.css';

    export default {
        name: 'App',

        components: { Timer },

        data() {
            return {
                timers: JSON.parse(window.localStorage.timers || '[]')
            }
        },

        methods: {
            /**
             * Add a new timer instance
             */
            addTimer() {
                this.timers.push(new TimerContract(true));
                this.save();
            },

            /**
             * Save data to localStorage
             */
            save() {
                window.localStorage.timers = JSON.stringify(this.timers);
            },

            /**
             * Update saved timer data
             * @param {number} index        Array index of object to update in localStorage
             * @param {TimerContract} timer The instance to save
             */
            updateTimer(index, timer) {
                this.timers[index] = timer;
                this.save();
                this.updateFavicon();
            },

            /**
             * Remove a timer
             * @param {number} index    Array index of object to update in localStorage
             */
            removeTimer(index) {
                this.timers.splice(index, 1);
                this.save();
            },

            /**
             * Focus last element with a [autofocus] attribute
             */
            autofocus() {
                const elements = document.querySelectorAll('[autofocus]');

                if (!elements.length) return;

                elements[elements.length - 1].focus();
            },

            /**
             * Update favicon to indicate timer status
             */
            updateFavicon() {
                for (let i = 0; i < this.timers.length; i++) {
                    if (this.timers[i].active) {
                        return favicon('/static/favicon-play.ico');
                    }
                }

                favicon('/static/favicon.ico');

            }
        },

        updated() {
            // autofocus last input because document does not re-render
            this.autofocus();
        }
    }
</script>

<style lang="less">
    body, html {
        background-color: #fafafa;
        height: 100%;
    }
</style>
