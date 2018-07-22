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
        var pc = [];
        function newFeatureCallback(feature) {
            var next = feature.get('next_segment_position')
            pc.push(next);
            featCallback(feature);
        }
        function redispatch(res) {
            console.log(pc);
            endCallback(res);
        }
        this.bam.fetch( query.ref ? query.ref : this.refSeq.name, query.start, query.end, newFeatureCallback, newEndCallback, errorCallback );
    }
});
});
