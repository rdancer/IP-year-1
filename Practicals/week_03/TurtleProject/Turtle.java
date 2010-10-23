import java.awt.Color;
//
/**
* A Turtle is an object that represents a simple robot. A Turtle can move forwards and can rotate left and right. 
* Weirdly, a Turtle is a well prepared robot and it carries a pen. It can raise or lower the pen. 
* When lowered, the pen draws a trace on the ground.
* 
* @author: Stephan Jamieson
*
* @version: 1.0
* date: 12.08.2003
*
*/
public class Turtle extends exploris.aquarium.Turtle {


    /**
     * Create a new Turtle that draws lines in black.
     */
    public Turtle() {
        super(Color.black);
    }

    /**
     * Create a new Turtle with a pen coloured "c".
     */
    public Turtle(Color c) {
        super(c, "Turtle");
    }

    /**
     * Create a new Turtle and give it a "name".
     */
    public Turtle(String name) {
        super(Color.black, name);
    }

    /**
     * Create a new Turtle with the given "name" and a with a pen coloured "c".
     */
    public Turtle(Color color, String name) {
        super(color, name);
    }

    /**
     * Ask the Turtle its name.
     */
    public String getName() {
        return super.getName();
    }
    /**
     * Instruct the Turtle to rotate left through "angle" degrees.
     */
    public void left(int angle) {
        super.left(angle);
    }
    
    /**
     * Instruct the Turtle to rotate right through "angle" degrees.
     */
    public void right(int angle) {
        super.right(angle);
    }
    
    /**
     * Instruct the Turtle to move "distance" forwards.
     */
    public void forward(int distance) {
        super.forward(distance);
    }
    
    
    /**
     * Instruct the Turtle to raise its pen.
     */
    public void penUp() { 
        super.penUp();
    }
    
    
    /**
     * Instruct the Turtle to lower its pen.
     */
    public void penDown() {
        super.penDown();
    }
    
    /**
     * Ask the Turtle if it has lowered its pen.
     */
    public boolean isPenDown() {
        return super.isPenDown();
    }
    
    /**
     * Change the Turtle's pen to one coloured "c".
     */
    public void setColor(Color c) {
        super.setColor(c);
    }
    
    /**
     * Ask the Turtle for the current pen colour.
     */
    public Color getColor() {
        return super.getColor();
    }
    

    /**
     * Instruct the Turtle to pause by "milliseconds" amount between steps.
     * 
     */
    public void setPause(int milliseconds) {
        super.setPause(milliseconds);
    }


}
