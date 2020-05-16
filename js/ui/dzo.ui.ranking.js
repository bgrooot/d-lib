//dzo.ranking
dzo.ui('listtype', {

    comp: 'ranking',

    options: {

        listType: 'number',
        from: 1,
        count: 5,
        markCount: 3
    },

    template: {

        json: {

            normal: [

                '<ul class="aside_ranking">',
                    '{{#.}}',
                    '<li><a href="{{link}}">{{{title}}}</a></li>',
                    '{{/.}}',
                '</ul>'
            ],

            html: [

                '<div class="aside_ranking">',
                    '<ul>{{{0.html}}}</ul>',
                '</div>'
            ]
        }
    },

    create: function(item) {

        var elem = this.element,
            opt = this.options,
            jsonTpl = this.template.json,
            from = opt.from - 1,
            rankItem = item.slice(from, from + opt.count),
            rankTpl = rankItem[0].html ? jsonTpl.html.join('') : jsonTpl.normal.join(''),
            rankHtml = Mustache.render(rankTpl, rankItem);

        elem.html(rankHtml);
        this.addListType(elem);

        return this;
    }
});
