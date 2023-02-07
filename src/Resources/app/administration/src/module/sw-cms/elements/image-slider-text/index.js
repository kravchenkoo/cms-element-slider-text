import './component';
import './config';
import './preview';
Shopware.Service('cmsService').registerCmsElement({
    name: 'image-slider-text',
    label: 'image-slider-text',
    component: 'sw-cms-el-image-slider-text',
    configComponent: 'sw-cms-el-config-image-slider-text',
    previewComponent: 'sw-cms-el-preview-image-slider-text',
    defaultConfig: {
        sliderItems: {
            source: 'static',
            value: [],
            required: true,
            entity: {
                name: 'media',
            },
        },
        navigationArrows: {
            source: 'static',
            value: 'outside',
        },
        navigationDots: {
            source: 'static',
            value: null,
        },
        displayMode: {
            source: 'static',
            value: 'standard',
        },
        minHeight: {
            source: 'static',
            value: '300px',
        },
        verticalAlign: {
            source: 'static',
            value: null,
        },
        speed: {
            value: 300,
            source: 'static',
        },
        autoSlide: {
            value: false,
            source: 'static',
        },
        autoplayTimeout: {
            value: 5000,
            source: 'static',
        },
        scrollDown: {
            value: null,
        },
        media: {
            source: 'static',
            value: null,
            entity: {
                name: 'media',
            },
        },
        url: {
            source: 'static',
            value: null,
        },
        newTab: {
            source: 'static',
            value: false,
        },
    },
});
