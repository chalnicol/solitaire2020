class Proper extends Phaser.Scene {

    constructor ()
    {
        super('Proper');
    }

    create () {
        this.add.rectangle ( 100, 100, 100, 100, 0xffff00, 1 );
    }

    
}