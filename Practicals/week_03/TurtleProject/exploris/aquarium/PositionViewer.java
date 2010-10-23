package exploris.aquarium;
/**
* PositionViewer
*
* @author: Stephan Jamieson
*
* @version: 1.0
* date: 12.08.2003
*
*/
import java.awt.Color;
import java.awt.Point;
//
import javax.swing.border.Border;
import javax.swing.border.LineBorder;
import javax.swing.JComponent;
//
import exploris.motion.Position;
//
public class PositionViewer extends TurtleViewer {


    public PositionViewer(Turtle turtle,  Position position) {
	super(turtle, new PositionViewPane(position), turtle.getName());

	this.getView().setBackground(Color.white);
	((JComponent)this.getView()).setBorder(new LineBorder(turtle.getColor(), 2)); 
    }

    public PositionViewer(Turtle turtle, int x, int y, int angle) {
	this(turtle, new Position(new Point(x, y), angle));
    }

}
