package exploris.motion;
/**
* PauseControl
*
* @author: Stephan Jamieson
*
* @version: 1.0
* date: 12.08.2003
*
*/
public class PauseControl {


    private final static int DEFAULT_PAUSE_PERIOD = 200; // milliseconds
    private int pausePeriod;
    private boolean pause;

    public PauseControl() {
	this(DEFAULT_PAUSE_PERIOD);
    }

    public PauseControl(int milliseconds) {
	pause = false;
	pausePeriod = milliseconds;
    }

    public void pause() {
	try{ Thread.sleep(pausePeriod); }
	catch (InterruptedException e) {};
    }
    
    
    public void pauseOn() {
	pause=true;
    }     
    
    public void setPause(int milliseconds) {
	this.pausePeriod = milliseconds;
    }

    public void pauseOff() {
	
	pause=false;
    }

}
