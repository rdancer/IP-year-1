package exploris.motion;
/**
* PositionTrackerAdapter
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
import java.util.Observable;
import java.util.Observer;
//
import javax.swing.JPanel;
//
public class PositionTrackerAdapter implements PositionTracker
{
         
    private Position position; 
   

    public PositionTrackerAdapter(Position position) {
	this.position = position;
    }

    public Position getPosition() { return this.position; }

    public void setPosition(Position position) { 
	this.position = position; 
    }

    public void update(MobileObject o, Movement movement) {
  
        this.setPosition(movement.applyTo(this.getPosition()) );
    }

}
