# fliu0820_tut3_groupE Creative-coding-major-project

- *** Instructions for use ***
The project will start playing automatically after running, looping every 30 seconds

- *** Project Introduction: ***
This project is based on Claude Monet's work "Saint Georges majeur au crépuscule", through the use of dynamic colour changes and animation effects, reproduces the work and its creative process. An animated screen with dynamic lines and background stars was created using p5.js. The lines in the animation take their colours from the background and the image of the tower and change dynamically over time.

*** The dynamic line colour change and background star movement is achieved by frameCount, a global variable in p5.js. ***

- *** Colour transitions: ***
  In each frame, the frameCount is first calculated relative to the progress of the colour change period colorChangePeriod, which is implemented in the getDynamicColor function, which interpolates between different colours based on the value of progress, and uses the lerpColor function to Smoothly changes the colour.

  ```
  function helloWorld() {
  console.log("Hello, world!");
  }
  ```

- *** Dynamic colour application: ***
  Dynamic lines are drawn by first picking up the colour from the background image and changing the colour over time. The properties of the line are defined by the Line class and include properties such as position, colour, thickness, direction and speed. The position of the line is updated by the update method to move it around the screen and achieve dynamic effects. The getDynamicColor function applies the current transition colour, allowing the line colour to change dynamically.

- *** Dynamic colour application: ***
  Dynamic lines are drawn by first picking up the colour from the background image and changing the colour over time. The properties of the line are defined by the Line class and include properties such as position, colour, thickness, direction and speed. The position of the line is updated by the update method to move it around the screen and achieve dynamic effects. The getDynamicColor function applies the current transition colour, allowing the line colour to change dynamically.
