class CardBox extends Phaser.GameObjects.Container {

    constructor(scene, x, y, w, h ) {

        super(scene, x, y, []);
        // ...
        this.setSize ( w, h );

        let rect = scene.add.rectangle ( 0, 0, w, h, 0xe3e3e3, 1 ).setStrokeStyle ( 1, 0x0a0a0a );;

        let circle = scene.add.circle ( 0, 0, w * 0.3 ).setStrokeStyle ( 15, 0xff0000 );

        this.add ( [ rect, circle ])

        scene.add.existing(this);

    }
    
}