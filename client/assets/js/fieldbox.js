class FieldBox extends CardBox {

    constructor(scene, x, y, w, h, col ) {

        super(scene, x, y, w, h );
        // ...
        this.setName ('field' + col );

        this.col = col;

        //this.cardSpacing = 33;

        this.bottomCardValue = 0;

        this.content = [];
        
    }



    
}