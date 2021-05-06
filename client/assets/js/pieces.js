class GamePiece extends Phaser.GameObjects.Container {

    constructor(scene, x, y, w, h, id, chipClr, post, rank, rankName, flippedUp = true ) {

        super( scene, x, y, [] );

        this.setSize ( w, h ).setInteractive ();

        this.id = id;

        this.post = post;
        
        this.chipClr = chipClr;

        this.rank = rank;

        this.flippedUp = flippedUp;

        this.isCaptured = false;

        this.isEnabled = false;

        this.isShown = false;

        

        //..
        const txtClr = chipClr == 0 ? '#3e3e3e' : '#c3c3c3';

        const chipRotation = Phaser.Math.DegToRad ( post == 0 ? 0 : 180 );

        
        const bg = this.scene.add.image (0, 0, 'chips', chipClr ).setRotation ( chipRotation );

        const img = this.scene.add.image (0, 0, 'piecesElements', chipClr == 0 ? 15 : 16 ).setVisible ( !flippedUp );

        const rnk = this.scene.add.image (0, -10, 'piecesElements', rank - 1 ).setVisible ( flippedUp );;

        const txt = this.scene.add.text (0, 24, rankName, { color : txtClr, fontFamily:'Oswald', fontSize: 24 }).setOrigin(0.5).setVisible ( flippedUp );

        this.add ([ bg, img, rnk, txt ]);


        scene.add.existing(this);

    }

}