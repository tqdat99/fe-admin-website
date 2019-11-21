// DEBOUNCE HELPER


const debounce = (callback, time) => {
    let timeout;

    return function(...args) {
        const fnCall = () => callback.apply(this, args);
        clearTimeout(timeout);
        timeout = setTimeout(fnCall, time);
    };
};

/**
 * Pagination
 *
 * @component
 * @example
 * {
 *   data: {
 *     page: 4,
 *   },
 *   template: `
 *     <app-pagination :length="24" :total-visible="7" v-model="page">
 *       <template #prev-icon>
 *         <i class="fa fa-chevron-left"></i>
 *       </template>
 *       <template #next-icon>
 *         <i class="fa fa-chevron-right"></i>
 *       </template>
 *     </app-pagination>
 *   `,
 * }
 */
const AppPagination = {
    name: 'app-pagination',
    props: {
        // v-model value
        value: {
            type: Number,
            required: true
        },

        length: {
            type: Number,
            default: 0,
            validator: val => val % 1 === 0
        },

        // when number of page buttons exceeds the parent container, 
        // it will truncate the buttons automatically  
        totalVisible: Number,
        disabled: Boolean
    },

    computed: {
        isValueLast() {
            return this.value >= this.length;
        },

        isValueFirst() {
            return this.value <= 1;
        },

        items() {
            const maxLength = this.totalVisible > this.maxButtons ?
                this.maxButtons :
                this.totalVisible || this.maxButtons;

            if (this.length <= maxLength || maxLength < 1) {
                return this.getRange(1, this.length);
            }

            const even = maxLength % 2 === 0 ? 1 : 0;
            const left = Math.floor(maxLength / 2);
            const right = this.length - left + 1 + even;

            if (this.value > left && this.value < right) {
                const start = this.value - left + 2;
                const end = this.value + left - 2 - even;

                return [1, '...', ...this.getRange(start, end), '...', this.length];
            } else
            if (this.value === left) {
                const end = this.value + left - 1 - even;

                return [...this.getRange(1, end), '...', this.length];
            } else
            if (this.value === right) {
                const start = this.value - left + 1;

                return [1, '...', ...this.getRange(start, this.length)];
            } else {
                return [...this.getRange(1, left), '...', ...this.getRange(right, this.length)];
            }
        }
    },


    mounted() {
        this.setMaxButtons();

        window.addEventListener('resize', this.debouncedOnResize);
    },

    beforeDestory() {
        window.removeEventListener('resize', this.debouncedOnResize);
    },

    methods: {
        goNext(e) {
            e.preventDefault();
            var newPage = this.value + 1;

            this.$emit('input', newPage);
            this.$emit('next');

            var path = window.location.href;

            console.log(path);
            tokens = path.split("-");
            newPath = tokens[0] + "-" + tokens[1] + "-" + newPage;
            console.log(newPath);
            window.location.href = newPath;
        },

        goPage(item) {
            //this.$emit('input', item);
            var path = window.location.href;
            console.log(path);
            tokens = path.split("-");
            newPath = tokens[0] + "-" + tokens[1] + "-" + item;
            console.log(newPath);
            window.location.href = newPath;
            //@click = "$emit('input', item)"
        },

        goPrevious(e) {
            e.preventDefault();
            var newPage = this.value - 1;

            this.$emit('input', newPage);
            this.$emit('previous');

            var path = window.location.href;

            console.log(path);
            tokens = path.split("-");
            newPath = tokens[0] + "-" + tokens[1] + "-" + newPage;
            console.log(newPath);
            window.location.href = newPath;
            // onclick = goPage();
        },

        getRange(from, to) {
            const range = [];

            from = from > 0 ? from : 1;

            for (let i = from; i <= to; i++) {
                range.push(i);
            }

            return range;
        },

        setMaxButtons() {
            const containerWidth = this.$el && this.$el.parentElement ?
                this.$el.parentElement.clientWidth :
                window.innerWidth;

            const navButton = this.$refs.navNext.getBoundingClientRect();

            // width of the items considering navItem.height = item.width
            const itemWidth = navButton.height;
            const navItemsWidth = navButton.width * 2;

            this.maxButtons = Math.floor(
                (containerWidth - navItemsWidth) / itemWidth);

        },

        debouncedOnResize: debounce(function() {
            this.setMaxButtons();
        }, 200)
    },


    template: `
          <ul :class="['pagination', { disabled: disabled }]">
              <li ref="navPrev">
                  <button
                      :class="['pagination-navigation', { disabled: isValueFirst }]"
                      v-on="isValueFirst ? {} : { click: goPrevious }"
                  >
                      <slot name="prev-icon">$prev</slot>
                  </button>
              </li>
  
              <li v-for="(item, index) in items" :key="'paging_' + index"> 
                  <span
                      v-if="isNaN(Number(item))"
                      class="pagination-more"
                  >{{ item }}</span>
  
                  <button
                      v-else
                      type="button"
                      :class="['pagination-item', { active: item === value }]"
                      @click = "$emit('input', item)" 
                      click=onPage
                  >{{ item }}</button>

                  
              </li>
  
              <li ref="navNext">
                  <button
                      type="button"
                      :class="['pagination-navigation', { disabled: isValueLast }]"
                      v-on="isValueLast ? {} : { click: goNext }"
                  >
                      <slot name="next-icon">$next</slot>
                  </button>
              </li>
          </ul>
      `
};



new Vue({
    el: '#app',
    data: {
        page: 4,
        length: 24,
        totalVisible: 12,
        containerWidth: 768 // for resizing example
    },
    watch: {
        containerWidth() {
            // trigger pagination resize
            this.$nextTick(() => {
                window.dispatchEvent(new Event('resize'));
            });
        }
    },

    components: {
        AppPagination
    }
});

$('#pagination-demo').twbsPagination({
    totalPages: 16,
    visiblePages: 6,
    next: 'Next',
    prev: 'Prev',
    onPageClick: function(event, page) {
        //fetch content and render here
        $('#page-content').text('Page ' + page) + ' content here';
    }
});

$('.img_holder_id_card')
    // tile mouse actions
    .on('mouseover', function() {
        $(this).children('.photo').css({ 'transform': 'scale(' + $(this).attr('data-scale') + ')' });
    })
    .on('mouseout', function() {
        $(this).children('.photo').css({ 'transform': 'scale(1)' });
    })
    .on('mousemove', function(e) {
        $(this).children('.photo').css({ 'transform-origin': ((e.pageX - $(this).offset().left) / $(this).width()) * 100 + '% ' + ((e.pageY - $(this).offset().top) / $(this).height()) * 100 + '%' });
    })
    // tiles set up
    .each(function() {
        $(this)
            // add a photo container
            .append('<div class="photo"></div>')
            // some text just to show zoom level on current item in this example
            .append('<div class="txt"><div class="x">' + $(this).attr('data-scale') + 'x</div>ZOOM ON<br>HOVER</div>')
            // set up a background image for each tile based on data-image attribute
            .children('.photo').css({ 'background-image': 'url(' + $(this).attr('data-image') + ')' });
    })