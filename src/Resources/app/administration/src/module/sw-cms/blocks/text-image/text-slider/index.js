import './component';
import './preview';
Shopware.Service('cmsService').registerCmsBlock({
    name: 'text-slider',
    category: 'text-image',
    label: 'Image Slider Text',
    component: 'sw-cms-block-image-slider-text',
    previewComponent: 'sw-cms-preview-text-slider',
    defaultConfig: {
        marginBottom: '20px',
        marginTop: '20px',
        marginLeft: '20px',
        marginRight: '20px',
        sizingMode: 'boxed'
    },
    slots: {
        slider: 'image-slider-text',
    }
});
