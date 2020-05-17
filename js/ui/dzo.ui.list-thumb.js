dzo.ui('listtype', {
    
    comp: 'list-thumb',

    options: {
        
        to: 1,
        from: 1,
        count: 1,
        listType: 'none',        
        showAuthor: true
    },

    template: {

        json: {

            normal: [

                '<ul>',
                    '{{#.}}',
                    '<li>',               
                        '<a href="{{link}}">{{{title}}}</a>',
                        '<em class="author">{{alter}}</em>',
                    '</li>',
                    '{{/.}}',
                '</ul>'
            ],

            html: [

                '<ul>{{{0.html}}}</ul>',
            ]
        }       
    },

    create: function(item) {

        var elem = this.element,
            opt = this.options,    
            jsonTpl = this.template.json,
            from = opt.from - 1,
            listItem = item.slice(from, from + opt.count),      
            tpl = listItem[0].html ? jsonTpl.html.join('') : jsonTpl.normal.join('');
            listHtml = Mustache.render(tpl, listItem);       
    
        elem.addClass('inside_list');
        elem.html(listHtml);

        if (!opt.showAuthor)
            elem.find('.author').addClass('blind');

        this.addListType(elem);       

        return this;
    }
});