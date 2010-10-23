package exploris.aquarium;
/**
* TurtleViewPane
*
* @author: Stephan Jamieson
*
* @version: 1.0
* date: 12.08.2003
*
*/
import java.awt.Color;
import java.awt.Dimension;
import java.awt.FlowLayout;

import java.util.Iterator;
import java.util.Set;
import javax.swing.JPanel;
import javax.swing.SwingUtilities;
//
import exploris.graphics.Canvas;
import exploris.motion.Position;
//
public class TurtleViewPane extends JPanel {

    
    private Canvas canvas;
    private TrackerManager spriteManager;
    private TrackerManager trailRecorderManager;


    public TurtleViewPane() {
    super(null);
    canvas = new Canvas();
    this.add(canvas);
    spriteManager = new TrackerManager();
    trailRecorderManager = new TrackerManager();
    } 
       
    public void setSize(int width, int height) {
    super.setSize(width, height);
    canvas.setSize(width, height);
    }

    public void setSize(Dimension dimension) {
    this.setSize(dimension.width, dimension.height);
    }

    public void removeTraces() {
        this.canvas.erase();
    }
    
    public void add(Turtle turtle, Position position) {
    TrailRecorder trailRecorder = new TrailRecorder(this.canvas, position);
    trailRecorderManager.registerTracker(turtle, trailRecorder);

    final TurtleSprite sprite = new TurtleSprite(position);
    spriteManager.registerTracker(turtle, sprite);

    sprite.setForeground(turtle.getColor());

    Runnable turtleInjector = new Runnable() {
        
        public void run() {
            add(sprite,0);
            invalidate();
            repaint();
        }
        };
    SwingUtilities.invokeLater(turtleInjector);
    }

    public boolean contains(Turtle turtle) {
        return spriteManager.tracking(turtle);
    }
    
    public void removeTurtle(Turtle turtle) {
    
    Set sprites = spriteManager.viewTrackers(turtle);
    Iterator iterator = sprites.iterator();
    while (iterator.hasNext()) {
        final TurtleSprite sprite = (TurtleSprite)iterator.next();

        Runnable turtleExtractor = new Runnable() {

            public void run() {
            remove(sprite);
            invalidate();
            repaint();
            }
        };
        SwingUtilities.invokeLater(turtleExtractor);
    }
    spriteManager.deregisterTrackers(turtle);
    trailRecorderManager.deregisterTrackers(turtle);
    }


    public boolean isEmpty() {
        return spriteManager.trackers()==0;
    }
    
    public void removeTurtles() {
        Set sprites = spriteManager.viewTrackers();
        Iterator iterator = sprites.iterator();

        while (iterator.hasNext()) {
            final TurtleSprite sprite = (TurtleSprite)iterator.next();
        
            Runnable turtleExtractor = new Runnable() {

                public void run() {
                    remove(sprite);
                    invalidate();
                    repaint();
                }
            };
            SwingUtilities.invokeLater(turtleExtractor);
        }        
        spriteManager.deregisterAll();
        trailRecorderManager.deregisterAll();    
    }

}
