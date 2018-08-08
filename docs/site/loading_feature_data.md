---
id: loading_feature_data
title: Loading Feature Data
---


# Formatting Feature Data

JBrowse has several different tools that can be used to convert range-based annotation data (genes, transcripts, etc) to range-indexed sets of static JSON files that are very fast for JBrowse to access. Each of these tools also adds a track configuration stanza to the `trackList.json` configuration file in its output directory.

-   [flatfile-to-json.pl](#flatfile-to-jsonpl "wikilink") - import GFF3 and BED files (**recommended for new users**)
-   [biodb-to-json.pl](#biodb-to-jsonpl "wikilink") - import from a Bio::DB::SeqFeature::Store database (recommended for users with existing databases)
-   [ucsc-to-json.pl](#ucsc-to-jsonpl "wikilink") - import UCSC database dumps (.sql and .txt.gz)

### flatfile-to-json.pl

Each run of this script formats a single track for JBrowse. A *flat file* is a data set that exists entirely in a single file. For this script, the file must be a [GFF3](http://gmod.org/wiki/GFF3), [BED](http://www.ensembl.org/info/website/upload/bed.html), or GenBank text file.

Basic usage:

`   bin/flatfile-to-json.pl --[gff|gbk|bed] <flat file> --tracklabel <track name> [options]`

For a full list of the options supported by flatfile-to-json.pl, run it with the --help option

`   bin/flatfile-to-json.pl --help`

Example

```
         flatfile-to-json.pl \
             ( --gff <GFF3 file> | --bed <BED file> | --gbk <GenBank file> ) \
             --trackLabel <track identifier>                                 \
             [ --trackType <JS Class> ]                                      \
             [ --out <output directory> ]                                    \
             [ --key <human-readable track name> ]                           \
             [ --className <CSS class name for displaying features> ]        \
             [ --urltemplate "http://example.com/idlookup?id={id}" ]         \
             [ --arrowheadClass <CSS class> ]                                \
             [ --noSubfeatures ]                                             \
             [ --subfeatureClasses '{ JSON-format subfeature class map }' ]  \
             [ --clientConfig '{ JSON-format style configuration for this track }' ] \
             [ --config '{ JSON-format extra configuration for this track }' ] \
             [ --thinType <BAM -thin_type> ]                                 \
             [ --thicktype <BAM -thick_type>]                                \
             [ --type <feature types to process> ]                           \
             [ --nclChunk <chunk size for generated NCLs> ]                  \
             [ --compress ]                                                  \
             [ --sortMem <memory in bytes to use for sorting> ]              \
             [ --maxLookback <maximum number of features to buffer in gff3 files> ]  \
             [ --nameAttributes "name,alias,id" ]                            \
```

The --trackLabel parameter is the only required parameter, and is the "id" to refer to your track by. The displayed name is also whatever --trackLabel is unless --key is specified, in which case, whatever --key is will be used as the displayed name.

By default the output is in a folder called data in your current working directory, or whatever is specified by --out

Using --trackType CanvasFeatures is generally useful since CanvasFeatures are newer than the default HTMLFeatures (aka FeatureTrack)

### biodb-to-json.pl

This script uses a [config file](/JBrowseDev/Current/Usage/ConfigFiles "wikilink") to produce a set of feature tracks in JBrowse. It can be used to obtain information from any database with appropriate [schema](/Glossary#Database_Schema "wikilink"), or from flat files. Because it can produce several feature tracks in a single execution, it is useful for large-scale feature data entry into JBrowse.

Basic usage:

`   bin/biodb-to-json.pl --conf <config file> [options]`

For a full list of the options supported by biodb-to-json.pl, run it with the --help option, like:

`   bin/biodb-to-json.pl --help`

### ucsc-to-json.pl

This script uses data from a local dump of the UCSC genome annotation MySQL database. To reach this data, go to [hgdownload.cse.ucsc.edu](http://hgdownload.cse.ucsc.edu/downloads.html) and click the link for the genome of interest. Next, click the "Annotation Database" link. The data relevant to ucsc-to-json.pl (\*.sql and \*.txt.gz files) can be downloaded from either this page or the FTP server described on this page.

Together, a \*.sql and \*.txt.gz pair of files (such as cytoBandIdeo.txt.gz and cytoBandIdeo.sql) constitute a database table. Ucsc-to-json.pl uses the \*.sql file to get the column labels, and it uses the \*.txt.gz file to get the data for each row of the table. For the example pair of files above, the name of the database table is "cytoBandIdeo". This will become the name of the JBrowse track that is produced from the data in the table.

In addition to all of the feature-containing tables that you want to use as JBrowse tracks, you will also need to download the trackDb.sql and trackDb.txt.gz files for the organism of interest.

Basic usage:

`  bin/ucsc-to-json.pl --in <directory with files from UCSC> --track <database table name> [options]`

Hint: If you're using this approach, it might be convenient to also download the sequence(s) from UCSC. These are usually available from the "Data set by chromosome" link for the particular genome or from the FTP server.

For a full list of the options supported by ucsc-to-json.pl, run it with the --help option, like:

`   bin/ucsc-to-json.pl --help`


