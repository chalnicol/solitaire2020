class Proper extends Phaser.Scene {

    constructor ()
    {
        super('Proper');
    }

    create ( data ) {


        this.add.rectangle ( 100, 100, 100, 100, 0xffff00, 1 );

        this.add.text ( 100, 100, data.mode, { color:'#333', fontFamily:'Oswald', fontSize:50 }).setOrigin (0.5);
        
    }

    
}