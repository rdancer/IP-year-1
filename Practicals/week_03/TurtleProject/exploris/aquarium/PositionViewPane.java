package exploris.aquarium;
/**
* PositionViewPane
*
* @author: Stephan Jamieson
*
* @version: 1.0
* date: 12.08.2003
*
*/
import javax.swing.SwingUtilities;

import exploris.gui.GUITracker;
import exploris.gui.PositionForm;

import exploris.motion.MobileObject;
import exploris.motion.Movement;
import exploris.motion.Position;
import exploris.motion.PositionTracker;


//
public class PositionViewPane extends PositionForm implements PositionTracker, GUITracker {

    public PositionViewPane(Position position) {
	super();
	super.setEditable(false);
	this.setValue(position);
    }

    public void setEditable(boolean value) { }

    public Position getPosition() { return this.getValue(); }

    public void setPosition(Position position) { 
	this.setValue(position); 
    }

    public void update(MobileObject o, final Movement movement) {
	Runnable valueSetter = new Runnable() {

		public void run() {
		    setValue(movement.applyTo(getValue()) );
		}
	    };
	SwingUtilities.invokeLater(valueSetter);
    }

}
