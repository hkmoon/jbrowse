---
id: variants
title: VCF tracks
---
# Variant Tracks (VCF)

Beginning in JBrowse 1.9.0, JBrowse can display feature data directly from VCF files, and has an `HTMLVariants` track type that is optimized for displaying the potentially large amounts of detailed data that go with each variant.

![800px|center|thumb|Variant details display, showing a genotypes summary and sortable table of 1094 genotypes.](http://gmod.org/mediawiki/images/3/3c/JBrowse_variant_details.png)

VCF files used with the `VCFTabix` must be compressed with `bgzip` and indexed with `tabix`, both of which are part of the [samtools](http://samtools.sourceforge.net/) package. This is usually done with commands like:
```
   bgzip my.vcf
   tabix -p vcf my.vcf.gz
```

## Example VCF-based Variant Track Configuration

Here is an example track configuration stanza for a variant track displaying data directly from a [VCF file](http://www.1000genomes.org/wiki/Analysis/Variant%20Call%20Format/vcf-variant-call-format-version-41). Note that the URL in `urlTemplate` is relative to the directory where the configuration file is located. Note that `tbiUrlTemplate` can also be used if your tbi file is named anything other than the urlTemplate with .tbi added to the end.

~~~~ {.javascript}
      {
         "label"         : "mysnps",
         "key"           : "SNPs from VCF",
         "storeClass"    : "JBrowse/Store/SeqFeature/VCFTabix",
         "urlTemplate"   : "../vcf_files/SL2.40_all_rna_seq.v1.vcf.gz",
         "type"          : "JBrowse/View/Track/HTMLVariants"
      }
~~~~

Alternatively, if you are using the tracks.conf format, then a similar example would look like the following

~~~~ {.javascript}
[ tracks.myvcf ]
# settings for what data is shown in the track
storeClass     = JBrowse/Store/SeqFeature/VCFTabix
urlTemplate    = ../vcf_files/SL2.40_all_rna_seq.v1.vcf.gz

# settings for how the track looks
category = VCF
type = JBrowse/View/Track/CanvasVariants
key  = SNPs from VCF
~~~~

### Using VCF Filters in configuration

The two variables hideNotFilterPass or hideFilterPass can be used to define whether to filter some variants by default. For example adding hideNotFilterPass: 1 will show the variants that passed all filters by default (i.e. it hides all the features that didn't pass all the filters)

`"hideNotFilterPass": 1`


