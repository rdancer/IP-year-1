package exploris.gui;
/**
* PositionForm
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
import exploris.motion.Position;
//
public class PositionForm extends JPanel {

    private PointForm location = new PointForm();
    private JLabel orientationLabel = new JLabel("Angle", SwingConstants.CENTER);
    private JTextField orientationValue = new JTextField(DEFAULT_VALUE_SIZE);


    private boolean resizable;

    private final static int DEFAULT_VALUE_SIZE = 3;

    public PositionForm () {
	super();
	
	this.add(location);
	this.add(Box.createHorizontalStrut(20));
	this.add(orientationLabel);
	this.add(Box.createHorizontalStrut(10));
	this.add(orientationValue);
	this.resizable = true;
    }

    public PositionForm(int columns) {
	this();
	this.setPointColumns(columns);
    }

    public void setPointColumns(int columns) {
	location.setColumns(columns);
    }

    public int getPointColumns() {
	return location.getColumns();
    }

    public void setValue(Position position) {
	location.setValue(position.getLocation());
	orientationValue.setText(""+position.getOrientation());
    }

    public Position getValue() {
	int orientation = Integer.parseInt(orientationValue.getText());
	return new Position(location.getValue(), orientation);
    }

    public void setBackground(Color color) {
	super.setBackground(color);
	if (location != null) {
	    location.setBackground(color);
	    orientationLabel.setBackground(color);
	    orientationValue.setBackground(color);
	}
    }

    public void setForeground(Color color) {
	super.setForeground(color);
	if (location != null) {
	    location.setForeground(color);
	    orientationLabel.setForeground(color);
	    orientationValue.setForeground(color);
	}
    }

    public boolean isEditable() {
	return (orientationValue.isEditable());
    }

    public void setEditable(boolean value) {
	location.setEditable(value);
	orientationValue.setEditable(value);
    }

    public void setResizable(boolean value) {
	location.setResizable(value);
    }

    public boolean isResizable() {
	return location.isResizable();
    }
}

