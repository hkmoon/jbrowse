define([
    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/_base/lang',
    'JBrowse/View/FeatureGlyph/Box'
],
function(
    declare,
    array,
    lang,
    FeatureGlyph
) {
    return declare(FeatureGlyph, {

        renderConnector: function(context, fRect) {
            var n = fRect.f.get('next_segment_position');
            var chr = fRect.f.get('seq_id');
            if (!n) {
                return;
            }
            var s = fRect.f.get('start');
            var e = fRect.f.get('end');
            var pos = parseInt(n.split(':')[1], 10);
            var chrm = n.split(':')[0];
            var style = lang.hitch(this, 'getStyle');

            if (chr !== chrm) {
                return;
            }
            var connectorColor = style(fRect.f, 'connectorColor');
            if (connectorColor) {
                context.fillStyle = connectorColor;
                var connectorThickness = style(fRect.f, 'connectorThickness');
                if (pos > e) {
                    context.fillRect(
                       fRect.rect.l + fRect.rect.w,
                       Math.round(fRect.t + (fRect.rect.h - connectorThickness) / 2),
                       (pos - e) * fRect.viewInfo.scale,
                       connectorThickness
                   );
                } else {
                    context.fillRect(
                       fRect.rect.l - (s - pos) * fRect.viewInfo.scale,
                       Math.round(fRect.t + (fRect.rect.h - connectorThickness) / 2),
                       (s - pos - fRect.f.get('length')) * fRect.viewInfo.scale,
                       connectorThickness
                   );
                }
            }
        },

        renderFeature: function(context, fRect) {
            this.renderBox(context, fRect.viewInfo, fRect.f, fRect.t, fRect.rect.h, fRect.f);
            this.renderConnector(context, fRect);
        }


    });
});

