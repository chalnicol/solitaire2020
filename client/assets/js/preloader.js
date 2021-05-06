class Preloader extends Phaser.Scene {

    constructor ()
    {
        super('Preloader');
    }
    preload ()
    {
        
        let _gW = this.game.config.width,
            _gH = this.game.config.height;

        this.add.text ( _gW/2, _gH/2, '', { fontSize: 36, fontFamily:'Oswald', color:'#fff'}).setOrigin(0.5);

        let txt = this.add.text (_gW/2, _gH*0.43, 'Loading : 0%', { color:'#333', fontFamily:'Oswald', fontSize:20 }).setOrigin(0.5);

        //..
        let brct = this.add.rectangle ( (_gW - 350 )/2, _gH/2, 350, 40 ).setStrokeStyle (3, 0x0a0a0a).setOrigin(0, 0.5);
        //..
        let rW = 340, rH = 30;

        let rct = this.add.rectangle ( (_gW - rW)/2, _gH/2, 5, rH, 0x6a6a6a, 1 ).setOrigin(0, 0.5);

        this.load.on ('complete', function () {
            this.scene.start('SceneA');
        }, this);

        this.load.on ('progress', function (progress) {

            txt.setText ( 'Loading : ' + Math.ceil( progress * 100 ) + '%' );

            if ( (rW * progress) > 5) rct.setSize ( rW * progress, rH );

        });

        
        this.load.audioSprite('sfx', 'client/assets/sfx/fx_mixdown.json', [
            'client/assets/sfx/sfx.ogg',
            'client/assets/sfx/sfx.mp3'
        ]);
        
        this.load.audio ('properBg', ['client/assets/sfx/starcommander.ogg', 'client/assets/sfx/starcommander.mp3'] );

        this.load.audio ('introBg', ['client/assets/sfx/lounge.ogg', 'client/assets/sfx/lounge.mp3'] );
        
        this.load.spritesheet('kinds', 'client/assets/images/kinds.png', { frameWidth: 100, frameHeight: 100 });

        this.load.spritesheet('kinds_sm', 'client/assets/images/kinds_sm.png', { frameWidth: 25, frameHeight: 25 });

        this.load.spritesheet('card', 'client/assets/images/card.png', { frameWidth: 140, frameHeight: 190 });

        this.load.spritesheet('menu_btn', 'client/assets/images/menu_btn.png', { frameWidth: 255, frameHeight: 255 });

        this.load.spritesheet('people', 'client/assets/images/people.png', { frameWidth: 100, frameHeight: 135 });

    }
    
}
