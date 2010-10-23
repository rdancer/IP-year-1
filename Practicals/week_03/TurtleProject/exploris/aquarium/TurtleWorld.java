package exploris.aquarium;
/**
* TurtleWorld
*
* @author: Stephan Jamieson
*
* @version: 1.0
* date: 12.08.2003
*
*/
import java.awt.Color;
import java.awt.BorderLayout;
import java.awt.GraphicsEnvironment;
import java.awt.GraphicsDevice;
import java.awt.GraphicsConfiguration;
import java.awt.Point;
import java.awt.Rectangle;
//
import javax.swing.JFrame;
//
import exploris.gui.Viewer;
//
import exploris.motion.Position;
//
public class TurtleWorld extends Viewer {

    private Color color;
    

    public TurtleWorld(int width, int height) {
	this(width, height, "Turtle World");
    }

    public TurtleWorld(int width, int height, Color color) {
        this(width, height, "Turtle World", color);
    }
    
    public TurtleWorld(int width, int height, String title) {
	this(width, height, title, Color.white);
    }

    public TurtleWorld(int width, int height, String title, Color color) {
	super(new TurtleViewPane(), title);
	//this.setExitOnClosing(true);

	TurtleViewPane turtleViewPane = (TurtleViewPane)this.getView();
	turtleViewPane.setSize(width, height);
	turtleViewPane.setPreferredSize(turtleViewPane.getSize());
	turtleViewPane.setBackground(color);
    }

    public void dropIn(Turtle turtle) {
	int frameWidth = this.getView().getWidth();
	int frameHeight = this.getView().getHeight();
	this.dropIn(turtle, frameWidth/2, frameHeight/2, 0);
    }

    public void dropIn(Turtle turtle, int x, int y) {
	this.dropIn(turtle, x, y, 0);
    }

    public void dropIn(Turtle turtle, Position position) {
	((TurtleViewPane)this.getView()).add(turtle, position);
    }

    public void dropIn(Turtle turtle, int x, int y, int angle) {
	this.dropIn(turtle, new Point(x, y), angle);
    }

    public void dropIn(Turtle turtle, Point point, int angle) {
	this.dropIn(turtle, new Position(point, angle));
    }

    public boolean contains(Turtle turtle) {
        return ((TurtleViewPane)this.getView()).contains(turtle);
    }
    
    public boolean isEmpty() {
        return ((TurtleViewPane)this.getView()).isEmpty();
    }
    
    public void display() {
	super.display();
	try{ Thread.sleep(500); }
	catch (InterruptedException e) {};
    }

    public static TurtleWorld createOcean(int width, int height) {
	return new TurtleWorld(width, height, "The Deep Blue Sea", new Color(0, 90, 190));
    }

    public static TurtleWorld createBeach(int width, int height) {
	return new TurtleWorld(width, height, "White Sands", new Color(255, 255, 240));
    }

    public void viewerClosing() {
	((TurtleViewPane)this.getView()).removeTurtles();
    }

    public void removeTraces() {
        ((TurtleViewPane)this.getView()).removeTraces();
    }
    
    public void removeTurtle(Turtle turtle) {
	((TurtleViewPane)this.getView()).removeTurtle(turtle);
    }

    public void removeTurtles() {
	((TurtleViewPane)this.getView()).removeTurtles();
    }

}    
    
