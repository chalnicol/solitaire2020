class Preloader extends Phaser.Scene {

    constructor ()
    {
        super('Preloader');
    }

    preload ()
    {

    }
    create () {
        this.add.text ( 960, 540, 'chalnicol', { color: '#333', fontFamily:'Oswald', fontSize:50 });
    }
    preloada ()
    {
        
         
        const rW = 510, rH = 30;

        let preloadCont = this.add.container ( 960, 540 );

        let txta = this.add.text ( 0, -(rH + 30), 'Loading Files : 0%', { color:'#3a3a3a', fontFamily: 'Oswald', fontSize: 30 }).setOrigin(0.5);

        let recta = this.add.rectangle ( 0, 0, rW + 8, rH + 8 ).setStrokeStyle ( 2, 0x0a0a0a );

        let rectb = this.add.rectangle ( -rW/2, -rH/2, 5, rH, 0x3a3a3a, 1 ).setOrigin ( 0 );

        preloadCont.add ( [ txta, recta, rectb ] );


        this.load.on ('complete', function () {

            preloadCont.visible = false;

            this.showProceed ();

        }, this);

        this.load.on ('progress', function (progress) {

            preloadCont.last.width = progress * rW;

            preloadCont.first.text = 'Loading Files : ' +  Math.floor (progress  * 100)  + '%';

        });
        
        this.load.audioSprite('sfx', 'client/assets/sfx/fx_mixdown.json', [
            'client/assets/sfx/sfx.ogg',
            'client/assets/sfx/sfx.mp3'
        ]);
        
        this.load.audio ('properBg', ['client/assets/sfx/starcommander.ogg', 'client/assets/sfx/starcommander.mp3'] );

        this.load.audio ('introBg', ['client/assets/sfx/lounge.ogg', 'client/assets/sfx/lounge.mp3'] );
        
        this.load.image('bg', 'client/assets/images/bg.jpg');

        this.load.image('title', 'client/assets/images/title.png');

        this.load.image('clickhere', 'client/assets/images/clickhere.png');

        this.load.spritesheet('menu', 'client/assets/images/menu.png', { frameWidth: 368, frameHeight: 380 });

        this.load.spritesheet('proceed', 'client/assets/images/proceed.png', { frameWidth: 180, frameHeight: 180 });

        this.load.spritesheet('kinds', 'client/assets/images/kinds.png', { frameWidth: 100, frameHeight: 100 });

        this.load.spritesheet('kinds_sm', 'client/assets/images/kinds_sm.png', { frameWidth: 25, frameHeight: 25 });

        this.load.spritesheet('card', 'client/assets/images/card.png', { frameWidth: 140, frameHeight: 190 });

        this.load.spritesheet('people', 'client/assets/images/people.png', { frameWidth: 100, frameHeight: 135 });

    }

    showProceed () {

        var click = this.add.image ( 960, 540, 'clickhere');

        var img = this.add.image ( 960, 540, 'proceed').setInteractive ();

        img.on ('pointerover', function () {
            this.setFrame (1);
        });
        img.on ('pointerdown', function () {
            this.setFrame (2);
        });
        img.on ('pointerout', function () {
            this.setFrame (0);
        });
        img.on ('pointerup', () => {

            this.scene.start('SceneA');
        });

    }
    
    
}
