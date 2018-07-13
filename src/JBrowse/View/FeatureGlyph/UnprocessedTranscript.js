define([
           'dojo/_base/declare',
           'dojo/_base/Color',
           'JBrowse/View/FeatureGlyph/Segments'
       ],
       function(
           declare,
           Color,
           Segments
       ) {

return declare( Segments, {
    _defaultConfig: function() {
        var c= this._mergeConfigs(this.inherited(arguments), {
            style: {
                color: 'red'
            }
        });
        console.log(c);
        return c;
    }

});
});
