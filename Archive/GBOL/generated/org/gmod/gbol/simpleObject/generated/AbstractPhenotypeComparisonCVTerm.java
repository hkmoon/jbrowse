package org.gmod.gbol.simpleObject.generated;


import org.gmod.gbol.simpleObject.*; 


/**
 * PhenotypeComparisonCVTerm generated by hbm2java
 */
public abstract class AbstractPhenotypeComparisonCVTerm extends AbstractSimpleObject implements java.io.Serializable {


     private Integer phenotypeComparisonCVTermId;
     private Publication publication;
     private PhenotypeComparison phenotypeComparison;
     private CVTerm cvterm;
     private int rank;

    public AbstractPhenotypeComparisonCVTerm() {
    }

    public AbstractPhenotypeComparisonCVTerm(Publication publication, PhenotypeComparison phenotypeComparison, CVTerm cvterm, int rank) {
       this.publication = publication;
       this.phenotypeComparison = phenotypeComparison;
       this.cvterm = cvterm;
       this.rank = rank;
    }
   
    public Integer getPhenotypeComparisonCVTermId() {
        return this.phenotypeComparisonCVTermId;
    }
    
    public void setPhenotypeComparisonCVTermId(Integer phenotypeComparisonCVTermId) {
        this.phenotypeComparisonCVTermId = phenotypeComparisonCVTermId;
    }
    public Publication getPublication() {
        return this.publication;
    }
    
    public void setPublication(Publication publication) {
        this.publication = publication;
    }
    public PhenotypeComparison getPhenotypeComparison() {
        return this.phenotypeComparison;
    }
    
    public void setPhenotypeComparison(PhenotypeComparison phenotypeComparison) {
        this.phenotypeComparison = phenotypeComparison;
    }
    public CVTerm getCvterm() {
        return this.cvterm;
    }
    
    public void setCvterm(CVTerm cvterm) {
        this.cvterm = cvterm;
    }
    public int getRank() {
        return this.rank;
    }
    
    public void setRank(int rank) {
        this.rank = rank;
    }


   public boolean equals(Object other) {
         if ( (this == other ) ) return true;
         if ( (other == null ) ) return false;
         if ( !(other instanceof AbstractPhenotypeComparisonCVTerm) ) return false;
         AbstractPhenotypeComparisonCVTerm castOther = ( AbstractPhenotypeComparisonCVTerm ) other; 
         
         return ( (this.getPhenotypeComparison()==castOther.getPhenotypeComparison()) || ( this.getPhenotypeComparison()!=null && castOther.getPhenotypeComparison()!=null && this.getPhenotypeComparison().equals(castOther.getPhenotypeComparison()) ) )
 && ( (this.getCvterm()==castOther.getCvterm()) || ( this.getCvterm()!=null && castOther.getCvterm()!=null && this.getCvterm().equals(castOther.getCvterm()) ) );
   }
   
   public int hashCode() {
         int result = 17;
         
         
         
         result = 37 * result + ( getPhenotypeComparison() == null ? 0 : this.getPhenotypeComparison().hashCode() );
         result = 37 * result + ( getCvterm() == null ? 0 : this.getCvterm().hashCode() );
         
         return result;
   }   

public AbstractPhenotypeComparisonCVTerm generateClone() {
    AbstractPhenotypeComparisonCVTerm cloned = new AbstractPhenotypeComparisonCVTerm; 
           cloned.publication = this.publication;
           cloned.phenotypeComparison = this.phenotypeComparison;
           cloned.cvterm = this.cvterm;
           cloned.rank = this.rank;
    return cloned;
}


}

