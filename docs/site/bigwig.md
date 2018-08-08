---
id: bigwig
title: Wiggle/BigWig Tracks
---


# Wiggle/BigWig Tracks (XYPlot, Density)

Introduced in JBrowse 1.5.0, Wiggle tracks require that the user's browser support HTML `<canvas>` elements. BigWig support requires a web browser with support for HTML5 typed arrays.

Beginning with JBrowse 1.7.0, there are two available subtypes of Wiggle tracks, `Wiggle/XYPlot` and `Wiggle/Density`. The XYPlot wiggle track displays quantitative data as an x/y plot, and the Density displays the data as varying intensities of color.

![915px|center|border|Wiggle tracks](http://gmod.org/mediawiki/images/7/71/Jbrowse_wiggle_tracks.png)

## Example BigWig-based Wiggle XY-Plot Track Configuration

Here is an example track configuration stanza for a Wiggle XY-plot track displaying data directly from a [BigWig file](http://genome.ucsc.edu/FAQ/FAQformat.html#format6.1). Note that the URL in `urlTemplate` is relative to the directory where the configuration file is located.

~~~~ {.javascript}
      {
         "label"         : "rnaseq",
         "key"           : "RNA-Seq Coverage",
         "storeClass"    : "JBrowse/Store/SeqFeature/BigWig",
         "urlTemplate"   : "../tests/data/SL2.40_all_rna_seq.v1.bigwig",
         "type"          : "JBrowse/View/Track/Wiggle/XYPlot",
         "variance_band" : true,
         "min_score"     : -1000,
         "max_score"     : 2000,
         "style": {
             "pos_color"         : "#FFA600",
             "neg_color"         : "#005EFF",
             "clip_marker_color" : "red",
             "height"            : 100
         }
      }
~~~~

**Note:** numerical values do not appear in quotes.

## Example BigWig-based Wiggle Color Density Track Configuration

Here is an example track configuration stanza for a Wiggle color-density track displaying data directly from a [BigWig file](http://genome.ucsc.edu/FAQ/FAQformat.html#format6.1). It will draw regions with data that is greater than the overall mean as progressively more intense blue, and data that is below the mean as progressively more intense red. Note that the URL in `urlTemplate` is relative to the directory where the configuration file is located. Also note that green and purple is an ugly color combination. ;-)

~~~~ {.javascript}
      {
         "label"         : "rnaseq",
         "key"           : "RNA-Seq Coverage",
         "storeClass"    : "JBrowse/Store/SeqFeature/BigWig",
         "urlTemplate"   : "my_methylation_data.bw",
         "type"          : "JBrowse/View/Track/Wiggle/Density",
         "bicolor_pivot" : "mean",
         "style": {
             "pos_color": "purple",
             "neg_color": "green"
         }
