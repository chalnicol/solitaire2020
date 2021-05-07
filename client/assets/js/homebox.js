
class HomeBox extends Phaser.GameObjects.Container {

    constructor(scene, x, y, w, h, col ) {

        super(scene, x, y, []);

        // ...
        this.setSize ( w, h ).setName ('home' + col );

        //..
        this.col = col;

        this.isTaken = false;

        this.knd = 0;

        this.topCardValue = 0;


        //..
        let rect = scene.add.rectangle ( 0, 0, w, h, 0xe3e3e3, 1 ).setStrokeStyle ( 1, 0x0a0a0a );;

        let circle = scene.add.circle ( 0, 0, w * 0.3 ).setStrokeStyle ( 15, 0xff0000 );

        this.add ( [ rect, circle ])

        scene.add.existing(this);


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
