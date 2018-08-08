---
id: html_features
title: HTMLFeatures
---
## HTMLFeatures Configuration Options

JBrowse HTMLFeatures tracks, the default legacy track type for range-based features, have many available options for customization, not all of which are available from the command-line formatting scripts. Below is a comprehensive list of configuration options for HTMLFeatures tracks. HTMLFeatures tracks are also referred to as trackType: "FeatureTrack" or "type": "FeatureTrack".

|Option|Value|
|------|-----|
|`yScalePosition`|Position of the y-axis scale indicator when the track is zoomed far enough out that density histograms are displayed. Can be "left", "right", or "center". Defaults to "center".|
|`maxFeatureScreenDensity`|Maximum density of features to display on the screen. If this is exceeded, will display either feature density histograms (if available), or a "too many features to show" message. The units of this number are features per screen width in pixels. Defaults to 0.5.|
|`description`|Comma-separated list of fields in which to look for the description of a feature. Case-insensitive. If set to `false` or `null`, no feature description will be shown. Defaults to 'note, description'.|
|`maxDescriptionLength`|Maximum length, in characters, for displayed feature descriptions.|
|`minSubfeatureWidth`|Minimum width, in pixels, of the *top-level* feature for JBrowse to attempt to display its subfeatures. Default 6.|
|`menuTemplate`|Optional menu configuration for right-click menus on features. Can be as large and complicated as you want. See [Customizing_Right-click_Context_Menus](#customizing-right-click-context-menus "wikilink") below. If set to null or false, disables feature right-click menus.|
|`hooks→create`|JavaScript function that creates the parent feature HTML element and returns it. By default this is: `function(track,feature) { return document.createElement('div'); }`, which creates an HTML `div` element.|
|`hooks→modify`|JavaScript function that can be used to modify the feature HTML element in any way desired. If set, the function is called with the track object, feature object, and feature HTML element as arguments (signature: `function(track, feature, featDiv)`).|
|`style→featureScale`|Minimum zoom scale (pixels/basepair) for displaying individual features in the track. Not set by default, and overrides the `maxFeatureScreenDensity`.|
|`style→className`|CSS class for parent features. Defaults to "feature".|
|`style→subfeatureClasses`|Key-value pairs of CSS classes for subfeatures, organized by feature type. Example: { "CDS" : "transcript-CDS","UTR" : "transcript-UTR" }|
|`style→featureCss`|Text string of additional CSS rules to add to features. Example: "border-color: purple; background-color: yellow;"|
|`style→arrowheadClass`|CSS class of the strand arrowheads to show for this feature. Defaults to 'arrowhead'. If set to `null`, no arrowhead will be drawn.|
|`style→histScale`|Scale (pixels per basepair) below which the track will attempt to draw feature density histograms instead of features, if available. By default, this is set to 4 times the average feature density (features per basepair) of the track.|
|`style→label`|Comma-separated list of case-insensitive feature tags to use for showing the feature's label. The first one found will be used. Default 'name,id'.|
|`style→labelScale`|Scale (pixels per basepair) above which feature labels (names) will be shown. By default, this is set to 30 times the average feature density (features per basepair) of the track.|
|`style→descriptionScale`|Scale (pixels per basepair) above which long feature descriptions will be shown. By default, this is set to 170 times the average feature density (features per basepair) of the track.|
|`style→description`|Comma-separated list of case-insensitive feature tags to check for the feature's long description. The first one found will be used. Default 'note,description'. If blank no description is used.|
|`style→showLabels`|If set to true, feature labels may be shown. Defaults to true. Set this to false to disable display of feature labels.|
|`maxHeight`|Maximum height, in pixels, that the track is allowed to grow to. When it reaches this height, features that stack higher than this will not be shown, and a "Max height reached" message will be displayed. Default 600 pixels.|
|`showNoteInAttributes`|If set to true, show the feature's "Note" attribute as a regular attribute in the feature detail dialog. This is mostly useful for projects that want the blue description text on a feature to be different from the feature's Notes attribute, but still display the Notes attribute in the detail dialog|
|`topLevelFeatures`|Specifies which feature types should be considered "top-level" for this track. For example, if you have a track with gene-\>mRNA-\>CDS features, but for some reason want to only display the mRNA features, you can set topLevelFeatures=mRNA. Can also be an array of string types, or a function callback that returns an array of types. Default: all features are displayed. Added in 1.14.0|


