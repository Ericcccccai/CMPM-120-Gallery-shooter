// An example of putting sprites on the screen using Phaser
// 
// Art assets from Kenny Assets "Shape Characters" set:
// https://kenney.nl/assets/shape-characters

// debug with extreme prejudice
"use strict"

import GalleryShooter from './Scenes/galleryShooter.js';

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    backgroundColor: '#1e1e1e',
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    width: 800,
    height: 600,
    fps: { forceSetTimeOut: true, target: 30 },
    scene: [GalleryShooter]
}

const game = new Phaser.Game(config);