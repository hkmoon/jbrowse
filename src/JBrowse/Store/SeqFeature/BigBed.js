define( [
            'dojo/_base/declare',
            'dojo/_base/lang',
            'dojo/_base/array',
            './BigWig',
            './BigWig/Window',
            'JBrowse/Model/SimpleFeature'
        ],
        function(
            declare,
            lang,
            array,
            BigWig,
            Window,
            SimpleFeature
        ) {
return declare(BigWig,

 /**
  * @lends JBrowse.Store.SeqFeature.BigBed
  */
{
    constructor: function(args) {
        if(args) {
            this.groupFeatures = args.groupFeatures;
        }
    },

    _getFeatures: function( query, featureCallback, endCallback, errorCallback ) {

        var chrName = this.browser.regularizeReferenceName( query.ref );
        var min = query.start;
        var max = query.end;

        var v = this.getView();

        if( !v ) {
            endCallback();
            return;
        }

        v.readWigData( chrName, min-100000, max+100000, (features) => {
            if(this.groupFeatures) {
                var genes = {};
                array.forEach( features || [], function(feature) {
                    var id = feature.get('geneId');
                    if(!genes[id]) {
                        genes[id] = new SimpleFeature({
                            id: feature.get('geneId'),
                            data: {
                                start: feature.get('start'),
                                end: feature.get('end'),
                                type: 'gene',
                                name: feature.get('geneName'),
                                id: feature.get('id')||feature.get('geneName'),
                                subfeatures: []
                            }
                        });
                    } else if(genes[id]) {
                        if(feature.get('start') < genes[id].get('start')) {
                            genes[id] = new SimpleFeature({
                                id: genes[id].get('id'),
                                data: {
                                    start: feature.get('start'),
                                    end: genes[id].get('end'),
                                    type: 'gene',
                                    name: genes[id].get('name'),
                                    id: genes[id].get('id'),
                                    subfeatures: genes[id].children()
                                }
                            });
                        }
                        if(feature.get('end') > genes[id].get('end')) {
                            genes[id] = new SimpleFeature({
                                id: genes[id].get('id'),
                                data: {
                                    start: genes[id].get('start'),
                                    end: feature.get('end'),
                                    type: 'gene',
                                    name: genes[id].get('name'),
                                    id: genes[id].get('id'),
                                    subfeatures: genes[id].children()
                                }
                            });
                        }
                        genes[id].data.subfeatures.push(feature);
                    }
                });
                v.readWigData( chrName, min, max, (features) => {
                    array.forEach( features || [], function(feature) {
                        if(genes[feature.get('geneId')]) {
                            featureCallback(genes[feature.get('geneId')||feature.get('geneName')]);
                        }
                    });
                });
            }
            else {
                array.forEach( features || [], featureCallback );
            }
            endCallback();
        }, errorCallback );
    },

    getView: function() {
        if (!this.unzoomedView) {
            var cirLen = 4000;
            var nzl = this.zoomLevels[0];
            if (nzl) {
                cirLen = this.zoomLevels[0].dataOffset - this.unzoomedIndexOffset;
            }
            this.unzoomedView = new Window( this, this.unzoomedIndexOffset, cirLen, false, this.autoSql );
        }
        return this.unzoomedView;
    }

});

});
