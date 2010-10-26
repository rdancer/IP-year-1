/**
 * This class represents a simple picture. You can draw the picture using
 * the draw method. But wait, there's more: being an electronic picture, it
 * can be changed. You can set it to black-and-white display and back to
 * colors (only after it's been drawn, of course).
 *
 * This class was written as an early example for teaching Java with BlueJ.
 * 
 * @author  Michael Kolling and David J. Barnes
 * @author  Jan Minář <rdancer@rdancer.org>
 */

import java.awt.*;

public class Picture
{
    private Square wall;
    private Square window;
    private Triangle roof;
    private Circle sun;
    private Square ground;

    /**
     * Constructor for objects of class Picture
     */
    public Picture()
    {
        // nothing to do... instance variables are automatically set to null
        draw();
        sunset();
    }

    /**
     * Draw this picture.
     */
    public void draw()
    {
        wall = new Square();
        wall.moveVertical(80);
        wall.changeSize(100);
        wall.makeVisible();
        
        window = new Square();
        window.changeColor("blue");
        window.moveHorizontal(20);
        window.moveVertical(100);
        window.makeVisible();

        roof = new Triangle();  
        roof.changeColor("black");
        roof.changeSize(50, 140);
        roof.moveHorizontal(60);
        roof.moveVertical(70);
        roof.makeVisible();

        sun = new Circle();
        sun.changeColor("orange");
        sun.moveHorizontal(-20);
        sun.moveVertical(-10);
        sun.changeSize(40);
        sun.makeVisible();
        
        /* ground */
        
        ground = new Square();
        ground.changeSize(1000);
        ground.moveVertical(180);
        ground.moveHorizontal(-100);
        ground.changeColor("green");
        ground.makeVisible();
        
        /* tree */
        Square trunk1 = new Square();
        trunk1.changeSize(20);
        trunk1.moveHorizontal(180);
        trunk1.moveVertical(170);
        trunk1.changeColor("brown");
        trunk1.makeVisible();
        
        Square trunk2 = new Square();
        trunk2.changeSize(20);
        trunk2.moveHorizontal(180);
        trunk2.moveVertical(150);
        trunk2.changeColor("brown");
        trunk2.makeVisible();

        
        Square crown = new Square();
        crown.changeColor("darkgreen");
        crown.changeSize(70);
        crown.moveHorizontal(180-25);
        crown.moveVertical(80);
        crown.makeVisible();
    }

    /**
     * Change this picture to black/white display
     */
    public void setBlackAndWhite()
    {
        if(wall != null)   // only if it's painted already...
        {
            wall.changeColor("black");
            window.changeColor("white");
            roof.changeColor("black");
            sun.changeColor("black");
        }
    }

    /**
     * Change this picture to use color display
     */
    public void setColor()
    {
        if(wall != null)   // only if it's painted already...
        {
            wall.changeColor("red");
            window.changeColor("black");
            roof.changeColor("green");
            sun.changeColor("yellow");
        }
    }
    
    /**
     * Make the sun set below the horizon, slowly
     */
    public void sunset()
    {
        if(wall != null)   // only if it's painted already...
        {
            // XXX Should be behind all the other shapes; is in the front.
            //     The clipping does not work for some reason; therefore we just
            //     intersect the ground a little, and then erase the sun.
            
            Canvas canvas = Canvas.getCanvas();
            // DNW
            //canvas.setClip(new Rectangle(10,10));
            sun.slowMoveVertical(150);
            canvas.erase(sun);
        }
    }
}
