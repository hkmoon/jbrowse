define( [
            'dojo/_base/declare',
            'JBrowse/Store/SeqFeature/CRAM'
        ],
        function(
            declare,
            CRAM
        ) {

return declare(CRAM,
{
    _getFeatures: function( query, featCallback, endCallback, errorCallback ) {
        console.log('here');
        if(!query.stats) {
            this.accumulator = this.accumulator || [];
            this.accumulator.push(query);
            setTimeout(() => {
                console.log(this.accumulator);
                endCallback();
            }, 500)

            this.bam.fetch( query.ref ? query.ref : this.refSeq.name, query.start, query.end, featCallback, endCallback, errorCallback );
        }
    }


});
});
