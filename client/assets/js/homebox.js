class HomeBox extends CardBox {

    constructor(scene, x, y, wd, ht, col ) {

        super(scene, x, y, wd, ht );
        // ...
        this.setName ('home' + col );

        this.col = col;

        this.isTaken = false;

        this.knd = 0;

        this.topCardValue = 0;

    }

    setTopCardValue ( cardVal, cardKind ) 
    {

        this.topCardValue = cardVal;

        this.knd = cardKind;

        if ( !this.isTaken ) this.isTaken = true;

    }

    reset () 
    {

        this.topCardValue = 0;

        this.isTaken = false;

        this.knd = 0;
        
    }
    
}