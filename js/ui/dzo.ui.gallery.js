dzo.ui({
    
    comp: 'gallery',

    options: {

        count: 3,
        random: true
    },

    template: {

        json: [

            '<p class="big"><a><span></span><img></a></p>',
            '<dl>',                
                '{{#.}}',
                '<p class="galleryItem"><a href="{{link}}"><span></span><img class="galleryImg" src="{{image.0}}"></a></p>',
                '{{/.}}',
            '</dl>',            
            '<em><a class="galleryTextLink"></a></em>'
        ]
    },

    create: function(item) {

        var self = this,
            elem = this.element,
            opt = this.options,
            tpl = this.getTpl(),
            galleryItem = item.slice(0, opt.count),
            galleryHtml, randomNum,

        addShowEvent = function(event) {

            var idx = event.data.idx;

            self.showPhoto(idx, galleryItem[idx].title);
        };
   
        galleryItem = item.slice(0, opt.count);
        galleryHtml = Mustache.render(tpl, galleryItem);

        elem.addClass('gallery img80').addClass(opt.viewType);
        elem.addClass( this.selectAlignName(opt.viewAlign) );

        elem.html(galleryHtml);

        elem.find('.galleryImg').each(function(idx, elem) {

            $(elem).mouseenter({'idx': idx}, addShowEvent);
        });

        randomNum = this.options.random ? Math.floor(Math.random () * galleryItem.length) : 0;
        this.showPhoto(randomNum, galleryItem[randomNum].title);
    },

    showPhoto: function(idx, text) {

        var elem = this.element,
            itemElem = elem.find('.galleryItem').eq(idx),
            itemImg = itemElem.find('img'),
            itemLink = itemElem.find('a'),
            divTag = $('<div>');

        elem.find('.on').removeClass('on');
        itemElem.addClass('on');
        
        text = divTag.html(text).text();
        elem.find('.big img').attr('src', itemImg.attr('src'));
        elem.find('.galleryTextLink').text(text).attr('href', itemLink.attr('href'));
    },

    selectAlignName: function(align) {

        switch (align) {

            case "right":
                return "Rview";

            case "bottom":
                return "BTview";
        }
    }
});