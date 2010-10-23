package exploris.aquarium;
/**
* Turtle
* 
* A Turtle object represents a simple robot. It can move forwards, rotate left or right, 
* and weirdly, it carries a pen. When lowered, the pen draws a trace on the ground.
*
* @author: Stephan Jamieson
*
* @version: 1.0
* date: 12.08.2003
*
*/
import java.awt.Color;
//
import exploris.motion.ForwardsMovement;
import exploris.motion.MobileObject;
import exploris.motion.PauseControl;
import exploris.motion.Rotation;
//
public class Turtle extends MobileObject {

    private String name;
    private boolean penDown;
    private Color color;
    private PauseControl pauseControl;
    
    public Turtle() {
    this(Color.black);
    }
        
    /**
     * Create a Turtle named "Turtle" that will draw in the given colour.
     * 
     * @param the colour in which the Turtle will draw when the pen is down.
     */
    public Turtle(Color color) {
    this(color, "Turtle");
    }

    /** 
     * Create a Turtle with the given name and that will draw in black.
     * 
     * @param a name for the Turtle.
     */
    public Turtle(String name) {
    this(Color.black, name);
    }

    public Turtle(Color color, String name) {
    super();
    this.color = color;
    this.name = name;
    this.penDown = true;
    pauseControl = new PauseControl();
    }


    public String getName() {
    return this.name;
    }

    public void left(int angle) {
    this.right(-angle);
    }
    
    public void right(int angle) {
    // Inform observers of reorientation
    this.setMoved();
    this.notifyTrackers( new Rotation(angle) );
    pauseControl.pause();
    }
    
    public void forward(int distance) {
    
    // Inform observers of repositioning
    this.setMoved();
    this.notifyTrackers( new ForwardsMovement(distance) );
    pauseControl.pause();
    }
    
    
    public void penUp() { 
    penDown = false;
    }
    
    public void penDown() {
    penDown = true;
    }
    
    public boolean isPenDown() {
    return penDown;
    }
    
    
    public void setColor(Color color) {
        this.color = color;
    }
    
    public Color getColor() {
        return this.color;
    }
    

    public void setPause(int milliseconds) {
    pauseControl.setPause(milliseconds);
    }

    public String toString() {
    return "Turtle("+this.getName()+")";
    }
    
    
}
        
