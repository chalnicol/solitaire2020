
window.onload = function () {

    var config = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT,
            parent: 'game_div',
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 1920,
            height: 1080
        },
        backgroundColor: '#f5f5f5',
        scene: [ Preloader, SceneA, SceneB ]
    };

    new Phaser.Game(config);

} 
window.onerror = function ( err ) {

    document.createElement ('div').innerHTML ( err );
    
}