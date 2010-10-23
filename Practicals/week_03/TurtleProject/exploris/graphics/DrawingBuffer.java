package exploris.graphics;
/**
* DrawingBuffer
*
* @author: Stephan Jamieson
*
* @version: 1.0
* date: 12.08.2003
*
*/
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.Shape;
import java.awt.Stroke;
//
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
//
public class DrawingBuffer {

    protected List objectList;

    private static class DrawingObject {

	Shape shape;
	Color color;
	Stroke stroke;

	public DrawingObject(Shape shape, Color color, Stroke stroke) {
	    this.shape = shape;
	    this.color = color;
	    this.stroke = stroke;
	}
    }


    public DrawingBuffer() {
	objectList = new ArrayList();
    }


    public void add(Shape shape, Color color, Stroke stroke) {
	//synchronized(objectList) {
	    objectList.add(new DrawingObject(shape, color, stroke) );
	    //}
    }


    public void draw(Graphics2D graphics2D) {
	
	if (graphics2D == null) {
	    throw new NullPointerException("DrawingBuffer.flush("+graphics2D+")");
	}
	else if (! objectList.isEmpty() ) {

	    //synchronized(objectList) {
		Iterator iterator= objectList.iterator();

		while (iterator.hasNext() ) {
		    DrawingObject drawingObject = (DrawingObject)iterator.next();
		    
		    graphics2D.setStroke(drawingObject.stroke);
		    graphics2D.setColor(drawingObject.color);
		    graphics2D.draw(drawingObject.shape);
		}
		//}
	}
    }

    public boolean isEmpty() {
	return objectList.isEmpty();
    }

    public void flush() {
	//synchronized(objectList) {
	    objectList.clear();
	    //}
    }


}
