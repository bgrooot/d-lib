//dzo.ui.core
(function(dzo) {

    var domainMapper = function(bind) {

        var site, mappedSite, retMap,
        mapper = {

            plus: 'newsplus',
            www: 'news'
        };

        if (!bind)
            return;

        if (bind.indexOf('tag') > -1) {

            site = bind.split('_')[1];
            mappedSite = mapper[site];

            retMap =  mappedSite ? mappedSite : site;

            return retMap;
        }

        return 'news';
    },

    urlMapper = function(bind) {

        switch (bind) {

            case 'timeline':
                var artId = dzo.deparam().contid,
                    subArtId = artId.substring(0, 6);

                return 'http://image.chosun.com/premium/timeline/' + subArtId + '/' + artId + '.js';

            default:
                //return 'http://' + domainMapper(bind) + '.chosun.com/site/data/json/' + bind + '.json';
                return 'https://cdn.jsdelivr.net/gh/bgrooot/dzo-lib@e9c26/data/' + bind + '.js';
        }
    },

    imageToArray = function(data) {

        var image, dataLen = data.length;

        for (var i=0; i<dataLen; i++) {

            image = data[i].image;

            if (typeof image === 'string')
                data[i].image = [image];
        }
    },

    ui = function(inheritUI, protoUI) {

        var comp, createInstance;

        if (arguments.length === 1) {

            protoUI = inheritUI;
            inheritUI = undefined;
        }

        comp = protoUI.comp;

        // $(document).ready(function() {

        //     var dispElem = $('[data-route-disp=' +  dzo.inflowRoute + ']'),
        //         noDispElem = $('[data-route-disp]').not(dispElem);
        //         compElems = $('[data-comp=' + comp + ']').not( noDispElem.find('[data-comp]') );

        //     compElems.each(createInstance);
        // });

        $(document).on('uiLoadComplete', function(event) {

            var elem = event.elem,
                compElems = elem.find('[data-comp=' + comp + ']');

            compElems.each(createInstance);
        });

        createInstance = function(idx, element) {

            var instance = new BaseUI();

            $.extend(true, instance, dzo.ui[inheritUI]);

            return instance.createUi(element, protoUI);
        };

        dzo.ui[comp] = protoUI;
        dzo.fn[comp] = function(method) {

            var instance = $.data(this.element, comp),
                args = Array.prototype.slice.call(arguments, 1);

            if (instance && instance[method])
                return instance[method].apply(instance, args);

            else if (!method)
                createInstance(null, this.element);
        };

        return this;
    };

    //Base UI
    var BaseUI = function() {};
    BaseUI.prototype = {

        createUi: function(element, protoUI) {

            var self = this, elem, opt, jsonUrl, bind,

            runCreate = function(item) {

                self.create(item);
                $.data(element, self.comp, self);

                if (!elem.next('[data-comp]').length)
                    elem.trigger('childCreated');
            };

            $.extend(true, this, protoUI);

            elem = this.element = $(element);
            this.reload();

            opt = this.options;
            bind = opt.bind;

            if (!bind) {

                if (elem.children('[data-comp]').length)
                    elem.one('childCreated', function() { runCreate(); });

                else
                    runCreate();

                return this;
            }

            // jsonUrl = 'http://218.145.28.110/site/data/json/' + bind + '.json';
            jsonUrl = urlMapper(bind);

            $(document).one(bind + 'LoadComplate', function(event) {

                var data = event.json,
                    code = opt.code, codeLen,
                    dataArr = [], selCode, selData,
                    isArray = $.isArray(code);

                if (code) {

                    codeLen = isArray ? code.length : 1;

                    for (var i=0; i<codeLen; i++) {

                        selCode = isArray ? code[i] : code;
                        selData = data[selCode];

                        $.isArray(selData) ? dataArr = selData : dataArr.push(selData)
                    }
                }

                else
                    dataArr = data;

                imageToArray(dataArr);
                runCreate(dataArr);
            });

            $.getJSON(jsonUrl + '?callback=?');

            return this;
        },

        refresh: function() {

            return this.deleteTpl().reload().create();
        },

        option: function(key, value) {

            var argLen = arguments.length,
                opt = this.options;

            if (argLen === 2) {

                if (opt[key] === undefined)
                    return;

                this.element.data(key, value);
                this.refresh();

                return this;
            }

            else if (argLen === 1)
                return opt[key];

            else if (argLen === 0)
                return opt;
        },

        reload: function() {

            var opt = this.options,
                comp = this.comp,
                data = this.element.data(),
                key, val;

            for (key in data) {

                if (key === 'comp' || key === comp)
                    continue;

                val = data[key];
                opt[key] = val;
            }

            return this;
        },

        getTpl: function() {

            return this.template.json.join('');
        },

        deleteTpl: function() {

            var elem = this.element,
                tpl = this.template,
                key;

            for (key in tpl) { if (key !== 'json') {

                elem.find('.' + key).remove();
            }}

            return this;
        },

        parseTpl: function(name) {

            var tpl = this.template,
                tplVal = tpl[name],
                tplType = typeof tplVal;

            if (tplType === 'string')
                return $(tplVal).addClass(name);
        }
    };

    dzo.ui = ui;

})(dzo);
