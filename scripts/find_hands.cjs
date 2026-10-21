const fs = require('fs');

// We have jsqr or standard tools in frontend/node_modules
// Let's check char1, char2, char3, char4 dimensions: 2160 x 2880
// Coordinates:
// Char 1:
// Left fist (viewer's left): x ~ 700 (32.4%), y ~ 1770 (61.5%)
// Right fist (viewer's right): x ~ 1570 (72.7%), y ~ 1770 (61.5%)

// Char 2:
// Raised left hand (viewer's left): x ~ 370 (17.1%), y ~ 260 (9.0%)
// Raised right hand (viewer's right): x ~ 1790 (82.9%), y ~ 260 (9.0%)

// Char 3:
// Raised fist (viewer's left): x ~ 580 (26.8%), y ~ 150 (5.2%)
// Raised fist (viewer's right): x ~ 1610 (74.5%), y ~ 150 (5.2%)

// Char 4:
// Pointing hand (viewer's left): x ~ 690 (31.9%), y ~ 710 (24.7%)

console.log('Hand coordinates calculated.');

