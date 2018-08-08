---
id: tutorial
title: JBrowse Quick start guide
---

This tutorial will walk you through setting up JBrowse on your webserver

For JBrowse Desktop follow [this tutorial](jbrowse_desktop.html)


# Pre-requisites

## Operating system

We assume you are running "*nix-y" system such as Linux, MacOSX, Windows with the Linux Subsystem (WSL).

## Samtools

We also assume that you have samtools+htslib installed. Samtools is a popular package in the bioinformatics community that facilitates file format conversions. Newer JBrowse versions support many of these file formats so this quick-start guide assues you have installed samtools.

For Ubuntu/Debian

     sudo apt install samtools

For Homebrew/Linyxbrew

    brew install brewsci/bio/samtools

Ideally we want to have samtools and tabix available.

## Webserver

We also assume that you have a webserver that you want to put JBrowse to use on. This includes something such as Apache, Nginx, but there are lots of types of webservers, microservices, static web hosts, etc. that can all serve JBrowse. JBrowse, after all, is just a static set of HTML, CSS, and JavaScript files that fetches static genomic data formats from the server, so it does not require and backend CGI, PHP, or anything like this

## Minimal skills

JBrowse should be easy to use, but having basic command line skills will help greatly for setting up JBrowse on the web. If you do not have command line skills, you can try [JBrowse Desktop](jbrowse_desktop.html). Note that having a familiarity with the layout of your filesystem helps too, e.g. where to put the files for your webserver. Many servers like Apache2 use /var/www/html for their "public HTML" folder so putting files here can immediately reflect on the website.

## Sudo access

Having sudo may be needed for your installation if you need to modify your public HTML folder (it is often protected). If you already have a subdirectory of the public HTML that you have access to, then you don't strictly need sudo then. The setup.sh script (detailed below) will not require sudo. Also note thatinstalling samtools via `apt get samtools` will also require sudo, but you could also compile samtools/htslib from source without sudo. Homebrew and Linuxbrew can be used to install samtools and they do not require sudo.


# Download JBrowse

To begin, we'll pretend as though we are setting up the genome of Volvox mythicus. The Volvox genome was sequenced by Pres Tiguous University in 2018 and they'd like to setup JBrowse now.

Now that we have it, we'll also need to download jbrowse

    wget https://github.com/GMOD/jbrowse/releases/download/1.15.1-release/JBrowse-1.15.1.zip
    unzip JBrowse-1.15.1.zip
    mv JBrowse-1.15.1 /var/www/html/jbrowse # might require sudo
    cd /var/www/html
    sudo chown `whoami` jbrowse
    cd jbrowse
    ./setup.sh


## FASTA file

 The FASTA file is provided for Volvox here to download http://jbrowse.org/code/latest-release/docs/tutorial/data_files/volvox.fa


    wget http://jbrowse.org/code/latest-release/docs/tutorial/data_files/volvox.fa

We are going to use samtools to create a "FASTA index". Indexing files allows even very large FASTA files to be downloaded into JBrowse "on demand" e.g. only downloading the sequence required for a certain view.

    samtools faidx volvox.fa

This will generate a file called volvox.fa.fai

Then we will use

    bin/prepare-refseqs.pl --indexed_fasta volvox.fa

This will generate a folder called "data" with a trackList.json containing the track entry for the volvox.fa reference sequence track

Note that you could also hand edit this content in

    mkdir data
    mv volvox.fa data
    mv volvox.fa.fai data
    echo "[tracks.refseq] \
    urlTemplate=volvox.fa
    storeClass=JBrowse/Store/SeqFeature/IndexedFasta \
    type=Sequence \
    [GENERAL]
    refSeqs=volvox.fa.fai" >> data/tracks.conf


This is an identical configuration to how the prepare-refseqs.pl works. In some sense, the prepare-refseqs is a nice one-liner, but becoming intimate with the configuration formats of JBrowse is helpful.

## GFF3 file

We will use the newly generated "gene annotation" file that Pres Tiguous University generated for Volvox mythicus. First download it here

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
    echo "[tracks.genes] \
    urlTemplate=volvox.sorted.gff3.gz
    storeClass=JBrowse/Store/SeqFeature/GFF3Tabix \
    type=CanvasFeatures" >> data/tracks.conf


## Footnotes

a) If you want to customize JBrowse's javascript or use plugins, use JBrowse-1.15.1-dev.zip instead of JBrowse-1.15.1.zip (e.g. the -dev version). The -dev version will download extra javascript dependencies and can recompile JBrowse using webpack, but the non-dev version cannot.



