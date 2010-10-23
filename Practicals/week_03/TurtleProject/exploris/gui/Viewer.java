package exploris.gui;
/**
* Viewer
*
* @author: Stephan Jamieson
*
* @version: 1.0
* date: 12.08.2003
*
*/
import java.awt.BorderLayout;
import java.awt.Component;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.awt.Point;
import javax.swing.WindowConstants;
import javax.swing.JFrame;
//
public abstract class Viewer {

    private JFrame jFrame;
    private Component view;

    public Viewer(Component view) {
	this(view, "");
    }

    public Viewer(Component view, String title) {

	this.view = view;

	jFrame = new JFrame(title);
	jFrame.getContentPane().add(view, BorderLayout.CENTER);
	jFrame.addWindowListener( new WindowAdapter(){
		public void WindowClosing(WindowEvent event) {
		    viewerClosing();
		}
	    });
    }

    public Component getView() { return view; }

    public void setExitOnClosing(boolean value) {
	if (value) {
	    jFrame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
	}
	else {
	    jFrame.setDefaultCloseOperation(WindowConstants.DISPOSE_ON_CLOSE);
	}
    }

    public void setLocation(int x, int y) {
	this.setLocation(new Point(x, y));
    }

    public void setLocation(Point point) {
	jFrame.setLocation(point);
    }

    public void display() {
	jFrame.pack();
	jFrame.setVisible(true);
    }
    
    public abstract void viewerClosing();

}
