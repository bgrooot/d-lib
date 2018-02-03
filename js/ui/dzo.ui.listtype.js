//dzo.ui.listtype
dzo.ui({

    comp: 'listtype',
    
    options: {
      
        listType: 'dot',
        count: 10,
        markCount: 5,
        to: 1,
        from: 1
    },

    template: {

        listType: '<span>',
        listText: '<strong>'
    },

    addListType: function(elems) {

        var opt = this.options,
            listElem = elems.find('ul a'),
            typeElem = this.parseTpl('listType').addClass('listtype_' + opt.listType);
            
        switch (opt.listType) { 

            case 'dot':                
                this.addDotList(listElem, typeElem);
                break;

            case 'number':                
                this.addNumberList(listElem, typeElem);
                break;

            case 'text':                
                this.addTextList(listElem, typeElem);
                break;
        }

        return this;
    },

    addDotList: function(listElem, typeElem) {

        listElem.before(typeElem);

        return this;
    },

    addNumberList: function(listElem, typeElem) {

        var opt = this.options,
            listLen = listElem.length,
            list, typeClone, i;

        for (i=0; i<listLen; i++) {

            list = $(listElem[i]);
            typeClone = typeElem.clone().text(opt.to + i);

            if (i < opt.markCount)
                typeClone.addClass('mark');
      
            list.before(typeClone);

        }

        return this;
    },

    addTextList: function(listElem, typeElem) {

        var listText = this.options.listText,
            textElem = this.parseTpl('listText').text(listText);

        typeElem.text(' | ');
        typeElem.prepend(textElem).insertBefore(listElem);

        return this;
    }
});