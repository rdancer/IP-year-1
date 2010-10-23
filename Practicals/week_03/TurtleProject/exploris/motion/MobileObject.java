package exploris.motion;
/**
* MobileObject
*
* @author: Stephan Jamieson
*
* @version: 1.0
* date: 12.08.2003
*
*/
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;
//
public class MobileObject {

    private Set trackers = new HashSet();
    private boolean moved = false;

    public void setMoved() { moved = true; }

    public void addTracker(Tracker tracker) {
	trackers.add(tracker);
    }

    public void removeTracker(Tracker tracker) {
	trackers.remove(tracker);
    }

    public void notifyTrackers(Movement movement) {

	if (moved) {
	    Iterator iterator = trackers.iterator();

	    while(iterator.hasNext()) {
		
		Tracker tracker = (Tracker)iterator.next();
		
		tracker.update(this, movement);
	    }
	    moved = false;
	}
    }

}
