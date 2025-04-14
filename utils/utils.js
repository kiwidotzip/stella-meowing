/*  ------------- General Utilities -------------

    General skyblok utilities

    ------------------- To Do -------------------

    - Nothing :D

    --------------------------------------------- */

//calculates the distance between 2 points using the 3d distance formula
export const calcDistance = (p1, p2) => {
    var a = p2[0] - p1[0];
    var b = p2[1] - p1[1];
    var c = p2[2] - p1[2];

    let dist = a * a + b * b + c * c;

    if (dist < 0) {
        dist *= -1;
    }
    return dist;
};
