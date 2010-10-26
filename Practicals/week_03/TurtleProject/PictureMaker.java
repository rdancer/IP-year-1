public class PictureMaker
{
    private TurtleWorld world;
    private Turtle fred;
    
    public PictureMaker()
    {
        world = new TurtleWorld(500, 500, "Picture Maker");
        fred = new Turtle();
    }
    
    public void display() {
        world.display();
    }
    
    public void erase() {
        world.removeTraces();
        world.removeTurtles();
    }
 
    public void drawInitials() 
    {
        world.dropIn(fred);
        Turtle pen = fred; // Reuse the same name for clarity
        
        /* draw "J" */

        pen.penDown();
        pen.right(120);
        pen.forward(30);
        pen.left(120);
        pen.forward(120);
        pen.penUp();


        /* move over */

        pen.right(90);
        pen.forward(30);
        pen.right(90);


        /* draw "M" */

        pen.penDown();
        pen.forward(120);
        pen.right(180);
        pen.forward(120);
        pen.right(150);
        pen.forward(70);
        pen.left(120);
        pen.forward(70);
        pen.left(210);
        pen.forward(120);
        pen.penUp(); // not strictly necessary
      
        world.removeTurtle(fred);
    }
    
}

