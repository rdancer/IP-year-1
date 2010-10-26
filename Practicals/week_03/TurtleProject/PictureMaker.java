public class PictureMaker
{
    private TurtleWorld world;
    private Turtle fred;
    
    public PictureMaker()
    {
        world = new TurtleWorld(500, 500, "Picture Maker");
        fred = new Turtle();
        // start visible
        this.display();
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
        /*
        fred.penUp();
        fred.left(90);
        fred.forward(200);
        fred.left(90);
        fred.forward(200);
        fred.left(90);
        
        fred.penDown();
        fred.forward(175);
        fred.left(90);
        fred.forward(175);
        fred.left(90);
        fred.forward(175);
        fred.right(90);
        fred.forward(175);
        fred.right(90);
        fred.forward(175);
        fred.penUp();
        */
        /* Position upper left corner */
         
         fred.penUp();
         fred.forward(250);
         fred.left(90);
         fred.forward(200);
         fred.left(180);
        
        /* Draw LATIN CAPITAL LETTER J */
        fred.penDown();
        fred.forward(175);
        fred.penUp();
        fred.left(180);
        fred.forward(75);
        fred.left(90);
        fred.penDown();
        fred.forward(350);
        fred.right(90);
        fred.forward(100);
        fred.right(90);
        fred.forward(50);
        
        // Position next letter
        fred.penUp();
        fred.forward(300);
        fred.right(90);
        fred.forward(200);
        
        // Draw LATIN CAPITAL LETTER M
       fred.setColor(java.awt.Color.cyan);
       drawGlyph('M');
       
        
        // Cleanup
        world.removeTurtle(fred);
    }
    
    /**
     * drawGlyph draw a glyph or error out if the glyph is not known
     */
    private void drawGlyph(char glyph){
        int height = 350;
        boolean penDownSaved = fred.isPenDown();

        if (fred.isPenDown()) {
            fred.penUp();
        }            
         
        if (glyph == 'M') {
           // Get to the start of the letter M: bottom left
            fred.right(90);
            fred.forward(height);
            
            // left leg
            fred.right(180);  // +90
            fred.penDown();
            fred.forward(height);
            
            // left beak half
            fred.right(150); // -60
            fred.forward(height/2);
            
            // right beak half
            fred.left(120); // +60
            fred.forward(height/2);
            
            // right leg
            fred.right(150); // -90
            fred.forward(height);
        } else {
            // XXX error out
        }       
        // cleanup
        // restore pen state
        if (penDownSaved) {
            fred.penDown();
        }
    }
    
    // should really be a method of a derived class of Turtle
    public void drawPolygon(int sides) {
        drawPolygon(sides, null);
    }
    public void drawPolygon(int sides, java.awt.Color color) {
        drawPolygon(sides, color, 50);
    }
    public void drawPolygon(int sides, java.awt.Color color, int sideLength) {
       boolean penDownSaved = fred.isPenDown();
     
        world.dropIn(fred);
         if (!fred.isPenDown()){
            fred.penDown();
        }
        if (color != null) {
            fred.setColor(color);
        }
        
        // if sides == 1, make sure we come back
        //if (sides == 1) sides = 2;
        
        for (int i = 0; i < sides; i++) {
            fred.forward(sideLength);
            fred.right(360/sides);        
        }
        
        // cleanup
        if (!penDownSaved) {
            fred.penUp();
        }
    }
    public void drawExcercise_2_3(){
        drawPolygon(6, Color.yellow);
        drawPolygon(5, Color.green);
        drawPolygon(4, Color.blue);
        drawPolygon(3, Color.red);
    }

    /**
     * Draw the 2.4 Excercise from 
     * http://www.dur.ac.uk/cs.programming/local/java/resource.php?id=10
     */
    public void drawExcercise2_4(){
        int mySides = 6;
        
         for (int i = 0; i < mySides; i++) {
             drawPolygon(1, Color.blue);
             fred.left(90);   // yank the pen 90 degrees left
                drawPolygon(3, java.awt.Color.red);
             fred.right(90); // yank the pen back
            fred.right(360/mySides);        
        }
    }
    /**
     * Draw the 2.4 Excercise from 
     * http://www.dur.ac.uk/cs.programming/local/java/resource.php?id=10
     * Different approach: Use and extend the Turtle object; this is more OO, but it's not pretty either
     */
    public void drawExcercise2_4_alternative_approach(){ 
        int mySideLength = 50;
        int mySides = 6;
        
        // let's get busy
        fred.penDown();
        world.dropIn(fred);
        
       // start the drawing
       for (int i = 0; i < mySides; i++) {
             
             fred.setColor(Color.blue);
             fred.forward(mySideLength);
             fred.left(90);   // yank the pen 90 degrees left
                fred.setColor(Color.red);
                drawPolygon(3, null, mySideLength);
             fred.right(90); // yank the pen back
            fred.right(360/mySides);        
        }
       
    }
   /**
     * Draw the 2.5 Excercise from 
     * http://www.dur.ac.uk/cs.programming/local/java/resource.php?id=10
    */
   // XXX Not written
   //public void drawExcercise2_5(){ 
   //}
     
     /**
     * Draw the 2.6 Excercise from 
     * http://www.dur.ac.uk/cs.programming/local/java/resource.php?id=10
    */
    public void drawExcercise2_6(){ 
        int mySideLength = 70;
        int myGap = 10; // Slight distance from each other
        int mySides = 6;
        int howMany = 3;
        Bale myBale = new Bale();
        Polygon myHexagon = new Polygon (6, mySideLength);
       java.awt.Color myColors[] = { Color.red, Color.green, Color.blue };
        
     
        for (int i = 0; i < howMany; i++) {
            Turtle t = new Turtle(myColors[i]);
            world.dropIn(t);
            t.penUp();
            t.right(360 / howMany * i);
            myBale.add(t);
       }
       myBale.forward(myGap);
       myBale.penDown();     
       
       myHexagon.traceWith(myBale);
    }
}

