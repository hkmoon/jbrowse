---
id: tutorial
title: JBrowse Quick start guide
---

This tutorial will walk you through setting up JBrowse on your webserver

For JBrowse Desktop follow [this tutorial](jbrowse_desktop.html)


# What do I need to install JBrowse

There are a couple of pre-requisites that help with getting JBrowse setup including

- Unix-y operating system - JBrowse setup is best on MacOSX, Linux, or Windows Subsystem for Linux
- Webserver - Apache or nginx are the most common servers for JBrowse
- Command line skills - Familiarity with the command line will help you follow this tutorial
- Sudo access - sudo is not strictly necessary unless you need it to modify webserver files e.g. in /var/www

If you don't have all these things, consider using [JBrowse Desktop](jbrowse_desktop.html), as this does not require command line and is easy to use on all operating systems :)

Otherwise, continue on!

# Install system pre-requisites

Some system pre-requisites for a Ubuntu/WSL/Debian type system

    sudo apt install build-essential zlib1g-dev

On CentOS/RedHat

    sudo yum groupinstall "Development Tools"
    sudo yum install zlib-devel perl-ExtUtils-MakeMaker

# Download JBrowse


Now that we have it, we'll also need to download jbrowse

    curl -O https://github.com/GMOD/jbrowse/releases/download/1.15.1-release/JBrowse-1.15.1.zip
    unzip JBrowse-1.15.1.zip
    mv JBrowse-1.15.1 /var/www/html/jbrowse # might require sudo
    cd /var/www/html
    sudo chown `whoami` jbrowse
    cd jbrowse
    ./setup.sh


# Loading a FASTA file

To begin, we'll pretend as though we are setting up the genome of *Volvox mythicus*, a mythical species in the genus [Volvox](https://en.wikipedia.org/wiki/Volvox). The Volvox genome was sequenced by Prestigious State University in 2018 and they'd like to setup JBrowse now. They give us a link to their FASTA file that we'll download


    mkdir data
    curl http://jbrowse.org/code/latest-release/docs/tutorial/data_files/volvox.fa > data/volvox.fa

We are going to use samtools to create a "FASTA index" using their faidx command. FASTA indexing allows even very large FASTA files to be downloaded into JBrowse "on demand" e.g. only downloading the sequence required for a certain view.

    samtools faidx data/volvox.fa

The FASTA index will be a file called volvox.fa.fai. Then we'll move these files into a "data directory" that JBrowse can use


Then create the file data/tracks.conf with this file content

    [GENERAL]
    refSeqs=volvox.fa.fai
    [tracks.refseq]
    urlTemplate=volvox.fa
    storeClass=JBrowse/Store/SeqFeature/IndexedFasta
    type=Sequence



Now your directory structure is something like

    /var/www/jbrowse
    /var/www/jbrowse/data
    /var/www/jbrowse/data/tracks.conf
    /var/www/jbrowse/data/volvox.fa
    /var/www/jbrowse/data/volvox.fa.fai

At this point, you should be able to open up http://localhost/jbrowse/?data=data (or just simply http://localhost/jbrowse/) and you will see your genome with the reference sequence track. If you have any problems at this stage, send an email to gmod-ajax@lists.sourceforge.net with details about your setup for troubleshooting, or file a GitHub issue.


## GFF3 file

We will use the newly generated "gene annotation" file that Prestigious University generated for Volvox mythicus. First download it here

    wget http://jbrowse.org/code/latest-release/docs/tutorial/data_files/volvox.gff3

When we are processing GFF3 for usage in JBrowse, we can aim to use GFF3Tabix format. Tabix allows random access to genomic regions similar to Indexed FASTA. We must first sort the GFF to prepare it for tabx


    sort -k1,1 -k4,4n volvox.gff3 > volvox.sorted.gff3

Then run

    bgzip volvox.sorted.gff3
    tabix -p gff volvox.sorted.gff3.gz

This generates the following files

    volvox.sorted.gff3.gz
    volvox.sorted.gff3.gz.tbi


Then we can hand-edit this content into the tracks.conf again

    mv volvox.sorted.gff3.gz data
    mv volvox.sorted.gff3.gz.tbi data


Finally add this content into data/tracks.conf


    [tracks.genes]
    urlTemplate=volvox.sorted.gff3.gz
    storeClass=JBrowse/Store/SeqFeature/GFF3Tabix
    type=CanvasFeatures

## BAM file

If you have been given sequenced alignments, you can also create a Alignments track that displays the alignments

For volvox, we are given a file

    wget http://jbrowse.org/code/latest-release/docs/tutorial/data_files/volvox-sorted.bam

Note that this BAM file is already sorted. If your BAM is not sorted, it must be sorted to use in JBrowse. Next index this file

    samtools index volvox-sorted.bam

Then finally we can move these files into our data directory and create a track definition

    mv volvox-sorted.bam data
    mv volvox-sorted.bam.bai data

Finally add this content into data/tracks.conf

    [tracks.alignments]
    urlTemplate=volvox-sorted.bam
    storeClass=JBrowse/Store/SeqFeature/BAM
    type=Alignments2

Note that as of JBrowse 1.15.0, CRAM format is also supported, simply switch .bam and .bam.bai with .cram and .cram.crai and use JBrowse/Store/SeqFeature/CRAM

## Ready to go!

At this point, if the jbrowse files are in your webserver, you should have a directory layout such as

    /var/www/html/jbrowse
    /var/www/html/jbrowse/data
    /var/www/html/jbrowse/data/volvox.fa
    /var/www/html/jbrowse/data/volvox.fa.fai
    /var/www/html/jbrowse/data/volvox.sorted.gff3.gz
    /var/www/html/jbrowse/data/volvox.sorted.gff3.gz.tbi
    /var/www/html/jbrowse/data/volvox-sorted.bam
    /var/www/html/jbrowse/data/volvox-sorted.bam.bai
    /var/www/html/jbrowse/data/tracks.conf

Then you can visit http://localhost/jbrowse/ and the "data" directory will automatically be loaded.
## Congratulations

You have now setup JBrowse!

If you have troubles, send an email to gmod-ajax@lists.sourceforge.net or create a GitHub issue (note that GitHub issues tend to be for pure concerns about JBrowse having bugs, so email list is preferre).

## Footnotes

a) If you want to customize JBrowse's javascript or use plugins, use JBrowse-1.15.1-dev.zip instead of JBrowse-1.15.1.zip (e.g. the -dev version). The -dev version will download extra javascript dependencies and can recompile JBrowse using webpack, but the non-dev version cannot.

b) If the folder was not called data, e.g. you had your files in /var/www/html/jbrowse/otherdata, then you can visit http://localhost/jbrowse/?data=otherdata (this automatically lends a way to have "multiple data directories" since you could navigate to different ?data= URL paths this way. the "dataset selector" configuration contains more details)



 If you have never worked on the command line, some of these things will seem foreign. Knowing where files exist on your system, not strictly a command line skill, but for example your "public HTML" folder (normally /var/www/html or similar) will be useful
