package exploris.motion;
/**
* PositionTracker
*
* @author: Stephan Jamieson
*
* @version: 1.0
* date: 12.08.2003
*
*/

public interface PositionTracker extends Tracker
{
    Position getPosition();

    void setPosition(Position position);

}
