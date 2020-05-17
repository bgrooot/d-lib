dzo.ui({
    
    comp: 'def-thumb',

    options: {      

        to: 1,
        from: 1,
        count: 1,   
        showThumb: true
    },

    template: {

        json: [

            '{{#.}}',
            '<dl>',                
                '<p class="thumbnail">',
                    '<a href="{{link}}">',
                        '<img src="{{image.0}}">',                     
                    '</a>',
                '</p>',
                '<dt><a href="{{link}}">{{{title}}}</a></dt>',
                '{{#alter}}',
                    '<dd>{{alter}}</dd>',
                '{{/alter}}',
                '{{^alter}}',
                    '<dd>{{desc}}</dd>',
                '{{/alter}}',
            '</dl>',
            '{{/.}}'
        ]
    },

    create: function(item) {

        var elem = this.element,
            opt = this.options,            
            tpl = this.getTpl(),
            from = opt.from - 1,
            defItem = item.slice(from, from + opt.count),
            defHtml;

        // .....
        if (opt.code === 'IMG_INFO' || opt.code === 'img03') {

            item[0].title = item[0].alter;
            item[0].alter = item[0].desc;
        }

        defHtml = Mustache.render(tpl, defItem);       

        elem.addClass('aside-thumb RTinside');
        elem.html(defHtml);  

        if (!opt.showThumb)
            elem.find('.thumbnail').addClass('blind');

        return this;  
    }
});