//dzo.ui.pagetype
dzo.ui({

    comp: 'pagetype',

    options: {

        pageType: 'number',
        random: false,
        duration: 5000,
        minDuration: 1500
    },

    template: {

        pageNav: '<div>',
        pageNavLink: '<a>',

        pageNumber: '<ol class="c">',        
        pageNumberItem: '<li>',       

        pageButton: '<span></span>',
        pagePrevButton: '<a><p class="arrow_before">',
        pageNextButton: '<a><p class="arrow_next">',

        pageText: '<span>'
    },

    create: function() {

        return this.addPageType(this.element);
    },

    addPageType: function(elem) {

        var opt = this.options,
            pageElem = this.selectPage(elem).hide(),
            randomNum;

        switch (opt.pageType) {

            case 'number':
                this.addNumberPage(elem, pageElem);
                break;

            case 'button':
                this.addButtonPage(elem, pageElem);
                break;

             case 'text':
                this.addTextPage(elem, pageElem);
                break;

            case 'animation':
                this.addAnimationPage(elem, pageElem);
                break;
        }

        if (opt.pagetype !== 'animation') {

           randomNum = opt.random ? Math.floor(Math.random () * pageElem.length) : 0;
           this.showPage(randomNum);
        }

        return this;
    },

    selectPage: function(elem) { 

        var divPageElem = elem.children('div:not(.pageNav)'),
            liPageElem = elem.find('ul').children();

        return divPageElem.length > 1 ? divPageElem : liPageElem;
    },

    addNumberPage: function(elem, pageElem) {

        var self = this,
            navElem = this.parseTpl('pageNav').addClass('btnumber'),
            navNumElem = this.parseTpl('pageNumber'),     
            pageLen = pageElem.length,
            navItemElem, navLinkElem, i,

        addShowEvent = function(event) {
          
            if (event.which === 1)
                self.showPage(event.data.idx);

            event.preventDefault();
        };

        for(i=0; i<pageLen; i++) {

            navItemElem = this.parseTpl('pageNumberItem').mousedown({idx: i}, addShowEvent);
            navLinkElem = this.parseTpl('pageNavLink').text(i + 1);

            navItemElem.append(navLinkElem).appendTo(navNumElem);
        }

        navElem.append(navNumElem).prependTo(elem);

        return this;
    },

    addButtonPage: function(elem, pageElem) {

        var self = this,           
            navElem = this.parseTpl('pageNav').addClass('btnumber btnarrow'),
            prevBtnElem = this.parseTpl('pagePrevButton'),
            nextBtnElem = this.parseTpl('pageNextButton'),
            pageLen = pageElem.length;            

        prevBtnElem.click(function() {   

            var prevIdx = elem.data('idx');

            prevIdx--;
            prevIdx  = prevIdx < 0 ? pageLen - 1 : prevIdx;
            self.showPage(prevIdx);
        });

        nextBtnElem.mousedown(function(event) {

            if (event.which !== 1)
                return false;

            var prevIdx = elem.data('idx');

            prevIdx++;
            self.showPage(prevIdx % pageLen);

            event.preventDefault(); 
        });

        navElem.append(prevBtnElem).append(nextBtnElem).prependTo(elem);

        return this;
    },

     addTextPage: function(elem, pageElem) {

        var self = this,
            navElem = this.parseTpl('pageNav').addClass('bttext'),                
            pageLen = pageElem.length,
            navTextElem, navLinkElem, pageText, i,

            addShowEvent = function(event) {

                self.showPage(event.data.idx);
            };

        for(i=0; i<pageLen; i++) {

            pageText = $(pageElem.get(i)).data('pageText');
            navTextElem = this.parseTpl('pageText').on('click', {idx: i}, addShowEvent);
            navLinkElem = this.parseTpl('pageNavLink').text(pageText);

            navTextElem.append(navLinkElem).appendTo(navElem);

            if (i < pageLen - 1)
                navTextElem.after(' | ');
        }

        elem.prepend(navElem);

        return this;
    },

    addAnimationPage: function(elem, pageElem) {

        var self = this,
            opt = this.options,
            duration = opt.duration < opt.minDuration ? opt.minDuration : opt.duration,

        rollPage = function(page) {

            var pageWidth = page.width();

            page.show();
            page.animate({ left: '-=' + pageWidth }, 1000);
        },

        runRolling = function(pageElem) {

            var pageLen = pageElem.length,
                randomNum = self.options.random ? Math.floor(Math.random () * pageLen) : 0,
                rollIdx = randomNum, 
                rollNextIdx;
            
            self.showPage(randomNum);
            setInterval(function() {                

                if (elem.is(':hidden'))
                    return;

                rollIdx = rollIdx > pageLen - 1 ? 0 : rollIdx;
                rollNextIdx = rollIdx >= pageLen - 1 ? 0 : rollIdx + 1;

                var curPage = $(pageElem[rollIdx]).css('left', 0),
                    nextPage = $(pageElem[rollNextIdx]),
                    nextWidth = nextPage.width();

                nextPage.css('left', nextWidth);

                rollPage(curPage);
                rollPage(nextPage);

                rollIdx++;

            }, duration);
        };

        elem.css({'overflow': 'hidden', 'position': 'relative'});       
        pageElem.css({'position': 'absolute', 'width': '100%'});

        this.isPageLoaded(pageElem, function() {

            var elemDisplay = elem.css('display'); 

            elem.show();
            elem.height(pageElem.height());
            elem.css('display', elemDisplay);

            runRolling(pageElem);
        });

        return this;
    },

    isPageLoaded: function(elem, callback) {

        var imgElem = elem.find('img'),
            elemLen, elemIdx = 0;

        elem = imgElem.length ? imgElem : elem;
        elemLen = elem.length;

        if (imgElem.length) {
        
            elem.load(function() { 

                if (elemIdx >= elemLen - 1) 
                    callback();

                elemIdx++;
            });
        }

        else 
            callback();
    },

    showPage: function(idx) {

        var elem = this.element,    
            prevIdx = elem.data('idx'),
            pageElem = this.selectPage(elem),
            navElem = elem.find('.pageNav a').parent(),
            prevNav = $(navElem[prevIdx]),
            prevPage = $(pageElem[prevIdx]),
            targetNav = $(navElem[idx]),
            targetPage = $(pageElem[idx]);

        if (prevIdx !== undefined) {

            prevNav.removeClass('on');
            prevPage.hide();
        }
      
        targetNav.addClass('on');
        targetPage.show();

        this.element.data('idx', idx);

        return this;
    }
});