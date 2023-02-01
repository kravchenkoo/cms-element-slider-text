import './component';
import './config';
import './preview';
Shopware.Service('cmsService').registerCmsElement({
    name: 'text-slider',
    label: 'sw-cms.elements.element.label',
    component: 'sw-cms-el-image-with-text',
    configComponent: 'sw-cms-el-config-image-with-text',
    previewComponent: 'sw-cms-el-preview-image-with-text',
    defaultConfig: {

    }
});
