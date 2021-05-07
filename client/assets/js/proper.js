class Proper extends Phaser.Scene {

    constructor ()
    {
        super('Proper');
    }

    create () {
        this.add.rectangle ( 100, 100, 100, 100, 0xffff00, 1 );
    }

    creates ( data ) 
    {

        this.mode = data.mode == 0 ? 'easy' : 'hard';

        this.cardDimensions = { w : 130,  h : 170 };

        this.isGameOn = false;

        this.add.image ( 960, 540, 'bg');

        this.initMenuSound();

        this.initCardsHolder ();

        this.initControls();

        this.time.delayedCall ( 300, () => {

            this.initCards ();

        }, [], this );


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

    initCards () {


        this.isGameOn = true;

        this.cardsMoving = false;
        
        this.vel = 150;

        this.initialCards = [];

        this.fieldCards = [];

        
        this.flippedCardsCount = 0;

        this.shownCardsCount = 0;


        //create cards on initbox..

        this.cardContainer = this.add.container( 0, 0 );

        const rndOrd = this.generateRandomOrder ();

        const cardData = this.cardDimensions;
        
        let initBox = this.mainContainer.getByName ('initBox');

        const strVal = ['A', '2','3','4','5','6','7','8','9','10','J','Q', 'K' ];

        for ( var i = 0; i < rndOrd.length; i++ ) {

            let knd = Math.floor ( rndOrd[i] / 13 ),

                val = rndOrd [i] % 13,
            
                str = strVal [ val ];

            let crd = new Card ( this, initBox.x, initBox.y, cardData.w, cardData.h, i, knd, val, str, false );

            crd.on ('pointerdown', function () {

                this.scene.cardClick ( this );
            
            });

            this.cardContainer.add ( crd );

            this.initialCards.push ( crd );

        }

        //create cards on the field..


        let counter = 0;

        for ( let i = 0; i < 7; i++ ) {

            this.fieldCards [i] = [];

            var fieldBox = this.mainContainer.getByName ('field' + i );

            for ( var j = 0; j < (i + 1); j++ ) {

                var card = this.cardContainer.getByName ('card' + ( 51 - counter ));

                this.cardContainer.bringToTop ( card );

                card.setFieldPost ( i, j );

                if ( i == j ) card.flip().enabled();

                this.tweens.add ({
                    targets : card,
                    x : fieldBox.x,
                    y : fieldBox.y + (j * 33),
                    duration : 100,
                    ease : 'Power2',
                    delay : counter * 10,
                    
                });

                this.fieldCards [i].push ( card );

                this.initialCards.pop();

                counter += 1;
            }
        }

        this.playSound ('ending');

    }
}