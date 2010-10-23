import java.awt.Color;
import java.awt.Point;
//
import exploris.motion.Position;
//
/**
*
* A TurtleWorld represents a world within which Turtles can move around.
* Unlike the class declaration that describes Turtles, the one that describes TurtleWorlds does 
* instruct the computer on how they can be visually represented.
* 
* @author: Stephan Jamieson
*
* @version: 1.0
* date: 12.08.2003
*
*/

public class TurtleWorld extends exploris.aquarium.TurtleWorld {


    /**
     * Create a new TurtleWorld that is 500 units by 500 units in size.
     */
    public TurtleWorld() {
        this(500, 500);
    }
    
    /**
     * Create a new TurtleWorld of "width" and "height" dimensions.
     */
    public TurtleWorld(int width, int height) {
        super(width, height, "Turtle World");
    }

    /**
     * Create a new TurtleWorld of color "c" and of "width" and "height" dimensions.
     */
    public TurtleWorld(int width, int height, Color c) {
        super(width, height, c);
    }
    
    /**
     * Create a new TurtleWorld titled "title" and of "width and "height" dimensions.
     */
    public TurtleWorld(int width, int height, String title) {
        super(width, height, title);
    }

    /**
     * Create a new TurtleWorld titled "title", of colour "c" and of "width and "height" dimensions.
     */
    public TurtleWorld(int width, int height, String title, Color c) {
        super(width, height, title, c);
    }

    /**
     * Drop a Turtle denoted "t" into the world.
     * 
     * The Turtle will land in the world dead centre and facing North.
     */
    public void dropIn(Turtle t) {
        int frameWidth = this.getView().getWidth();
        int frameHeight = this.getView().getHeight();
        this.dropIn(t, frameWidth/2, frameHeight/2);
    }

    /**
     * Drop a Turtle denoted "t" into the world at the position "x", "y" and facing North.
     * 
     */
    public void dropIn(Turtle t, int x, int y) {
        this.dropIn(t, x, y, 0);
    }
    
    
    /**
     * Drop a Turtle "t" into the world at the position "x", "y" and facing "angle" degrees clockwise from North.
     */
    public void dropIn(Turtle t, int x, int y, int angle) {
        if (!this.contains(t)) {
            super.dropIn(t, x, y, angle);
        }
    }

    /**
     * Obtain a visual representation of the world on the computer screen.
     */
    public void display() {
        super.display();
    }

    /**
     * Cause the traces left by Turtles in the world to be erased.
     */
    public void removeTraces() {
        super.removeTraces();
    }
    

    /**
     * Remove "t" from this world.
     */
    public void removeTurtle(Turtle t) {
        if (this.contains(t)) {
            super.removeTurtle(t);
        }
    }

    /**
     * Remove all Turtles from this world.
     */
    public void removeTurtles() {
        if (! this.isEmpty()) {
            super.removeTurtles();
        }
    }

}    
    
