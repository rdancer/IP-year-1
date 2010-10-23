package exploris.motion;
/**
* Rotation
*
* @author: Stephan Jamieson
*
* @version: 1.0
* date: 12.08.2003
*
*/
public class Rotation extends Movement {

    private int degrees;

    public Rotation(int degrees) {
	this.degrees = degrees;
    }

    public Position applyTo(Position position) {
	return position.rotate(this.degrees);
    }

    public String toString() {
	String result = " degrees";
	if (degrees<0) {
	    result="left "+(-degrees)+result;
	}
	else {
	    result="right "+degrees+" degrees";
	}
	return result;
    }
}
