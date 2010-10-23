import java.awt.Color;
//
import java.util.HashSet;
import java.util.Set;
import java.util.Iterator;
//
/**
* Did you know that one of the collective nouns for turtles is "bale"?
* 
* This class allows you to represent a bale. Turtles in a bale can be instructed as one. 
* 
* @author: Stephan Jamieson
*
* @version: 1.0
* date: 12.08.2003
*
*/
public class Bale extends Turtle {

    private Set turtles;
    private String name;

    /**
     * Create a new bale.
     */
    public Bale() {
        turtles = new HashSet();
    }

    /**
     * Add "t" to the bale.
     */
    public void add(Turtle t) {
        turtles.add(t);
    }
    
    /**
     * Enquire as to whether "t" is a member of this bale.
     */
    public boolean contains(Turtle t) {
        return turtles.contains(t);
    }

    /** 
     * Instruct all the Turtles in this bale to move "distance" forwards.
     */ 
    public void forward(int distance) {
        Iterator iterator = turtles.iterator();

        while (iterator.hasNext()) {
            Turtle turtle = (Turtle)iterator.next();
            turtle.forward(distance);
        }
    }

    /**
     * Instruct all the Turtles in this bale to rotate left through "angle" degrees.
     */
    public void left(int angle) {
        Iterator iterator = turtles.iterator();

        while (iterator.hasNext()) {
            Turtle turtle = (Turtle)iterator.next();
            turtle.left(angle);
        }
    }

    /**
     * Instruct all the Turtles in this bale to rotate right through "angle" degrees.
     */
    public void right(int angle) {
        Iterator iterator = turtles.iterator();

        while (iterator.hasNext()) {
            Turtle turtle = (Turtle)iterator.next();
            turtle.right(angle);
        }
    }
    
    /**
     * Instruct all the Turtles in this bale to raise their pens.
     */
    public void penUp() {
        Iterator iterator = turtles.iterator();

        while (iterator.hasNext()) {
            Turtle turtle = (Turtle)iterator.next();
            turtle.penUp();
        }
    }
    
    /**
     * Instruct all the Turtles in this bale to lower their pens.
     */
    public void penDown() {
        Iterator iterator = turtles.iterator();

        while (iterator.hasNext()) {
            Turtle turtle = (Turtle)iterator.next();
            turtle.penDown();
        }
    }
    
    
    /**
     * Enquire as to whether all the Turtles in this bale have lowered their pens.
     */
    public boolean arePensDown() {
        Iterator iterator = turtles.iterator();
        while (iterator.hasNext()) {
            if (! ((Turtle)iterator.next()).isPenDown()) {
                return false;
            }
        }
        return false;
    }
    
    /**
     * Instruct all the Turtles in this bale to draw a polgon "p". 
     */
    public void tracePolygon(Polygon p) {
        Iterator iterator = turtles.iterator();

        while (iterator.hasNext()) {
            Turtle turtle = (Turtle)iterator.next();
            p.traceWith(turtle);
        }
    }        
        
}
