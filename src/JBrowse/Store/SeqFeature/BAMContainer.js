define( [
            'dojo/_base/declare',
            'JBrowse/Store/SeqFeature/BAM'
        ],
        function(
            declare,
            BAM
        ) {

return declare(BAM,
{
    _getFeatures: function( query, featCallback, endCallback, errorCallback ) {

        this.accumlator = this.accumulator || [];
        this.accumulator.push(query);
        setTimeout(() => {
            console.log(this.accumulator);
        }, 500)

        //this.bam.fetch( query.ref ? query.ref : this.refSeq.name, query.start, query.end, featCallback, endCallback, errorCallback );
    }


});
});
