define( [
            'dojo/_base/declare',
            'dojo/_base/array',
            'dojo/_base/Deferred',
            'dojo/_base/lang',
            'JBrowse/Store/SeqFeature/BAM',
            'JBrowse/Model/SimpleFeature'
        ],
        function(
            declare,
            array,
            Deferred,
            lang,
            BAM,
            SimpleFeature
        ) {

return declare( BAM, {
    _getFeatures: function( query, featCallback, endCallback, errorCallback ) {
        var pc = this.pairCache = this.pairCache || {};
        function pairAlignments(feature) {
            var n = feature.get('name');
            var b = feature.get('multi_segment_template')
            if(b) {
                if(!pc[n]) {
                    pc[n] = new SimpleFeature({
                        id: feature.get('id'),
                        data: lang.mixin(feature, {
                            subfeatures: [{ start: feature.get('start'), end: feature.get('end') }],
                            start: feature.get('start'),
                            end: feature.get('end')
                        })
                    })
                } else {
                    pc[n].data.subfeatures.push(new SimpleFeature({ start: feature.get('start'), end: feature.get('end') }));
                    pc[n].data.start = Math.min(feature.get('start'), pc[n].get('start'));
                    pc[n].data.end = Math.max(feature.get('end'), pc[n].get('end'));
                    featCallback(pc[n]);
                }
            } else {
                console.log('wtf1',feature);
                featCallback(feature);
            }
        }
        this.bam.fetch( query.ref ? query.ref : this.refSeq.name, query.start, query.end, pairAlignments, endCallback, errorCallback );
    }
});
});
