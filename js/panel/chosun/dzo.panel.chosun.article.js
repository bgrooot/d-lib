(function(dzo) {

    var article = function(param) {

        return new article.fn.init(param);
    };

    article.fn = article.prototype = {

        name: 'article',

        init: function(param) {

            var id = param.id,
                idYear = id.substring(0, 4),
                idMonth = id.substring(4, 6),
                idDay = id.substring(6, 8);

            $.extend(this, dzo.panel);

            this.xmlUrl = ['http://http-mirror.herokuapp.com?url=http:/','news.chosun.com', 'priv', 'data', 'www',
                             'news', idYear, idMonth, idDay, param.id + '.xml'].join('/');

            this.xmlLoad();

            return this;
        },

        xmlLoadComplete: function() {

            var relatedArt, aside;

            dzo.categoryId = this.xml.find('category > id').text();
            dzo.setCategory(dzo.categoryId);

            //사설 일떄만            
            // if (patt.test(dzo.categoryId))
            //     $(document).ready(function() { $('#opinionTop').load('aside/opinionTop.html') });
            
            if (dzo.aside) {
                
                aside = dzo.aside();
                $(document).ready(function() { 

                    var asideElem = $('[data-dzo="aside"]'),
                        asideLen = asideElem.length;
                  
                    for (var i=0; i<asideLen; i++)
                        dzo(asideElem[i]).render(aside);
                });
            }

            dzo.relatedArtId = this.xml.find('relatedDataId').text();
            if (dzo.relatedArtId && dzo.relatedArticle) {

                relatedArt = dzo.relatedArticle({id: dzo.relatedArtId, domain: 'www'});
                $(document).ready(function() {

                    var relatedElem = $('[data-dzo="relatedList"]');
                    dzo(relatedElem).render(relatedArt);
                }); 
            }            

            return this;
        }
    }; 

    article.fn.init.prototype = article.fn;  
    dzo.article = article;

})(dzo);