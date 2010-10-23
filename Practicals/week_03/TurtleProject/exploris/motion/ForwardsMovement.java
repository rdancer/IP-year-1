package exploris.motion;
/**
* ForwardsMovement
*
* @author: Stephan Jamieson
*
* @version: 1.0
* date: 12.08.2003
*
*/
public class ForwardsMovement extends Movement {

    private int distance;

    public ForwardsMovement(int distance) {
	this.distance = distance;
    }

    public Position applyTo(Position position) {
	return position.move(this.distance);
    }

    public String toString() {
	return "forward "+distance+" steps";
    }
}
