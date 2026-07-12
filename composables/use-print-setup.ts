import {dateTimeFormat} from "~/utils/utils";

/*
 * @var printSetupTimer {number|undefined}
 *   Id of the interval timer used to update the date-time printed in the printed page.
 *   Used to turn off the interval timer when the component that calls usePrintSetup() is unmounted.
 */
let printSetupTimer: number | undefined;

/*
 * @var usePrintSetupCount {number} - How many levels of calls to usePrintSetup() have been made on the current page?
 *
 *    Used to make sure that if 2 components on the page call it, when one component is unmounted, the other one will
 *    still be updating the footer on the interval.
 */
let usePrintSetupCount = 0;

export default function usePrintSetup() {
  if (import.meta.client) {

    /*
     * Starts an interval timer that updates date-time that the CSS for print media uses at the bottom of the printed page.
     * Tracks how many times it is called on a given page so that multiple timers are not run if multiple components are
     * rendered on the page that want to be print friendly and use the usePrintSetup() component.
     */
    function printSetupTimerStart() {
      usePrintSetupCount++;
      if (typeof printSetupTimer === "undefined") {
        const dateTime = new Date();
        updatePrintSettings(dateTime);
        // Sync timer to top of the minute.
        const milliSecondsToWait = (60-dateTime.getSeconds())*1000;
        printSetupTimer = window.setTimeout(() => {
          updatePrintSettings(new Date());
          printSetupTimer = window.setInterval(() => {
                updatePrintSettings(new Date());
              },
              60000 // 60 seconds
          )
        }, milliSecondsToWait);
      }
    }

    /*
     * Shuts off the interval timer, taking into account multiple components that have called usePrintSetup() on the
     * current page, using usePrintSetupCount.
     */
    function printSetupTimerEnd() {
      if (typeof printSetupTimer !== "undefined") {
        usePrintSetupCount--;
        if (usePrintSetupCount < 1) {
          window.clearInterval(printSetupTimer);
          printSetupTimer = undefined;
        }
      }
    }

    /**
     * Finds the main @page rule and the @margin rule inside it, and set up the margin content that includes the current
     * datetime.
     *
     * Currently, that is printed in the bottom left margin.  See the @page rule in main.css.
     */
    function updatePrintSettings(datetime: Date) {
      // First, find the MarginRule in the PageRule that has the content property that can be set.
      for (const sheet of document.styleSheets) {
        for (const rule of sheet.cssRules) {
          if (rule instanceof CSSPageRule && typeof rule?.cssRules !== 'undefined') {
            for (const subRule of rule.cssRules) {
              // Currently the @bottom-left margin rule is where the "Printed on" content property is set.
              // That is defined in the main.css file.
              //@ts-ignore
              if (subRule instanceof CSSMarginRule && subRule.name === 'bottom-left' && typeof subRule.style !== 'undefined') {
                const footer = `"Printed on ${dateTimeFormat(datetime)}"`;
                // @ts-ignore
                subRule.style.setProperty('content', footer)
              }
            }
          }
        }
      }
    }

    onMounted(
        /**
         * Add `hide-not-to-be-printed` class to body to trigger printing only the character sheet,
         *   and start updating the footer.
         *
         * The `hide-not-to-be-printed` class on the body should be used in the selector of any
         *   given Vue.js component that contains elements that shouldn't be printed, or should be
         *   printed with different styling.
         *
         * EX1: From app.vue, don't show the header, footer, or nav components on the printed page.
         *
         *    ```css
         *    @media print {
         *      body.hide-not-to-be-printed #app > header,
         *      body.hide-not-to-be-printed #app > footer,
         *      body.hide-not-to-be-printed #app > nav
         *      {
         *        display: none;
         *      }
         * }
         *    ```
         * EX 2: From main.css, turns off box shadow, border radius and background for the main app.
         *
         *    ```css
         *    @media print {
         *      body.hide-not-to-be-printed #app {
         *        box-shadow: none;
         *        border-radius: 0;
         *        background: revert;
         *      }
         *    }
         *    ```
         *
         * EX 3: From trait-list.vue, hide the skill list format selector.
         *
         *    ```css
         *    @media print {
         *      body.hide-not-to-be-printed select.trait-type-view-selector {
         *        display: none;
         *      }
         *    }
         *    ```
         */
        () => {
          document.querySelector('body')?.classList.add('hide-not-to-be-printed');
          printSetupTimerStart();
        })

    onBeforeUnmount(
        /**
         * Remove `hide-not-to-be-printed` class on body so that other pages print the full page,
         * and stop updating the datetime.
         */
        () => {
          document.querySelector('body')?.classList.remove('hide-not-to-be-printed')
          printSetupTimerEnd();
        })
  }
}