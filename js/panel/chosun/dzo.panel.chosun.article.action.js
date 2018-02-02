(function(article) {

    var mideaToggle = function(elem) {

        var elemLen = elem.length,
            openElem, parElem, imgElem, mediaElem;

        for (var i=0; i<elemLen; i++) {

            openElem = $(elem[i]);
            parElem = openElem.parents('[data-dzo="paragraph"]');

            imgElem = parElem.find('[data-dzo="paragraph_imageArea"]');
            mediaElem = parElem.find('[data-dzo="paragraph_mediaArea"]');

            openElem.click({img: imgElem, media: mediaElem}, addMediaEvent);
        }
    },

    addMediaEvent = function(event) {

        event.data.img.toggle();
        event.data.media.toggle();
    },

    action = {

        title: {action: 'append', data: 'title'},

        subtitle: {action: 'append', data: 'subtitle'},

        category_name: function(elem) {

            if (dzo.category.ko_name.length > 3)
                elem.css('font-size', '21px');

            return [{action: 'append', data: 'category_name'},
                    {action: 'attr', target: 'href', data: 'category_link'}];
        },

        category_link: {action: 'attr', target: 'href', data: 'category_link'},

        subcategory_link: [{action: 'append', data: 'subcategory_name'},
                            {action: 'attr', target: 'href', data: 'subcategory_link'}],

        category_popup: {action: 'addClass', data: 'category_popupClass'},

        category_popup_list: {action: 'iterate', data: 'category_popup_name'},

        category_popup_link: [{action: 'append', data: 'category_popup_name'},
                            {action: 'attr', target: 'href', data: 'category_popup_link'},
                            {action: 'addClass', data: 'category_popupSelClass'}],

        date: {action: 'append', data: 'date'},

        promotion_banner: {action: 'display', data: 'promotion_banner'},

        paragraph: {action: 'iterate', data: 'paragraph_text'},

        paragraph_text: {action: 'append', data: 'paragraph_text'},

        paragraph_imageArea: [{action: 'attr', target: 'class', data: 'paragraph_imageAlign'},
                                {action: 'css', target: 'width', data: 'paragraph_imageWidth'},
                                // {action: 'css', target: 'height', data: 'paragraph_imageHeight'},
                                {action: 'display', data: 'paragraph_image'}],

        paragraph_image: {action: 'attr', target: 'src', data: 'paragraph_image'},

        paragraph_imageComment: {action: 'append', data: 'paragraph_imageComment'},

        paragraph_media: {action: 'append', data: 'paragraph_media'},

        paragraph_mediaComment: {action: 'append', data: 'paragraph_mediaComment'},

        paragraph_openButton: function(elem) {

            mideaToggle(elem);

            return {action: 'display', data: 'paragraph_media'};
        },

        paragraph_closeButton: function(elem) {

            mideaToggle(elem);
        },

        author: {action: 'iterate', data: 'author_nameline'},

        author_name: {action: 'append', data: 'author_name'},

        author_email: {action: 'append', data: 'author_email'},

        author_byline: {action: 'append', data: 'author_byline'},

        author_nameline: {action: 'append', data: 'author_nameline'},

        author_link: {action: 'attr', target: 'href', data: 'author_link'},

        author_popup: {action: 'css', target: 'display', data: 'author_popup'},

        foreign: [{action: 'iterate', data: 'foreign_link'}, {action: 'display', data: 'foreign_link'}],

        foreign_link: {action: 'attr', target: 'href', data: 'foreign_link'},

        foreign_lang: {action: 'prepend', data: 'foreign_lang'},

        foreign_lang_abbr: {action: 'prepend', data: 'foreign_lang_abbr'},

        keyword: {action: 'iterate', data: 'keyword_name'},

        keyword_header: {action: 'display', data: 'keyword_name'},

        keyword_link: function(elem) {

            elem.not(elem.last()).after(', ');       

            return [{action: 'attr', target: 'href', data: 'keyword_link'},
                    {action: 'append', data: 'keyword_name'}];
        }
    };

    article.action = action;

})(dzo.article.fn);