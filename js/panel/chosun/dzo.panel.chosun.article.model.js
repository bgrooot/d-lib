(function(article) {

    var authorFilter = ['기자', '특파원', '문화부장', '부장대우', '특별취재팀장'],
        popupFilter = [' 칼럼', ' 살롱'],

    isPopupName = function(name) {

        var key, word;

        for (key in popupFilter) {

            word = popupFilter[key];

            if (name.indexOf(word) > -1)
                return false;            
        }

        return true;
    },

    toArray = function(node) {

        var arr = [], nodeLen = node.length;

        for (var i=0; i<nodeLen; i++)
            arr.push( $(node[i]).text() );        

        return arr;
    },

    convertMedia = function(par, mediaNode, mediaName, mediaAttr) {

        var parLen = par.length, nodeList = [], 
            node, nodeAttr, mediaNo;

        for (var i=0; i<parLen; i++) {

            mediaNo = $(par[i]).find(mediaName).attr('no');
            node = mediaNode.find(mediaName + '[no=' + mediaNo + ']');
            nodeAttr = node.find(mediaAttr);

            nodeList.push( nodeAttr.text() );
        }

        return nodeList;
    },

    convertLang = function(text) {

        switch (text) {

            case 'eng':
                return 'English';

            case 'jpn':
                return '日文';

            case 'chn':
                return '中文';
        }
    },

    model = {

        title: {

            title: 'content > title',

            func: function() {

                return this.title.text();
            }
        },

        subtitle: {

            subtitle: 'content > subTitle',

            func: function() {

                var subTitle = this.subtitle.text().split('\n').join('<br>');
                subTitle = subTitle.replace(/^\s*(<BR>)+/i, '');

                return subTitle;
            }
        },

        category_name: {            

            func: function() {

                return dzo.subcategory.ko_name ? dzo.subcategory.ko_name : dzo.category.ko_name;
            }
        },

        category_link: {

            func: function() {

                return 'http://news.chosun.com/svc/list_in/list.html?catid=' + dzo.category.id;
            }
        },

        subcategory_name: {            

            func: function() {

                return dzo.subcategory ? dzo.subcategory.ko_name : '';
            }
        },

        subcategory_link: {

            func: function() {

                var linkUrl = 'http://news.chosun.com/svc/list_in/list.html?catid=';

                if (!dzo.subcategory)
                    return;               

                return linkUrl + dzo.subcategory.id + '&title';
            }
        },

        category_popupClass: {

             func: function() {

                var className = ' ';

                if (dzo.category !== dzo.categoryMap.etc)
                    className = 'hover';

                return className;
            }
        },

        category_popup_name: {

            func: function() {
              
                var subcat = dzo.category.subcat, subName = [], name, key;

                for (key in subcat) {

                    name = subcat[key].ko_name;

                    if (isPopupName(name))
                        subName.push(name);          
                }

                return subName;
            }
        },

        category_popup_link: {

            func: function() {

                var subcat = dzo.category.subcat, subLink = [], subId, name, key,
                    catUrl = 'http://news.chosun.com/svc/list_in/list.html?catid=';

                for (key in subcat) {

                    name = subcat[key].ko_name;
                    subId = dzo.category.id;

                    if (key !== '0')
                        subId += key;

                    if (isPopupName(name))
                        subLink.push(catUrl + subId);
                }

                return subLink;          
            }
        },  

        category_popupSelClass: {

            func: function() {

                var subcat = dzo.category.subcat, subClass = [],
                    selCat, subname,name, key;

                name = dzo.subcategory ? dzo.subcategory.ko_name : undefined;
                for (key in subcat) {

                    subname = subcat[key].ko_name;

                    selCat = subname === name ? 'selected_cat' : ' ';

                    if (isPopupName(subname))
                        subClass.push(selCat);
                }

                return subClass;          
            }
        },  

        date: {

            created: 'createdFormated',
            updated: 'updatedFormated',

            func: function() {

                var craeted = this.created.text().split(':'),
                    updated = this.updated.text().split(':'),
                    date;

                craeted.pop(); updated.pop();
                craeted = craeted.join(":"); updated = updated.join(":");
                date = '입력 : ' + craeted;

                if (updated)
                    date += ' | 수정 : ' + updated;

                return date;
            }
        },

        promotion_banner: {

            par: 'paragraph',
            img: 'imageList',

            func: function() {

                var imageList = convertMedia(this.par, this.img, 'image', 'image > href');

                if (imageList.length === 1 && !imageList[0])
                    return true;

                else
                    return false;
            }
        },

        paragraph_text: {

            par_text: 'paragraph > text',

            func: function() {

                var parText = toArray(this.par_text), parLen = parText.length,
                    divElem = $('<div>'),
                    startBrPttr = /^\s*(<BR><<BR>)+/gi,
                    endBrPttr = /(<BR><BR>)+/gi;

                for (var i=0; i<parLen; i++) { 

                    parText[i] = parText[i].split('\n').join('<BR>');
                    parText[i] = parText[i].replace(/(<BR>){3,}/gi, '<BR><BR>');
                  
                    par = parText[i].split(/<BR><BR>/gi);
                    parText[i] = '';

                    for (var j=0; j<par.length; j++) {

                        par[j] = '<P>' + par[j] + '</P>';                        
                        parText[i] += par[j];
                    }

                    divElem.html(parText[i]);

                    if (divElem.find('p').length > 2) {   

                        divElem.find('p br').remove();
                        parText[i] = divElem.html();
                    }
                    
                    parText[i] = parText[i].replace(/<\/P>(\n)?<BR>(\n)?<P>/gi, '</P><P>');
                    parText[i] = parText[i].replace(/<\/P><BR><P>/gi, '</P><P>');
                    parText[i] = parText[i].replace(/<P>\s*(<BR>)*\s*<\/P>/gi, '');
                    parText[i] = parText[i].replace(/<P>&nbsp;<\/P>/gi, '');

                    //effect trim
                    //if (i === 0)
                    // parText[i] = parText[i].replace(/^\s*(<BR>)*/i, '');

                    // if (i === parLen - 1)
                    //     parText[i] = parText[i].replace(/(<\/?[\w]+>\s*)+$/g, '');
                }

                return parText;
            }
        },       

        paragraph_image: {

            par: 'paragraph',
            img: 'imageList',

            func: function() {

                var imageList = convertMedia(this.par, this.img, 'image', 'image > href');                 

                return imageList;
            }
        },

        paragraph_imageAlign: {

            par: 'paragraph',
            img: 'imageList',

            func: function() {

                var alignList = convertMedia(this.par, this.img, 'image', 'align'),
                    widthList = convertMedia(this.par, this.img, 'image', 'image > width'),
                    alignLen = alignList.length,
                    isFirst = true;
                
                for (var i=0; i<alignLen; i++) {                                

                    //첫째 단락, 260이하 일때만 left
                    if (isFirst && widthList[i] && widthList[i] < 260) {

                        alignList[i] = 'left';
                        isFirst = false;
                    }

                    alignList[i] = !alignList[i] ? 'center' : alignList[i];       
                    alignList[i] += '_img';
                }

                return alignList;
            }
        },

        paragraph_imageWidth: {

            par: 'paragraph',
            img: 'imageList',

            func: function() {

                var widthList = convertMedia(this.par, this.img, 'image', 'image > width'),
                    widthLen = widthList.length, imgTag = $('<img>');

                for (var i=0; i<widthLen; i++)                  
                    widthList[i] += 'px';                

                return widthList;
            }
        },

        paragraph_imageHeight: {

            par: 'paragraph',
            img: 'imageList',

            func: function() {

                var heightList = convertMedia(this.par, this.img, 'image', 'image > height'),
                    heightLen = heightList.length;
                
                for (var i=0; i<heightLen; i++)
                    heightList[i] += 'px';

                return heightList;
            }
        },

        paragraph_imageComment: {

            par: 'paragraph',
            img: 'imageList',

            func: function() {

                var imgComList = convertMedia(this.par, this.img, 'image', 'comment');                 

                return imgComList;
            }
        },

        paragraph_media: {

            par: 'paragraph',
            med: 'mediaList',

            func: function() {

                var mediaList = convertMedia(this.par, this.med, 'media', 'tag_src');                 

                return mediaList;
            }
        },

        paragraph_mediaComment: {

            par: 'paragraph',
            med: 'mediaList',

            func: function() {

                var mediaComList = convertMedia(this.par, this.med, 'media', 'desc');                 

                return mediaComList;
            }
        },

        author_name: {

            aut_name: 'author > name',

            func: function() {                   

                var autName = $.unique(toArray(this.aut_name)); 

                return autName;
            }
        },

        author_email: {

            aut_email: 'author > email',

            func: function() {

                var autEmail = $.unique(toArray(this.aut_email));

                return autEmail;
            }
        },

        author_byline: {

            aut_byline: 'author > byline_text',

            func: function() {

                var autByline = $.unique(toArray(this.aut_byline));

                return autByline;
            }
        },

        author_nameline: {

            aut: 'author',
            aut_name: 'author > name',
            aut_byline: 'author > byline_text',

            func: function() {

                var autName = toArray(this.aut_name),
                    autByline = toArray(this.aut_byline),
                    autLen = this.aut.length,
                    autNameline = [], nameline;

                for (var i=0; i<autLen; i++) {

                    nameline = '';

                    if (autName[i])
                        nameline += autName[i];

                    if (autByline[i])
                        nameline += autByline[i];

                    autNameline.push(nameline);
                }

                return autNameline.reverse();
            }
        },

        author_link: {

            aut_name: 'author > name:not(:empty), author > byline_text:not(:empty)',

            func: function() {

                var autName = $.unique( toArray(this.aut_name) ),                
                    autLen = autName.length,
                    autUrl = 'http://search.chosun.com/search/news.search?cont5=';

                for (var i=0; i<autLen; i++)
                    autName[i] = autUrl + encodeURI(autName[i]);

                return autName;
            }
        },

        author_popup: {

            aut_name: 'author > name:not(:empty), author > byline_text:not(:empty)',

            func: function() {

                var autName = $.unique( toArray(this.aut_name) ),
                    autLen = autName.length, 
                    autPopup = [], popupDisp,

                isJournalist = function(name) {  

                    var key, word;

                    for (key in authorFilter) {

                        word = authorFilter[key];

                        if (name.indexOf(word) > -1)
                            return true;
                    }
                };

                for (var i=0; i<autLen; i++) {

                    popupDisp = isJournalist(autName[i]) ? 'inline' : 'none';
                    autPopup.push(popupDisp);
                }

                return autPopup;
            }
        },

        foreign_lang: { 

            for_lang: 'relatedTextInfo:not(:contains("#r_info")) > name',

            func: function() {

                var forLang = toArray(this.for_lang);                             

                for (var i=0; i<forLang.length; i++)
                    forLang[i] = convertLang( forLang[i] );                                           

                return $.unique(forLang);
            }
        },

        foreign_lang_abbr: {

            for_lang: 'relatedTextInfo:not(:contains("#r_info")) > name',

            func: function() {

                var forLang = toArray(this.for_lang);                           

                for (var i=0; i<forLang.length; i++)
                    forLang[i] = convertLang( forLang[i] ).substring(0, 2).toUpperCase();  

                return $.unique(forLang);
            }
        },

        foreign_link: {

            for_link: 'relatedTextInfo:not(:contains("#r_info")):has(name) > value',

            func: function() {

                return $.unique( toArray(this.for_link ));
            }
        },

        keyword_header: {

            key_name: 'relatedSite > name',

            func: function() {

                var keyName = toArray(this.key_name),
                    keyDisp = keyName.length ? 'inline' : 'none';

                return keyDisp;
            }
        },

        keyword_name: {

            key_name: 'relatedSite > name',

            func: function() {

                return  toArray(this.key_name);
            }
        },

        keyword_link: {

            key_link: 'relatedSite > url',

            func: function() {

                return  toArray(this.key_link);
            }
        }
    };

    article.model = model;

})(dzo.article.fn);