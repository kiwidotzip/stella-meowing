import { drawBoxAtBlock, drawLine } from "../utils/renderUtils";

colors = [
  [255, 0, 0],
  [255, 255, 0],
  [0, 255, 0],
  [0, 255, 255],
  [0, 0, 255],
  [255, 0, 255],
];
/*

function drawGayLine(x, y, z, x2, y2, z2, steps) {
  for (let i = 0; i < colors.length; i++) {
    let a = i;
    let b = i + 1;

    if (a > colors.length - 1) a -= colors.length;
    if (b > colors.length - 1) b -= colors.length;

    let sr = colors[b][0] - colors[a][0] / steps;
    let sg = colors[b][1] - colors[a][1] / steps;
    let sb = colors[b][2] - colors[a][2] / steps;

    for (let j = 0; j < steps; j++) {
      let r = (colors[a][0] + sr * j) / 255;
      let g = (colors[a][1] + sg * j) / 255;
      let b = (colors[a][2] + sb * j) / 255;

      let fx1 =
        j * ((x2 - x) / (colors.length * steps)) +
        i * ((x2 - x) / colors.length);
      let fx2 =
        j * ((x2 - x) / (colors.length * steps)) +
        i * ((x2 - x) / colors.length) +
        (x2 - x) / (colors.length * steps);

      drawLine(fx1, y, z, fx2, y2, z2, 1, 0, 0, 1);
    }
  }
}
*/

register("renderWorld", () => {
  let [x, y, z] = [
    Player.lookingAt().getX(),
    Player.lookingAt().getY(),
    Player.lookingAt().getZ(),
  ];

  drawBoxAtBlock(x, y, z, 1, 1, 1, 1, 1, 1);

  //drawGayLine(x, y, z, x + 1, y, z, 3);
  drawLine(x, y, z, x + 1, y, z, 1, 1, 1, 1);
});
