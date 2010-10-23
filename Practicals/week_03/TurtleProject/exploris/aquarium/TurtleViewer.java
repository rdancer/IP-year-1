package exploris.aquarium;
/**
* TurtleViewer
*
* @author: Stephan Jamieson
*
* @version: 1.0
* date: 12.08.2003
*
*/
import java.awt.Color;
import java.awt.Component;
//
import javax.swing.border.Border;
import javax.swing.border.LineBorder;
import javax.swing.JFrame;
//
import exploris.gui.GUITracker;
import exploris.gui.Viewer;
//
public class TurtleViewer extends Viewer {

    private Turtle subject;

    public TurtleViewer(Turtle turtle, GUITracker view) {
	this(turtle, view, "");
    }

    public TurtleViewer(Turtle turtle, GUITracker view, String title) {
	super((Component)view, title);
	subject = turtle;
	subject.addTracker(view);
    }

    public void viewerClosing() {
	subject.removeTracker((GUITracker)this.getView());
    }

}
