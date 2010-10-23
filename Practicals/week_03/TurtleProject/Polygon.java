import java.awt.Color;
/**
 * A Polygon object represents a regular geometric shape such as an equilateral triangle, a square or a hexagon. 
 * The shape represented by a Polygon can be drawn by a Turtle or even a Bale of Turtles. 
 */
public class Polygon
{

    private int numberOfSides;
    private int lengthOfSide;
    private Polygon polygon;
    private boolean visible;
    private Color color;
    
    /**
     * Create a polygon of "numberOfSides" sides of length "lengthOfSide".
     */
    public Polygon(int numberOfSides, int lengthOfSide) 
    {
        this(numberOfSides, lengthOfSide, null);
    }
    
    /**
     * Create a polygon of "numberOfSides" sides of length "lengthOfSide" with a polygon "p" at each point.
     */
    public Polygon(int numberOfSides, int lengthOfSide, Polygon p) 
    {
        this.numberOfSides = numberOfSides;
        this.lengthOfSide = lengthOfSide;
        this.visible = true;
        this.polygon = p;
    }    

    /**
     * Set whether this polygon is visible to "value". 
     */
    public void setVisible(boolean value) {
        this.visible = value;
    }
    
    /**
     * Set this polygon to be colour "c". 
     */
    public void setColor(Color c) {
        this.color = c;
    }
    
    /**
     * Instruct "t" to draw this polygon.
     */
    public void traceWith(Turtle t)
    {
        boolean oldPenState = t.isPenDown();
        Color oldColor = t.getColor();
        if (this.color!=null) {
            t.setColor(this.color);
        }
        setPenState(t, visible);
        
        int outerAngle = 360/numberOfSides;
        int sidesDrawn = 0;
        
        if (polygon!=null) {
            while (sidesDrawn<numberOfSides) 
            {
                t.forward(lengthOfSide);
                t.left((int)(this.getInteriorAngle()/2.0+polygon.getInteriorAngle()/2.0));
                polygon.traceWith(t);
                t.right((int)(polygon.getInteriorAngle()/2.0+this.getInteriorAngle()/2.0));
                t.right(outerAngle);
                sidesDrawn++;
            }
        }
        else {
            while (sidesDrawn<numberOfSides) 
            {
                t.forward(lengthOfSide);
                t.right(outerAngle);
                sidesDrawn++;
            }
        }
        setPenState(t, oldPenState);
        t.setColor(oldColor);
    }

    private void setPenState(Turtle turtle, boolean visible) {
        if (visible) {
            turtle.penDown();
        }
        else {
            turtle.penUp();
        }
    }

    private void setPenState(Bale bale, boolean visible) {
        if (visible) {
            bale.penDown();
        }
        else {
            bale.penUp();
        }
    }

    /**
     * Instruct each Turtle within bale "b" to draw this polygon.
     */
    public void traceWith(Bale b)
    {
        boolean oldPenState = b.isPenDown();
        setPenState(b, visible);

        int outerAngle = 360/numberOfSides;
        int sidesDrawn = 0;
        
        if (polygon!=null) {
            while (sidesDrawn<numberOfSides) 
            {
                b.forward(lengthOfSide);
                b.left((int)(this.getInteriorAngle()/2.0+polygon.getInteriorAngle()/2.0));
                polygon.traceWith(b);
                b.right((int)(this.getInteriorAngle()/2.0+polygon.getInteriorAngle()/2.0));                
                b.right(outerAngle);
                sidesDrawn++;
            }
        }
        else {
            while (sidesDrawn<numberOfSides) 
            {
                b.forward(lengthOfSide);
                b.right(outerAngle);
                sidesDrawn++;
            }
        }
        setPenState(b, oldPenState);
    }

    /**
     * Indicate whether this polygon is visible or invisible.
     */
    public boolean isVisible() {
        return visible;
    }

    /**
     * Obtain the interior angle of this polygon.
     */
    public int getInteriorAngle() {
        return 180-360/numberOfSides;
    }
    
    /**
     * Obtain the length of side of this polygon.
     */
    public int getLengthOfSide() {
        return lengthOfSide;
    }
}
