package exploris.graphics;
/**
* Canvas
*
* @author: Stephan Jamieson
*
* @version: 1.0
* date: 12.08.2003
*
*/
import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.geom.Line2D;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.GraphicsConfiguration;
import java.awt.GraphicsDevice;
import java.awt.GraphicsEnvironment;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.awt.Point;
import java.awt.Rectangle;
import java.awt.RenderingHints;
import java.awt.Shape;
import java.awt.Stroke;
import java.awt.Transparency;
//
import java.util.Observable;
import java.util.Observer;
//
import javax.swing.JPanel;
import javax.swing.SwingUtilities;
//
public class Canvas extends Component
{

    private DrawingBuffer drawingBuffer;        
    
    public Canvas() {
 
    super();
    drawingBuffer = new DrawingBuffer();
    }
    

    public void paint(Graphics g) {
    super.paint(g);
    Graphics2D graphics = (Graphics2D)g;
    graphics.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
    drawingBuffer.draw(graphics);
    }
    
    public void erase() {
        drawingBuffer.flush();
        
        Runnable drawer = new Runnable() {

            public void run() {
                invalidate();
                repaint();
            }
	    };
	    SwingUtilities.invokeLater(drawer);
    }
    
    
    final static BasicStroke wideStroke = new BasicStroke(2.0f, BasicStroke.CAP_ROUND,BasicStroke.JOIN_ROUND);
    public void draw(final Shape shape, final Color color) {
    
    Runnable drawer = new Runnable() {

        public void run() {
            drawingBuffer.add(shape, color, wideStroke);
            Rectangle clipRegion = wideStroke.createStrokedShape(shape).getBounds();
            invalidate();
            repaint(clipRegion.x-20, clipRegion.y-20, clipRegion.width+40, clipRegion.height+40);
        }
        };
    SwingUtilities.invokeLater(drawer);
    }
    
}
