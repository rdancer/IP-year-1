package exploris.aquarium;
/**
* TrackerManager
*
* @author: Stephan Jamieson
*
* @version: 1.0
* date: 12.08.2003
*
*/
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
//
import exploris.motion.MobileObject;
import exploris.motion.Tracker;
//
class TrackerManager {

    private Map register;

    public TrackerManager() {
    register = new HashMap();
    }

    public Set viewTrackers(MobileObject subject) {

        return new HashSet((Set)register.get(subject));
    }

    public Set viewTrackers(){
        Set result = new HashSet();
        Set keySet = register.keySet();
        Iterator iterator = keySet.iterator();
        while (iterator.hasNext()) {
            Set trackers = (Set)register.get(iterator.next());
            result.addAll(trackers);
        }
        return result;
    }
    
    public boolean tracking(Turtle turtle) {
        return (register.containsKey(turtle));
    }

    public int trackers() {
        return register.size();
    }
    
    public void registerTracker(MobileObject subject, Tracker tracker) {

    subject.addTracker(tracker);
    if (register.containsKey(subject)) {
        Set trackers = (Set)register.get(subject);
        trackers.add(tracker);
    }
    else {
        Set trackers = new HashSet();
        trackers.add(tracker);
        register.put(subject, trackers);
    }
    }

    public void deregisterTracker(MobileObject subject, Tracker tracker) {

    Set trackers = (Set)register.get(subject);
    subject.removeTracker(tracker);
    trackers.remove(tracker);
    if (trackers.isEmpty()) {
        register.remove(subject);
    }
    }

    public void deregisterTrackers(MobileObject subject) {

    Set trackers = (Set)register.get(subject);
    Iterator iterator = trackers.iterator();

    while(iterator.hasNext()) {
        Tracker tracker = (Tracker)iterator.next();
        subject.removeTracker(tracker);
    }
    register.remove(subject);
    }

    public void deregisterAll() {

    Set turtles = new HashSet(register.keySet());
    
    Iterator iterator = turtles.iterator();
    while (iterator.hasNext()) {

        Turtle turtle = (Turtle)iterator.next();
        deregisterTrackers(turtle);
    }
    }
}
