/* 
there are many options for collision detection,
the most common methods are between rectangles and circles, 
more advanced detection methods can use the separating axis theorem for convex or concave polygons that are not axis aligned.
For these types of detection, it is more efficient to wrap these complex polygons in simple rectangles and only run your more complex
detection algo if the rectangles collide, meaning there is a chance these polygons will collide. 
Other common detection methods include point/circle, point/rectangle, line/circle, line/rectangle, line/line.
you can also detect collision by color. 
*/

//collision between rectangles that are axis aligned
//compares x and y coordinates and width and height values,
//if there is a gap, there is no collision, if they are overlapping, there is a collision

let rect1 = { x: 5, y: 5, width: 50, height: 50 };
let rect2 = { x: 20, y: 10, width: 10, height: 10 };

//check for gap between elements, no collision, if the gap no longer exists, collision

if (
  rect1.x > rect2.x + rect2.width ||
  rect1.x + rect1.width < rect2.x ||
  rect1.y > rect2.y + rect2.height ||
  rect1.y + rect1.height < rect2.y
) {
  //no collision detected
} else {
  //collision detected
}

//INVERSE checks for overlap, if so then collision detected, if not then no collision detected

if (
  rect1.x < rect2.x + rect2.width ||
  rect1.x + rect1.width > rect2.x ||
  rect1.y < rect2.y + rect2.height ||
  rect1.y + rect1.height > rect2.y
) {
  //collision detected
} else {
  //no collision
}

/* 
collision between circles
creates a line between the center point of two circles and checks if the line is less than the sum of the radii of the circles
uses pythagoreums theorum to find the hypotenuse of a right triangle made using the x and y coordinates of the center point of both circles 
*/

let circle1 = { x: 10, y: 10, radius: 300 };
let circle2 = { x: 500, y: 500, radius: 150 };

//A^2
let distanceBetweenXCoords = circle2.x - circle1.x;
//B^2
let distanceBetweenYCoords = circle2.y - circle1.y;
//C^2
let hypotenuse = Math.sqrt(
  distanceBetweenXCoords * distanceBetweenXCoords +
    distanceBetweenYCoords * distanceBetweenYCoords
);
//Break case for length of hypotenuse
let sumOfRadii = circle1.radius + circle2.radius;

if (hypotenuse < sumOfRadii) {
  //collision
} else {
  //no collision
}
