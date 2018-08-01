define([
    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/_base/lang',
    'dojo/request',
    'dijit/Dialog',
    'JBrowse/View/Track/CanvasFeatures',
    'JBrowse/Model/SimpleFeature',
    'JBrowse/Util'
],
function (
    declare,
    array,
    lang,
    request,
    Dialog,
    CanvasFeatures,
    SimpleFeature,
    Util
) {
    return declare(CanvasFeatures, {
        _defaultConfig: function () {
            return Util.deepUpdate(lang.clone(this.inherited(arguments)), {
                maxHeight: 600,
                glyph: 'JBrowse/View/FeatureGlyph/PairedLine',
                heightScaler: 1,
                style: {
                    strandArrow: false
                }
            });
        },
        _getLayout: function () {
            var layout = this.inherited(arguments);

            var maxHeight = this.config.maxHeight;
            var heightScaler = this.config.heightScaler||1;
            return declare.safeMixin(layout, {
                addRect: function (id, left, right, height, data) {
                    var pLeft   = Math.floor(left   / this.pitchX);
                    var pRight  = Math.floor(right  / this.pitchX);
                    var pHeight = Math.ceil(height / this.pitchY);

                    var midX = Math.floor((pLeft + pRight) / 2);
                    this.pTotalHeight = this.maxHeight;


                    var n = data.get('next_segment_position');
                    var chr = data.get('seq_id');
                    if (!n) {
                        return 0;
                    }
                    var s = data.get('start');
                    var chrm = n.split(':')[0];
                    if (chr !== chrm) {
                        return 0;
                    }
                    var npos = +n.split(':')[1];
                    var t = Math.abs(npos - s);

                    var rectangle = {
                        id: id,
                        l: pLeft,
                        r: pRight,
                        mX: midX,
                        h: pHeight,
                        top: t / heightScaler
                    };
                    if (data) {
                        rectangle.data = data;
                    }
                    this._addRectToBitmap(rectangle, data);
                    this.rectangles[id] = rectangle;

                    return rectangle.top;
                }
            });
        },
    });
});
