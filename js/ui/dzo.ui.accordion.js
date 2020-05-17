/**
* @class ui.accordion
*/
//dzo.ui.accordion.js
dzo.ui({

    comp: 'accordion',

    options: {

        event: 'mouseover'
    },

    template: {

        'accordionNav': '<h6>',
        'accordionLink': '<a>'
    },

    panelMaxHeight: 0,

    create: function() {

        var self = this,
            elem = this.element, 
            opt = this.options,
            panelElems = elem.find('[data-nav-text]'),
            panelLen = panelElems.length,
            i, panelElem, accNavElem, accLinkElem, nav, elemDisp,

        addShowEvent = function(event) {

            self.showPanel(event.data.idx);  
        };

        elem.addClass('accordion');
        for (i=0; i<panelLen; i++) {

            panelElem = $(panelElems[i]).addClass('acc-panel');
            nav = panelElem.data('nav-text');

            accNavElem = this.parseTpl('accordionNav').on(opt.event, {idx: i}, addShowEvent);
            accLinkElem = this.parseTpl('accordionLink').text(nav);

            accNavElem.append(accLinkElem).insertBefore(panelElem);
        }

        elemDisp = elem.css('display');
        elem.show(); panelElems.show();
        panelElems.each(function(idx, panel) {

            var panMaxHeight = self.panelMaxHeight,
                penHeight = $(panel).innerHeight();

            if (panMaxHeight < penHeight)
                self.panelMaxHeight = penHeight;
        });

        panelElems.height('0').hide();
        elem.height(elem.height() + parseInt(this.panelMaxHeight) + 10);       
        this.showPanel(0);
        
        elem.css('display', elemDisp);
    },

    showPanel: function(idx) {

        var elem = this.element,
            prevIdx = elem.data('idx');

        if (prevIdx === idx)
            return;

        elem.find(':animated').finish();

        var navElem = elem.find('.accordionNav'),
            panelElems = elem.find('.acc-panel'),
            prevNav = $(navElem[prevIdx]),
            targetNav = $(navElem[idx]),
            prevPanel = $(panelElems[prevIdx]),
            targetPanel = $(panelElems[idx]),
            prevPadding, prevBorder;

        if (prevIdx !== undefined) {

            prevNav.removeClass('active');        

            prevPadding = prevPanel.css('padding');
            prevBorder = prevPanel.css('border');

            prevPanel.css('padding-bottom', 0);
            prevPanel.css('padding-top', 0);
            prevPanel.css('border-bottom', 0);
            prevPanel.css('border-top', 0);

            prevPanel.animate({ height: '0'}, function() {

                var $this = $(this);
                $this.css('display', 'none');
            });  
        }

        targetNav.addClass('active');
        targetPanel.show();
        targetPanel.animate({ height: this.panelMaxHeight }, function() {    

            prevPanel.css('padding', prevPadding);
            prevPanel.css('border', prevBorder);
        });

        elem.data('idx', idx);
    }
});