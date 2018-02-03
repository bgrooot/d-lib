//dzo.ui.event
dzo.ui('pagetype', {

    comp: 'event',

    options: {

        category: dzo.category,
        pageType: 'number'
    },

    template: {

        json: [

            '<div class="banner">',
            '<ul>',
                '{{#.}}',
                '<li><a href="{{link}}">',
                    '<img src="{{image}}">',
                    '<p>{{desc}}</p>',
                '</a></li>',
                '{{/.}}',
            '</ul>',
            '</div>'
        ]
    },

    create: function(item) {

        var elem = this.element,
            tpl = this.getTpl(),
            eventItem = item,
            eventHtml = Mustache.render(tpl ,eventItem);

        elem.html(eventHtml);
        this.addPageType(elem);

        return this;
    }
});