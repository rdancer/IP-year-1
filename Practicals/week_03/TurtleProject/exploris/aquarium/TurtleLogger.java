package exploris.aquarium;
/**
* TurtleLogger
*
* @author: Stephan Jamieson
*
* @version: 1.0
* date: 12.08.2003
*
*/
import javax.swing.border.Border;
import javax.swing.border.LineBorder;
import javax.swing.JComponent;
import javax.swing.JFrame;
import javax.swing.JScrollBar;
//
public class TurtleLogger extends TurtleViewer {

 
 

    public TurtleLogger(Turtle turtle) {
	this(turtle, 10, 20);
    }

    public TurtleLogger(Turtle turtle, int columns, int rows) {
	super(turtle, new MovementLogPane(columns, rows), turtle.getName());
	
	((JComponent)this.getView()).setBorder(new LineBorder(turtle.getColor(), 3)); 
	((JComponent)this.getView()).setBackground(turtle.getColor());
    }
}

