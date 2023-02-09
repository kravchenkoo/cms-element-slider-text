import template from './sw-cms-el-image-slider-text.html.twig';
import './sw-cms-el-image-slider-text.scss';
const { Component, Mixin, Filter } = Shopware;

/**
 * @private since v6.5.0
 */
Component.register('sw-cms-el-image-slider-text', {
    template,

    inject: ['feature'],

    mixins: [
        Mixin.getByName('cms-element'),
    ],

    props: {
        activeMedia: {
            type: [Object, null],
            required: false,
            default: null,
        },
    },

    data() {
        return {
            columnCount: 7,
            columnWidth: 90,
            sliderPos: 0,
            imgPath: '/administration/static/img/cms/preview_mountain_large.jpg',
            imgSrc: '',
            bannerImg: '',
            bannerColor: 'ffffff',
        };
    },

    computed: {
        gridAutoRows() {
            return `grid-auto-rows: ${this.columnWidth}`;
        },

        uploadTag() {
            return `cms-element-media-config-${this.element.id}`;
        },

        sliderItems() {
            if (this.element?.config?.sliderItems?.source === 'mapped') {
                return this.getDemoValue(this.element.config.sliderItems.value) || [];
            }

            if (this.element.data && this.element.data.sliderItems && this.element.data.sliderItems.length > 0) {
                return this.element.data.sliderItems;
            }

            return [];
        },

        displayModeClass() {
            if (this.element.config.displayMode.value === 'standard') {
                return null;
            }

            return `is--${this.element.config.displayMode.value}`;
        },

        styles() {
            if (this.element.config.displayMode.value === 'cover' &&
                this.element.config.minHeight.value &&
                this.element.config.minHeight.value !== 0) {
                return {
                    'min-height': this.element.config.minHeight.value,
                };
            }

            return {};
        },

        outsideNavArrows() {
            if (this.element.config.navigationArrows.value === 'outside') {
                return 'has--outside-arrows';
            }

            return null;
        },

        navDotsClass() {
            if (this.element.config.navigationDots.value) {
                return `is--dot-${this.element.config.navigationDots.value}`;
            }

            return null;
        },

        navArrowsClass() {
            if (this.element.config.navigationArrows.value) {
                return `is--nav-${this.element.config.navigationArrows.value}`;
            }

            return null;
        },

        verticalAlignStyle() {
            if (!this.element.config.verticalAlign.value) {
                return null;
            }

            return `align-self: ${this.element.config.verticalAlign.value};`;
        },

        assetFilter() {
            return Filter.getByName('asset');
        },
    },

    watch: {
        // @deprecated tag:v6.5.0 use sliderItems instead
        'element.data.sliderItems': {
            handler() {
                return null;
            },
            deep: true,
        },

        sliderItems: {
            handler() {
                if (this.element.config.sliderItems.value && this.element.config.sliderItems.value.length > 0) {
                    this.imgSrc = this.element.config.sliderItems.value[0].mediaUrl;
                    this.bannerImg = this.element.config.sliderItems.value[0].bannerImg.url;
                    this.bannerColor = this.element.config.sliderItems.value[0].bannerBg;
                    this.$emit('active-image-change', this.element.config.sliderItems.value[0].mediaUrl);
                } else {
                    this.imgSrc = this.assetFilter(this.imgPath);
                }
            },
            deep: true,
        },

        activeMedia() {
            console.log(this.imgSrc);
            this.sliderPos = this.activeMedia.sliderIndex;
            this.imgSrc = this.activeMedia.url;
        },
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('image-slider-text');
            this.initElementData('image-slider-text');

            if (this.element.config.sliderItems.value && this.element.config.sliderItems.value.length > 0) {
                this.imgSrc = this.element.config.sliderItems.value[0].mediaUrl;
                this.bannerImg = this.element.config.sliderItems.value[0].bannerImg.url;
                this.bannerColor = this.element.config.sliderItems.value[0].bannerBg;
                this.$emit('active-image-change', this.element.config.sliderItems.value[this.sliderPos].mediaUrl);
            } else {
                this.imgSrc = this.assetFilter(this.imgPath);
            }

        },

        setSliderItem(mediaItem, index) {
            console.log('setSliderItem',mediaItem, index);
            this.imgSrc = mediaItem.mediaUrl;
            this.sliderPos = index;
            this.$emit('active-image-change', mediaItem, index);
        },

        activeButtonClass(url) {
            return {
                'is--active': this.imgSrc === url,
            };
        },

        setSliderArrowItem(direction = 1) {

            if (this.element.config.sliderItems.value.length < 2) {
                return;
            }

            this.sliderPos += direction;

            if (this.sliderPos < 0) {
                this.sliderPos = this.element.config.sliderItems.value.length - 1;
            }

            if (this.sliderPos > this.element.config.sliderItems.value.length - 1) {
                this.sliderPos = 0;
            }
            console.log('setSliderArrowItem',this.sliderPos);
            this.imgSrc = this.element.config.sliderItems.value[this.sliderPos].mediaUrl;
            this.bannerImg = this.element.config.sliderItems.value[this.sliderPos].bannerImg.url;
            this.bannerColor = this.element.config.sliderItems.value[this.sliderPos].bannerBg;
            this.$emit('active-image-change', this.element.config.sliderItems.value[this.sliderPos].mediaUrl, this.sliderPos);
        },
    },
});
