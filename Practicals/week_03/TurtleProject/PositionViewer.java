import java.awt.Color;
//
/**
* A PositionViewer is an object that can be used to obtain a graphical display that tracks a Turtle's position.
* 
* @author: Stephan Jamieson
*
* @version: 1.0
* date: 12.08.2003
*
*/
public class PositionViewer extends exploris.aquarium.PositionViewer {


    /**
     * Create a new PositionViewer for "t" currently at position "x", "y" and "angle" degrees clockwise from North.
     * 
     */
    public PositionViewer(Turtle t, int x, int y, int angle) {
        super(t, x, y, angle);
    }
    
    /**
     * Create a graphical display of the PositionViewer on the computer screen.
     */
    public void display() {
        super.display();
    }

}
