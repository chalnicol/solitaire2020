class Proper extends Phaser.Scene {

    constructor ()
    {
        super('Proper');
    }

    create ( data ) {
        
        this.mode = data.mode == 0 ? 'easy' : 'hard';

        this.cardDimensions = { 'w' : 130, 'h' : 170 };

        this.isGameOn = false;

        this.add.image ( 960, 540, 'bg');

        this.initMenuSound();

        this.initCardsHolder ();

        this.initControls();

    }

    initMenuSound () 
    {

        this.bgmusic = this.sound.add('properBg').setVolume(0.2).setLoop(true);

        this.bgmusic.play();

        this.soundFx = this.sound.addAudioSprite('sfx');

    }

    initCardsHolder () {

        this.mainContainer = this.add.container (0, 0);

        let card = this.cardDimensions;

        const sx = (1920 - ( 1920 * 0.9 ))/2 + (card.w/2), 

              sy = 115;

        //init box..

        let initBox = new CardBox ( this, sx, sy, card.w, card.h );
        
        initBox.setInteractive().setName ('initBox');

        initBox.on ('pointerdown', function (){
            this.scene.initialBoxClick ( this );
        });

        this.mainContainer.add ( initBox );

            
        //home boxes...

        //this.homeBoxes = [];

        const stw = (4 * ( card.w + 20 )) - 20, 

              shx = 1920 - sx - stw + card.w;

        for ( var i = 0; i < 4; i++ ) {

            const xs = shx + i * ( card.w + 20 ),
                
                  ys = sy;

            var homeBox = new HomeBox (this, xs, ys, card.w, card.h, i );

            this.mainContainer.add ( homeBox );

        }


        //field boxes...

        const fsp = ( ( 1920 * 0.9 ) - ( card.w * 7 )) / 6,

              fsx = sx,

              fsy = 300;

        for ( var i = 0; i < 7; i++ ) {

            var xp = fsx + i * ( card.w + fsp ),

                yp = fsy;

            var fieldBox = new FieldBox ( this, xp, yp, card.w, card.h, i );

            this.mainContainer.add ( fieldBox );

        }


    }

    initControls () { 

        var cont = this.add.container ( 960, 115 );

        var rect = this.add.rectangle ( 0, 0, 300, 170, 0xe3e3e3, 1 ).setStrokeStyle( 1, 0x6a6a6a );

        var txt = this.add.text ( 0, -60, 'Controls', {color:'#6e6e6e', fontFamily:'Oswald', fontSize : 20 } ).setOrigin(0.5);

        cont.add ( [rect, txt] );

        var btnData = [
            {
                'txt' : 'Restart',
                'func' : () => {
                    this.restartPrompt ();
                }
            },
            {
                'txt' : 'Leave Game',
                'func' : () => {
                    this.leavePrompt ();
                }
            },
            
        ];

        var bw = 270, bh = 50, bs = 10;

        for ( let i = 0; i < 2; i++ ){
            
            var btn = new MyButton ( this, 0,-15 + i*60, bw, bh, 'btn'+i, '', '', 0, btnData[i].txt );

            btn.on ('pointerdown', function () {
                this.scene.playSound ('clickc');

                this.getAt (0).setFillStyle ( 0xcecece, 1 );
            });
            btn.on ('pointerup', function () {
                
                if ( !this.scene.isGameOn ) return;

                this.getAt (0).setFillStyle ( 0xffffff, 1 );

                btnData [i].func();

            });

            cont.add ( btn );
            
        }

    }

    
}