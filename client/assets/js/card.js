
class MyCard extends Phaser.GameObjects.Container {

    constructor(scene, x, y, width, height, id, knd, val, strVal, isFlipped ) {

        super( scene, x, y, [] );
        // ...
        this.setSize ( width, height ).setName ('card' + id );
        
        this.id = id;

        this.clr = knd < 2 ? 0 : 1,
        
        this.knd = knd;
        
        this.val = val;
        
        this.strVal = strVal;
        
        this.currentPost = '';
        
        this.isFlipped = isFlipped;
        
        this.isEnabled = false;
        
        this.fieldData = { row : -1, col : -1 };
        
        this.homePost = 0;

        const cardbg = scene.add.image ( 0, 0, 'card', isFlipped ? 0 : 1 );

        const txtConfig = { fontSize: height*0.22, fontFamily:'Oswald', color : this.clr == 0 ? 'black' : 'red'  };

        let frame = 0;


        if ( val >= 10 ) {

            frame = this.clr == 0 ? val - 9 : (val - 9) + 4; 
        
        }

        const txt = scene.add.text ( -width *0.33, -height*0.35, strVal, txtConfig ).setOrigin (0.5).setVisible (isFlipped);

        const kind_sm = scene.add.sprite ( -width *0.33 , -height*0.11, 'kinds', knd ).setScale ( width*0.3/100 ).setVisible (isFlipped);

        const kind_lg = scene.add.sprite ( width* 0.13, height*0.2, 'kinds', knd ).setScale ( width*0.85/100 ).setVisible (isFlipped).setAlpha ( val > 9 ? 0.3 : 1 );

        const txte = scene.add.text ( width *0.28, -height*0.4, strVal, txtConfig ).setOrigin (1, 0.5).setFontSize ( height * 0.12 ).setVisible (isFlipped);

        const kind_xs = scene.add.image (width *0.45, -height*0.4 , 'kinds_sm', knd ).setOrigin (1, 0.5).setScale (width*0.18/25).setVisible (isFlipped);

        const img  = scene.add.sprite ( 0,0, 'people', frame ).setVisible (isFlipped);

        this.add ([ cardbg, txt, kind_sm, kind_lg, txte, kind_xs, img ]);
        

        this.on('pointerover', () => {
            if ( this.isFlipped ) this.setState('hovered');
        });
        this.on('pointerout', () => {
            if ( this.isFlipped ) this.setState ('idle');
        });
        
        scene.add.existing(this);

    }

    setState ( state ){

        switch (state) {
            case 'hovered':
                this.first.setTint ( 0xffffee );
                break;
            case 'idle':
                this.first.clearTint ();
                break;
            default:
                //..
                break;
        }

    }
    
    flip ( isUp = true ) {

        this.isFlipped = isUp;

        this.first.setFrame ( isUp ? 0 : 1 );

        for ( var i = 0; i < 6; i++) {
            this.getAt ( i + 1 ).setVisible ( isUp );
        }   
        
        return this;

    }

    enabled ( state = true ) {

        this.isEnabled = state;

        if ( state ) {
            this.setInteractive ();
        }else {
            this.removeInteractive ();
        }

        return this;

    }

    setFieldPost ( col, row ) {

        this.fieldData = { 'r' : row, 'c' : col };
        
        this.currentPost = 'field'; 

        return this;
    }

    setHome ( homePost ) {

        this.fieldData = { 'r' : -1, 'c' : -1 };

        this.homePost = homePost;

        this.currentPost = 'home';
     
        return this;
    }

    getPost () 
    {
        return {

            post : this.currentPost,

            homePost : this.homePost,

            fieldData : this.fieldData

        }

    }

    
}