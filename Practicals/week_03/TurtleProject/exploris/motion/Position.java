package exploris.motion;
/**
* Position
*
* @author: Stephan Jamieson
*
* @version: 1.0
* date: 12.08.2003
*
*/
import java.awt.Point;
//
public class Position {

    private Point location;
    private int orientation;

    public Position(int x, int y, int orientation) {
	this(new Point(x, y), orientation);
    }

    public Position(Point point, int orientation) {
	this.location = new Point(point);
	this.orientation = orientation;
    }

    public Position(Position other) {
	this.location = other.getLocation();
	this.orientation = other.getOrientation();
    }

    public Position rotate(int degrees) {

	int orientation = this.orientation;

	if (Math.abs(degrees)> 360) {
	    degrees = degrees % 360;
	}

	if (degrees < 0 ) {
	    orientation = (orientation+360+degrees) % 360;
	}
	else {
	    orientation = (orientation+degrees) % 360;
	}
	return new Position(this.getLocation(), orientation);
    }


    public Position move(int distance) {
 
	double newX = this.getLocation().x + distance*Math.sin( Math.toRadians( this.getOrientation()) );
	double newY = this.getLocation().y - distance*Math.cos( Math.toRadians( this.getOrientation()) );

	Point newPoint = new Point();
	newPoint.setLocation(newX, newY);

	return new Position(newPoint, this.getOrientation());
    }

    public int getOrientation() { return this.orientation; }
    public Point getLocation() { return new Point(this.location); }
	

    public boolean equals(Object o) {

	if (! (o instanceof Position)) {
	    return false;
	}
	else {
	    Position other = (Position)o;
	    return other.getLocation().equals(this.getLocation()) 
		&& other.getOrientation()==this.getOrientation();
	}
    }

    public String toString() {
	return "["+this.getLocation()+", "+this.getOrientation()+"]";
    }

}
