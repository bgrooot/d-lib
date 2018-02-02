//dzo.panel.core.js
(function(dzo) {    

    var panel = {

        xmlLoad: function() {

            var self = this;

            $.get(this.xmlUrl)   
            .done(function(xml) {

                if (!$.isXMLDoc(xml))
                    xml = $.parseXML(xml);               

                self.xml = $(xml);
                self.xmlLoadComplete();
            })
            .always(function() { 

                $(document).trigger(self.name + 'LoadComplete');
            });
        },

        jsonLoad: function() {

            var self = this;

            $.getScript(this.jsonUrl, function() {

                self.jsonLoadComplete();
                $(document).trigger(self.name + 'LoadComplete');
            })                
        },

        //panel의 model에 기술된 대로 xml데이터를 가져와서 func 함수를 실행한다.
        convertModel: function() {

            var xml = this.xml, json = this.json,
                panelName = this.name,
                model = this.model, 
                modKey, modObj, setModel,

            xmlSetModel = function(mod) {

                var modKey;              

                for (modKey in mod) if (modKey !== 'func')
                    mod[modKey] = xml.find(mod[modKey]);                

                return mod;
            },

            jsonSetModel = function(mod) {

                var modKey, modVal = json,
                    keyArr, keyLen;

                for (modKey in mod) if (modKey !== 'func') {

                    keyArr = mod[modKey].split(' ');
                    keyLen = keyArr.length;

                    for (var i=0; i<keyLen; i++)
                        modVal = modVal[keyArr[i]];

                    mod[modKey] = modVal;
                }

                return mod;
            };

            setModel = xml ? xmlSetModel : jsonSetModel;        
            this[panelName] = {};

            for (modKey in model) {              

                modObj = $.extend({}, model[modKey]);
                modObj = setModel(modObj);

                this[panelName][modKey] = modObj.func();
            }   
        },
        
        runAction: function(panel) {

            var elem = $(this.element),               
                action = panel.action, actKey, actObj,
                dzoElem = elem.find('[data-dzo]'),
                dzo, extDzo, minDzo,

            brandFilter = function() {

                if (dzoElem === extDzo)
                    return true;

                return $.data(this, 'brand') === dzoElem[i];
            };

            for (var i=0; i<dzoElem.length; i++) { 

                dzo = $(dzoElem[i]);      
                actKey = dzo.data('dzo');                        

                //복제된 element 재탐색 
                extDzo = elem.find('[data-dzo="' + actKey + '"]');
                extDzo = extDzo.filter(brandFilter);

                if (extDzo.length) {
                    
                    minDzo = extDzo.not(dzo);
                    dzoElem = dzoElem.not(minDzo);
                    dzo = extDzo;
                }

                actObj = action[actKey];

                //action이 함수형식 일때 실행
                if ($.isFunction(actObj))
                    actObj = actObj(dzo);

                panel.insertData.call(panel, dzo, actObj);
            }           
        },

        render: function(panel) {

            var self = this, elem = $(self.element),

            rendering = function() {

                panel.convertModel();
                panel.runAction.call(self, panel);

                elem.show();
            };

            //panel의 xml이 없을 때는 html을 ajax로 로드
            if (!panel.xmlUrl && !panel.jsonUrl) {

                if (panel.loadHtml)
                    panel.loadHtml.call(self, panel);

                return this;
            }            

            if (panel.xml || panel.json) {
                
                rendering();
                $(document).trigger(panel.name + 'RenderComplete');           
            }                                          

            else {

                $(document).on(panel.name + 'LoadComplete', function() { 

                    rendering();
                    $(document).trigger(panel.name + 'RenderComplete');
                });
            }
        },

        insertData: function(elem, actObj) {

            var panelName = this.name,
                model = this[panelName],
                elemLen = elem.length,
                actObjLen = panel.getDataLen(actObj), 
                selData, actobj, act, data, target;

            //element loop
            for (var i=0; i<elemLen; i++) { 

                dzo = $(elem[i]);

                //action loop
                for (var j=0; j<actObjLen; j++) { 

                    actobj = actObj[j] || actObj;
                    act = actobj.action;
                    data = model[actobj.data];                                 
                    target = actobj.target;

                    selData = $.isArray(data) ? data[i] : data;

                    switch (act) {

                        case 'iterate':
                            panel.copyElem(dzo, data.length - 1);    
                            break;

                        case 'display':
                            if (this.isGarbage(selData))
                                dzo.hide();

                            if (!this.isGarbage(selData))
                                dzo.show();                          
                            
                            break;

                        default: 
                            if (this.isGarbage(selData))
                                dzo.hide();

                            if (target)
                                dzo[act](target, selData);

                            else
                                dzo[act](selData);                    
                    }                  
                }
            }            
        },

        copyElem: function(copyElem, copyLen) {

            //재선택을 위하여 복제될 element에 original element를 data로 저장
            copyElem.find('[data-dzo]').each(function(idx, elem) {

                $(elem).data('brand', elem);
            });

            //iterate action에 의한 element 복제
            for (var i=0; i<copyLen; i++)
                copyElem.after( copyElem.clone(true, true) );            
        },

        isGarbage: function(data) {

            var isZeroLen = this.getDataLen(data) === 0,
                isBrTag = data === '<BR>',
                isFalse = data === false;

            if (isZeroLen || isBrTag || isFalse)
                return true;            

            return false;
        },       

        getDataLen: function(obj) {                      

            switch ($.type(obj)) {

                case 'undefined':
                    return 0;

                case 'string':
                    if (!obj)
                        return 0;
                    else
                        return 1;

                case 'object':
                    return 1;

                default:
                    return obj.length;
            }           
        }
    };
   
    dzo.panel = panel;
    dzo.fn.render = panel.render;

})(dzo);