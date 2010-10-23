package exploris.gui;
/**
* PointForm
*
* @author: Stephan Jamieson
*
* @version: 1.0
* date: 12.08.2003
*
*/
import java.awt.Color;
import java.awt.Component;
import java.awt.Point;
//
import javax.swing.Box;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.SwingConstants;
//
public class PointForm extends JPanel {
 

    private final static int DEFAULT_VALUE_SIZE = 4;

    private JLabel xLabel = new JLabel("X", SwingConstants.CENTER);
    private JLabel yLabel = new JLabel("Y", SwingConstants.CENTER);
    private JTextField xValue = new JTextField(DEFAULT_VALUE_SIZE);
    private JTextField yValue = new JTextField(DEFAULT_VALUE_SIZE);

    private boolean resizableFields;

    public PointForm () {
	super();

	this.resizableFields = true;

	this.add(Box.createHorizontalStrut(5));
	this.add(xLabel);
	this.add(Box.createHorizontalStrut(10));
	this.add(xValue);
	this.add(Box.createHorizontalStrut(15));
	this.add(yLabel);
	this.add(Box.createHorizontalStrut(10));
	this.add(yValue);
	this.add(Box.createHorizontalStrut(5));
    }

    public PointForm(int columns) {
	this();
	this.setColumns(columns);
    }

    public void setResizable(boolean value) {
	resizableFields = value;
    }

    public boolean isResizable() {
	return resizableFields;
    }

    public void setBackground(Color color) {
	super.setBackground(color);
	if (xLabel != null) {
	    xLabel.setBackground(color);
	    xValue.setBackground(color);
	    yLabel.setBackground(color);
	    yValue.setBackground(color);
	}
    }

    public void setForeground(Color color) {
	super.setForeground(color);
	if (xLabel != null) {
	    xLabel.setForeground(color);
	    xValue.setForeground(color);
	    yLabel.setForeground(color);
	    yValue.setForeground(color);
	}
    }
 
    public void setValue(Point point) {

	String xString = ""+point.x;
	String yString = ""+point.y;

	if (resizableFields) {
	    int columns = Math.max(xString.length(), yString.length());

	    if (columns > xValue.getColumns()) {
		
		xValue.setColumns(columns);
		yValue.setColumns(columns);
	    }
	}
	
	xValue.setText(xString);
	yValue.setText(yString);
    }

    public void setColumns(int value) {
	xValue.setColumns(value);
	yValue.setColumns(value);
    }

    public int getColumns() {
	return xValue.getColumns();
    }

    public Point getValue() {
	int x = Integer.parseInt(xValue.getText());
	int y = Integer.parseInt(yValue.getText());
	return new Point(x, y);
    }

    public boolean isEditable() {
	return (xValue.isEditable() && yValue.isEditable());
    }

    public void setEditable(boolean value) {
	xValue.setEditable(value);
	yValue.setEditable(value);
    }

}
