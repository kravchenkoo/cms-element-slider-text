import template from './sw-cms-el-config-image-slider-text.html.twig';
import './sw-cms-el-config-image-slider-text.scss';

const { Component, Mixin } = Shopware;
const { cloneDeep } = Shopware.Utils.object;
const Criteria = Shopware.Data.Criteria;

/**
 * @private since v6.5.0
 */
Component.register('sw-cms-el-config-image-slider-text', {
    template,

    inject: ['repositoryFactory'],

    mixins: [
        Mixin.getByName('cms-element'),
    ],

    data() {
        return {
            mediaModalIsOpen: false,
            initialFolderId: null,
            entity: this.element,
            mediaItems: [],
            showSlideConfig: false,
            bannerIndex: 0,
        };
    },

    computed: {
        uploadTag() {
            return `cms-element-media-config-${this.element.id}`;
        },

        mediaRepository() {
            return this.repositoryFactory.create('media');
        },

        defaultFolderName() {
            return this.cmsPageState.pageEntityName;
        },

        items() {
            if (this.element.config && this.element.config.sliderItems && this.element.config.sliderItems.value) {
                return this.element.config.sliderItems.value;
            }

            return [];
        },

        speedDefault() {
            return this.cmsService.getCmsElementConfigByName('image-slider-text').defaultConfig.speed.value;
        },

        autoplayTimeoutDefault() {
            return this.cmsService.getCmsElementConfigByName('image-slider-text').defaultConfig.autoplayTimeout.value;
        },
    },

    created() {
        this.createdComponent();
    },

    methods: {
        async createdComponent() {
            this.initElementConfig('image-slider-text');

            if (this.element.config.autoSlide?.value) {
                this.showSlideConfig = true;
            }

            if (this.element.config.sliderItems.source !== 'default' && this.element.config.sliderItems.value.length > 0) {
                const mediaIds = this.element.config.sliderItems.value.map((configElement) => {
                    return configElement.mediaId;
                });

                const criteria = new Criteria(1, 25);
                criteria.setIds(mediaIds);

                const searchResult = await this.mediaRepository.search(criteria);
                this.mediaItems = mediaIds.map((mediaId) => {
                    return searchResult.get(mediaId);
                });
            }
        },

        onImageUpload(mediaItem) {
            const sliderItems = this.element.config.sliderItems;
            if (sliderItems.source === 'default') {
                sliderItems.value = [];
                sliderItems.source = 'static';
            }

            sliderItems.value.push({
                mediaUrl: mediaItem.url,
                mediaId: mediaItem.id,
                url: null,
                newTab: false,
            });

            this.mediaItems.push(mediaItem);

            this.updateMediaDataValue();
            this.emitUpdateEl();
        },

        onItemRemove(mediaItem, index) {
            const key = mediaItem.id;
            const { value } = this.element.config.sliderItems;

            this.element.config.sliderItems.value = value.filter(
                (item, i) => {
                    return (item.mediaId !== key || i !== index);
                },
            );

            this.mediaItems = this.mediaItems.filter(
                (item, i) => {
                    return (item.id !== key || i !== index);
                },
            );

            this.updateMediaDataValue();
            this.emitUpdateEl();
        },

        onCloseMediaModal() {
            this.mediaModalIsOpen = false;
        },
        onMediaSelectionChange(mediaItems) {
            const sliderItems = this.element.config.sliderItems;
            if (sliderItems.source === 'default') {
                sliderItems.value = [];
                sliderItems.source = 'static';
            }

            mediaItems.forEach((item) => {
                this.element.config.sliderItems.value.push({
                    mediaUrl: item.url,
                    mediaId: item.id,
                    url: null,
                    newTab: false,
                    showBanner: false,
                    bannerImg: {
                        id: null,
                        url: '',
                    },
                    bannerBg:'FFFFFF'
                });
            });

            this.mediaItems.push(...mediaItems);

            this.updateMediaDataValue();
            this.emitUpdateEl();
        },

        updateMediaDataValue() {
            if (this.element.config.sliderItems.value) {
                const sliderItems = cloneDeep(this.element.config.sliderItems.value);

                sliderItems.forEach((sliderItem) => {
                    this.mediaItems.forEach((mediaItem) => {
                        if (sliderItem.mediaId === mediaItem.id) {
                            sliderItem.media = mediaItem;
                        }
                    });
                });

                if (!this.element.data) {
                    this.$set(this.element, 'data', { sliderItems });
                } else {
                    this.$set(this.element.data, 'sliderItems', sliderItems);
                }
            }
        },

        onChangeMinHeight(value) {
            this.element.config.minHeight.value = value === null ? '' : value;

            this.$emit('element-update', this.element);
        },
        onChangeScrollDown(value) {
            console.log(value);
            this.element.config.scrollDown.value = value === null ? value > 0 : value;
        },
        onChangeBannerBg(value) {
            console.log(value);
            this.element.config.scrollDown.value = value === null ? value > 0 : value;
        },

        onChangeAutoSlide(value) {
            this.showSlideConfig = value;

            if (!value) {
                this.element.config.autoplayTimeout.value = this.autoplayTimeoutDefault;
                this.element.config.speed.value = this.speedDefault;
            }
        },

        onChangeDisplayMode(value) {
            if (value === 'cover') {
                this.element.config.verticalAlign.value = null;
            }

            this.$emit('element-update', this.element);
        },

        emitUpdateEl() {
            this.$emit('element-update', this.element);
        },

        // banner image
        previewSource (index) {
            if (this.element.config.sliderItems.value[index] && this.element.config.sliderItems.value[index].bannerImg && this.element.config.sliderItems.value[index].bannerImg.id) {
                return this.element.config.sliderItems.value[index].bannerImg.id;
            }
            return null;
        },
        async onBannerImageUpload({ targetId }) {
            console.log(1);
            const index = this.bannerIndex;

            const mediaEntity = await this.mediaRepository.get(targetId);
            const bannerImg = this.element.config.sliderItems.value[index].bannerImg;
            console.log('onBannerImageUpload',mediaEntity);
            bannerImg.id = mediaEntity.id;
            if (mediaEntity.url) {
                bannerImg.url = mediaEntity.url;
            }
            console.log('onBannerImageUpload',bannerImg);
            this.updateElementData(mediaEntity, index)
            this.$emit('element-update', this.element);

        },

        onImageRemove(index) {
            console.log(index, 'onImageRemove');
            this.setBannerIndex(index);
            console.log(2);
            this.element.config.sliderItems.value[this.bannerIndex].bannerImg.id = null;
            this.element.config.sliderItems.value[this.bannerIndex].bannerImg.url = '';
            this.updateElementData(null, index);
            this.$emit('element-update', this.element);
        },
        updateElementData(media, index) {
            if (media === null) {
                this.$set(this.element.config.sliderItems.value[index], 'bannerImg',{ id:media, url:media.url });
                console.log(this.element.config.sliderItems.value[index]);
            } else {
                this.$set(this.element.config.sliderItems.value[index], 'bannerImg', { id:media.id, url:media.url });
            }
        },
        onCloseModal() {
            this.mediaModalIsOpen = false;
        },

        onSelectionChanges(mediaEntity) {
            console.log('onSelectionChanges', mediaEntity);
            const media = mediaEntity[0];
            const bannerImg = this.element.config.sliderItems.value[this.bannerIndex].bannerImg
            bannerImg.id = media.id;
            if (mediaEntity.url) {
                bannerImg.url = media.url;
            }
            this.updateElementData(media, this.bannerIndex)
            this.$emit('element-update', this.element);
            console.log(bannerImg, 'onSelectionChanges');
        },
        setBannerIndex(index) {
            console.log('setBannerIndex', index)
            this.bannerIndex = index;
        },

        onOpenMediaModal(index) {
            console.log(index, 'onOpenMediaModal');
            console.log(this.element.config.sliderItems);
            this.setBannerIndex(index);
            this.mediaModalIsOpen = true;
        },
        imageUploadShow(index) {
            this.element.config.sliderItems.value.forEach(function (currentValue, arrIndex, array) {
                console.log('imageUploadShow',index, arrIndex);
                if (index === arrIndex) {
                    currentValue.showBanner = true;
                } else {
                    currentValue.showBanner = false;
                }
            })
        }
    },
});
