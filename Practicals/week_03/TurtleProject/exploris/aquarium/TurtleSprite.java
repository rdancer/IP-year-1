package exploris.aquarium;
/**
* TurtleSprite
*
* @author: Stephan Jamieson
*
* @version: 1.0
* date: 12.08.2003
*
*/
import java.awt.Component;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.Polygon;
import java.awt.Rectangle;
//
import javax.swing.JPanel;
import javax.swing.SwingUtilities;
//
import exploris.motion.MobileObject;
import exploris.motion.Movement;
import exploris.motion.PositionTracker;
import exploris.motion.PositionTrackerAdapter;
import exploris.motion.Position;
//
class TurtleSprite extends Component implements PositionTracker
{
        
    private PositionTrackerAdapter positionTracker;

    public TurtleSprite(Position position) {
    
        positionTracker = new PositionTrackerAdapter(position);   
        this.turtleShape = new TurtleShape();

        Rectangle boundsOfShape = turtleShape.getBounds();
        this.setSize(this.getPreferredSize());
        this.setLocation(position.getLocation());
    }
    
    public Position getPosition() { return positionTracker.getPosition(); }

    public void setPosition(Position position) { 
	positionTracker.setPosition(position); 
	this.setLocation(position.getLocation());
    }
 
    public void update(MobileObject  subject, Movement arg) {

	positionTracker.update(subject, arg);
      
	Runnable positioner = new Runnable() { 
		public void run() {
		    setLocation(positionTracker.getPosition().getLocation());
		}
	    };
	SwingUtilities.invokeLater(positioner);

	this.invalidate();
	this.repaint();
    }

    // Graphical elements

    private static class TurtleShape extends Polygon {
   
        TurtleShape() {
        
            super();  
            this.addPoint(0,0);
            this.addPoint(-6, 0);
            this.addPoint(0, -15);
            this.addPoint(6,0);
            this.addPoint(0,0);
        }
    }

    private TurtleShape turtleShape;

    public void setLocation(Point centrePoint) {
        Point location = new Point(centrePoint);
        location.translate(-(this.getSize().width/2), -(this.getSize().height/2 ));
        super.setLocation(location);
    }

    public Dimension getPreferredSize() {
        Rectangle boundsOfShape = turtleShape.getBounds();
        return new Dimension(boundsOfShape.width*2, boundsOfShape.height*2);
    }
    
    public Dimension getMinimumSize() {
    
        return this.getPreferredSize();
    }
    
    public Dimension getMaximumSize() {
    
        return this.getPreferredSize();
    }
    
    public void paint(Graphics graphics) {
        super.paint(graphics);
        Graphics2D graphics2D = (Graphics2D)graphics;
        graphics2D.translate(this.getWidth() /2, this.getHeight() /2);
        graphics2D.rotate(Math.toRadians(positionTracker.getPosition().getOrientation()));
        graphics2D.fill(turtleShape);
    }
        
    public String toString() {
        return "Sprite "+this.getLocation()+":"+this.getSize();
    }
}
