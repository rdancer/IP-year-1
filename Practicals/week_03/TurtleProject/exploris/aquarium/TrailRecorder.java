package exploris.aquarium;
/**
* TrailRecorder
*
* @author: Stephan Jamieson
*
* @version: 1.0
* date: 12.08.2003
*
*/
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.geom.Line2D;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.GraphicsConfiguration;
import java.awt.GraphicsDevice;
import java.awt.GraphicsEnvironment;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.awt.Point;
import java.awt.Transparency;
//
import java.util.Observable;
import java.util.Observer;
//
import exploris.graphics.Canvas;
//
import exploris.motion.MobileObject;
import exploris.motion.Movement;
import exploris.motion.Position;
import exploris.motion.PositionTrackerAdapter;
//
class TrailRecorder extends PositionTrackerAdapter
{

    private Canvas canvas;    
    
    public TrailRecorder(Canvas canvas, Position position) {
	super(position);
	this.canvas = canvas;
    }


    public void update(MobileObject  object, Movement movement) {

	Point oldLocation = this.getPosition().getLocation();
	this.setPosition( movement.applyTo(this.getPosition()) );
	Point newLocation = this.getPosition().getLocation();

	Turtle subject = (Turtle)object;
	if (subject.isPenDown() && (! oldLocation.equals(newLocation) )  ) {
	    Line2D line = new Line2D.Double(oldLocation, newLocation);
            
	    this.canvas.draw(line, subject.getColor());
	}

    }
  
}
