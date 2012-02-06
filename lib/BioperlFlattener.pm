=head1 NAME

BioperlFlattener - configurably transform BioPerl feature objects to arrayrefs

=head1 SYNOPSIS

  my $flattener = BioperlFlattener->new(
                      $track->{"track"},
                      \%style,
                      [],
                      [],
                      $nameCallback,
                    );

  my $startCol = BioperlFlattener->startIndex;
  my $endCol = BioperlFlattener->endIndex;

  my $arrayref = $flattener->flatten($feature);

=head1 METHODS

=cut

package BioperlFlattener;

use strict;
use warnings;
use JsonGenerator;

#in JSON, features are represented by arrays (we could use
#hashes, but then we'd have e.g. "start" and "end" in the JSON
#for every feature, which would take up too much space/bandwidth)
#@featMap maps from feature objects to arrays
my @featMap = (
	       sub {shift->start - 1},
	       sub {int(shift->end)},
	       sub {int(shift->strand)},
	      );

my @mapHeaders = ( 'class','start', 'end', 'strand');
#positions of "start" and "end" in @mapHeaders (for NCList)
my $startIndex = 1;
my $endIndex   = 2;
#position of the lazy subfeature file name in the fake feature.
my $lazyIndex = 3;

sub featureLabelSub {
    return $_[0]->display_name if $_[0]->can('display_name');
    return $_[0]->info         if $_[0]->can('info'); # deprecated
    return $_[0]->seq_id       if $_[0]->can('seq_id');
    return eval{$_[0]->primary_tag};
}

my %builtinDefaults =
  (
   "label"        => \&featureLabelSub,
   "autocomplete" => "none",
   "class"        => "feature"
  );

=head1 new( $trackLabel, \%setStyle, \@extraMap, \@extraHeaders, \&nameCallback )

=cut

sub new {
    my ($class, $label, $setStyle,
        $extraMap, $extraHeaders, $nameCallback) = @_;

    my %style = ("key" => $label,
                 %builtinDefaults,
		 %$setStyle);

    JsonGenerator::evalSubStrings(\%style);

    my $self = {};

    $self->{style} = \%style;
    $self->{label} = $label;
    $self->{getLabel} = ($style{autocomplete} =~ /label|all/);
    $self->{getAlias} = ($style{autocomplete} =~ /alias|all/);

    my $idSub = $style{idSub} || sub  {
        return $_[0]->can('primary_id') ? $_[0]->primary_id : $_[0]->id;
    };

    my @curFeatMap = @featMap;
    my @curMapHeaders = @mapHeaders;

    unless ($style{noId}) {
        push @curFeatMap, $idSub;
        push @curMapHeaders, "id";
    }

    @curFeatMap = (@curFeatMap, @$extraMap);
    @curMapHeaders = (@curMapHeaders, @$extraHeaders);

    if ($style{label}) {
	push @curFeatMap, $style{label};
	push @curMapHeaders, "name";
    }

    if ($style{phase}) {
        push @curFeatMap, sub {shift->phase};
        push @curMapHeaders, "phase";
    }

    if ($style{type}) {
        push @curFeatMap, sub {shift->primary_tag};
        push @curMapHeaders, "type";
    }

    if ($style{extraData}) {
        foreach my $extraName (keys %{$style{extraData}}) {
            push @curMapHeaders, $extraName;
            push @curFeatMap, $style{extraData}->{$extraName};
        }
    }

    my @subfeatMap = ( sub {1}, @featMap, sub {shift->primary_tag});
    my @subfeatHeaders = (@mapHeaders, "type");

    if ($style{subfeatures}) {
        push @curFeatMap, sub {
            my ($feat, $flatten) = @_;
            my @flattened;
            my @subFeatures = $feat->get_SeqFeatures;
            return undef unless (@subFeatures);

            my $sfClasses = $style{subfeature_classes};
            my @subfeatIndices;
            foreach my $subFeature (@subFeatures) {
                push @flattened, [ map $_->($subFeature), @subfeatMap ];
            }
            return \@flattened;
        };
        push @curMapHeaders, 'subfeatures';
    }

    my @nameMap =
      (
       sub {$label},
       $style{label},
       sub {ref($_[0]->seq_id) ? $_[0]->seq_id->value : $_[0]->seq_id},
       sub {int(shift->start) - 1},
       sub {int(shift->end)},
       sub {$_[0]->can('primary_id') ? $_[0]->primary_id : $_[0]->id}
      );

    if ($self->{getLabel} || $self->{getAlias}) {
	if ($self->{getLabel} && $self->{getAlias}) {
	    unshift @nameMap, sub {[unique($style{label}->($_[0]),
					   $_[0]->attributes("Alias"))]};
	} elsif ($self->{getLabel}) {
	    unshift @nameMap, sub {[$style{label}->($_[0])]};
	} elsif ($self->{getAlias}) {
	    unshift @nameMap, sub {[$_[0]->attributes("Alias")]};
	}
    }

    $self->{sublistIndex} = $#curFeatMap + 1;

    $_ = ucfirst for @curMapHeaders, @subfeatHeaders;

    $self->{nameMap} = \@nameMap;
    $self->{curFeatMap} = \@curFeatMap;
    $self->{curMapHeaders} = \@curMapHeaders;
    $self->{subfeatMap} = \@subfeatMap;
    $self->{subfeatHeaders} = \@subfeatHeaders;
    $self->{features} = [];
    $self->{nameCallback} = $nameCallback;

    bless $self, $class;
}

=head1 flatten( $feature_object, $class_index )

Flatten a Bio::SeqFeatureI object into an arrayref.  Takes an optional
C<$class_index> for the L<ArrayRepr> class.

=cut

sub flatten {
    my ( $self, $feature, $class_index ) = @_;

    if ($self->{getLabel} || $self->{getAlias}) {
        $self->{nameCallback}->([ map $_->($feature), @{$self->{nameMap}} ]);
    }

    return [ $class_index || 0, map $_->($feature), @{$self->{curFeatMap}} ];
}

=head1 featureHeaders()

=cut

sub featureHeaders {
    my ($self) = @_;
    return $self->{curMapHeaders};
}


=head1 subfeatureHeaders()

=cut

sub subfeatureHeaders {
    my ($self) = @_;
    return $self->{subfeatHeaders};
}

=head1 startIndex()

=cut

sub startIndex {
    return $startIndex;
}

=head1 endIndex

=cut

sub endIndex {
    return $endIndex;
}

sub unique {
    my %saw;
    return (grep(defined($_) && !$saw{$_}++, @_));
}

1;
