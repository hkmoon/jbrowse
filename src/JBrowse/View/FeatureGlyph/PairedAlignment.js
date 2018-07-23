define([
           'dojo/_base/declare',
           'dojo/_base/Color',
           'JBrowse/View/FeatureGlyph/Box'
       ],
       function(
           declare,
           Color,
           BoxGlyph
       ) {

return declare( BoxGlyph, {
_defaultConfig: function() {
    return this._mergeConfigs(
        this.inherited(arguments),
        {
            style: {
                color: 'rgb(150,170,20,0.5)',
                connectorColor: '#333',
                connectorThickness: 1,
                borderColor: 'rgba( 0, 0, 0, 0.3 )'
            }
        });
},

renderFeature: function( context, fRect ) {
    if( this.track.displayMode != 'collapsed' )
        context.clearRect( Math.floor(fRect.l), fRect.t, Math.ceil(fRect.w), fRect.h );

    this.renderConnector( context,  fRect );
    this.renderSegments( context, fRect );
    this.renderLabel( context, fRect );
    this.renderDescription( context, fRect );
    this.renderArrowhead( context, fRect );
},

renderConnector: function( context, fRect ) {
    // connector
    var connectorColor = this.getStyle( fRect.f, 'connectorColor' );
    let [leftFeat, rightFeat] = fRect.f.children();
    if( connectorColor ) {
        var s1  = fRect.viewInfo.block.bpToX( leftFeat.get('end') );
        var s2 = fRect.viewInfo.block.bpToX( rightFeat.get('start') );
        context.strokeStyle = connectorColor;
        context.setLineDash([5, 3]);/*dashes are 5px and spaces are 3px*/
        context.beginPath();
        context.moveTo(s1, Math.round(fRect.rect.t+(fRect.rect.h)/2));
        context.lineTo(s2, Math.round(fRect.rect.t+(fRect.rect.h)/2));
        context.setLineDash([]);
        context.stroke();
    }
},

renderSegments( context, fRect ) {
    let subparts = fRect.f.children();
    if (!subparts.length) return;

    let parentFeature = fRect.f;
    let styleFunc = (feature, stylename) => {
        if (stylename === 'height')
            return this._getFeatureHeight( fRect.viewInfo, feature );

        return this.getStyle(feature, stylename) || this.getStyle(parentFeature, stylename);
    }

    for(let i = 0; i < subparts.length; ++i) {
        this.renderBox(context, fRect.viewInfo, subparts[i], fRect.t, fRect.rect.h, fRect.f, styleFunc);
    }
}

});
});
