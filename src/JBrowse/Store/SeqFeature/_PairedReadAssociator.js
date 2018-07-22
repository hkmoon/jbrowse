define( [
            'dojo/_base/declare',
            'dojo/_base/array',
            'dojo/_base/Deferred',
            'dojo/_base/lang',
            'JBrowse/Model/SimpleFeature'
        ],
        function(
            declare,
            array,
            Deferred,
            lang,
            SimpleFeature
        ) {

return declare(null, {
    getFeatures: function( query, featCallback, endCallback, errorCallback ) {
        if(this.viewAsPairs) {
            var pc = {};
            var f = this.featCache = this.featCache || {};
            function newFeatureCallback(feature) {
                const [chr, pos] = feature.get('next_segment_position').split(':');
                pc[chr] = pc[chr] || [];
                pc[chr].push(pos);
                const n = feature.get('name');
                if(!f[n]) {
                    f[n] = { s1: feature.get('start'), e1: feature.get('end') };
                } else {
                    f[n].s2 = feature.get('start');
                    f[n].e2 = feature.get('end');
                    f[n].start = Math.min(f[n].s1, f[n].s2);
                    f[n].end = Math.max(f[n].e1, f[n].e2);
                }
            }
            function newEndCallback(res) {
                var bins = {};

                // todo: follow next_segment_position around the genome
                // let arr = pc[query.ref || this.refSeq.name];
                // if(arr) {
                //     arr.sort((a,b) => a-b);
                //     for(var i = 0; i < arr.length; i++) {
                //         var res = Math.round(arr[i] / 10000) * 10000;
                //         bins[res] = (bins[res] || 0) + 1;
                //     }
                // }
                Object.keys(f).forEach(name => {
                    if(f[name].s2) {
                        featCallback(new SimpleFeature({
                            id: name,
                            data: {
                                start: f[name].start,
                                end: f[name].end,
                                type: 'match',
                                subfeatures: [
                                    { start: f[name].s1, end: f[name].e1, type: 'match_part' },
                                    { start: f[name].s2, end: f[name].e2, type: 'match_part' }
                                ]
                            }
                        }));
                    }
                })
                endCallback(res);
            }
            return this.inherited(arguments, [query, newFeatureCallback, newEndCallback, errorCallback]);
        } else {
            return this.inherited(arguments);
        }
    }
});
});
