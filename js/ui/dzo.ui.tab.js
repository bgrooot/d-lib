//dzo.ui.tab.js
dzo.ui({
    
    comp: 'tab',

    options: {

        event: 'mouseover',        
        navPosition: 'top',       
        fullWidth: true,
        equalWidth: false
    },

    template: {

        tabNav: '<ul class="ui-navi">',
        tabNavItem: '<li>',
        tabNavLink: '<a>'
    },

    create: function() {

        var self = this, 
            elem = this.element, 
            opt = this.options,
            navElem = this.parseTpl('tabNav'),
            panelElems = elem.find('[data-nav-text]').addClass('tabs-panel'),
            panelLen = panelElems.length,
            panelElem, navItemElem, navLinkElem, navName, i,

        addShowEvent = function(event) {

            self.showPanel(event.data.idx);
        };

        elem.addClass('tabs tabs-' + opt.navPosition);
        
        if (!opt.fullWidth)
            elem.addClass('bkspace');

        for (i=0; i<panelLen; i++) {

            panelElem = $(panelElems[i]);
            navName = panelElem.data('navText');

            navItemElem = this.parseTpl('tabNavItem').on(opt.event, {idx: i}, addShowEvent);
            navLinkElem = this.parseTpl('tabNavLink').text(navName);   

            navItemElem.append(navLinkElem).appendTo(navElem);
        }     

        if (opt.navPosition === 'bottom')
            elem.append(navElem);
        else
            elem.prepend(navElem);

        panelElems.hide();
        this.showPanel(0).adjustNavWidth();
    },

    adjustNavWidth: function() { 

        var elem = this.element,
            opt = this.options,                     
            navElem = $(elem.find('.tabNav')),
            navItemElem = navElem.children(),
            navWidth = navItemElem.width() + 10,
            navListLen = navItemElem.length, 
            totTextLen = navElem.text().length, 
            midTextLen = totTextLen / navListLen,
            adjustPortion;

        switch (opt.navPosition) {

            case 'top':     
            case 'bottom':

                navElem.css('width', '100%');
                adjustPortion = (100 - 1 * navListLen); 

                if (opt.equalWidth)                    
                    navItemElem.width(adjustPortion / navListLen + '%');               
                
                else {

                    navItemElem.each(function(idx, elem) {

                        elem = $(elem);

                        var textLen = elem.text().length,                    
                            correction = midTextLen - textLen + 0.2;
             
                        if (opt.fullWidth)
                            elem.width(adjustPortion * textLen / totTextLen + correction + '%');

                        else
                            elem.width( elem.width() + 5 );
                    });  
                }

                break;

            case 'vertical':

                navElem.css('position', 'absolute');
                navElem.css('left', '0');
                adjustPortion = 10;

                navItemElem.width(navWidth);
                elem.find('.tabs-panel').css('margin-left', navWidth + adjustPortion);
                
                break;
        }
    },
    
    showPanel: function(idx) {

        var elem = this.element,
            prevIdx = elem.data('idx'),
            navItemElem = elem.find('.tabNav').children(),
            panelElems = elem.find('[data-nav-text]'),
            prevNav = $(navItemElem[prevIdx]), 
            targetNav = $(navItemElem[idx]),
            prevPanel = $(panelElems[prevIdx]), 
            targetPanel = $(panelElems[idx]);

        if (prevIdx !== undefined) {

            prevNav.removeClass('active');              
            prevPanel.hide();        
        }
       
        targetNav.addClass('active');
        targetPanel.css('display', 'block');

        elem.data('idx', idx);

        return this;
    }
});