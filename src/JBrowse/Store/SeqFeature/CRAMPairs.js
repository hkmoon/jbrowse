define( [
            'dojo/_base/declare',
            'dojo/_base/array',
            'dojo/_base/Deferred',
            'dojo/_base/lang',
            'JBrowse/Store/SeqFeature/CRAM',
            'JBrowse/Model/SimpleFeature'
        ],
        function(
            declare,
            array,
            Deferred,
            lang,
            CRAM,
            SimpleFeature
        ) {

return declare( CRAM, {
    _getFeatures: function( query, featCallback, endCallback, errorCallback ) {
        var pc = {};
        function newFeatureCallback(feature) {
            const [chr, pos] = feature.get('next_segment_position').split(':');
            pc[chr] = pc[chr] || [];
            pc[chr].push(pos);
            featCallback(feature);
        }
        function newEndCallback(res) {
            var bins = {};
            let arr = pc[query.ref || this.refSeq.name];
            if(arr) {
                arr.sort((a,b) => a-b);
                for(var i = 0; i < arr.length; i++) {
                    var res = Math.round(arr[i] / 10000) * 10000;
                    bins[res] = (bins[res] || 0) + 1;
                }
                console.log(bins);
            }
            endCallback(res);
        }
        this.inherited(arguments, [query, newFeatureCallback, newEndCallback, errorCallback]);
    }
});
});
