package exploris.aquarium;
/**
* MovementLogPane
*
* @author: Stephan Jamieson
*
* @version: 1.0
* date: 12.08.2003
*
*/
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.SwingUtilities;

import javax.swing.text.BadLocationException;
import javax.swing.text.Document;
import javax.swing.text.Position;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Container;
import java.awt.Dimension;

import exploris.gui.GUITracker;

import exploris.motion.MobileObject;
import exploris.motion.Movement;

public class MovementLogPane extends JScrollPane implements GUITracker {

    private final JTextArea jTextArea;         
    private int historySize;
    private boolean displaySource;

    private final static int DEFAULT_HISTORY = 500;
    private final static int HISTORY_EXCESS = 500;

    public MovementLogPane(int columns, int rows) {
	super();
	jTextArea = new JTextArea(rows, columns);
	jTextArea.setLineWrap(true);
	jTextArea.setWrapStyleWord(true);
	jTextArea.setEditable(false);

	this.setViewportView(jTextArea);
	this.setVerticalScrollBarPolicy(JScrollPane.VERTICAL_SCROLLBAR_ALWAYS);

	historySize = DEFAULT_HISTORY;
	displaySource = false;
    }

    public void setHistorySize(int numberOfLines) {
	historySize = numberOfLines;
    }

    public int getHistorySize() {
	return historySize;
    }

    public void setViewSource(boolean value) {
	displaySource = value;
    }

    public void update(MobileObject o, Movement movement) {
        	// Append movement to end of TextPane document
	final String output;

	if (displaySource) {
	    output = o+movement.toString()+System.getProperty("line.separator");
	}
	else {
	    output = movement.toString()+System.getProperty("line.separator");
	}

	Runnable logadjuster = new Runnable() {

		public void run() {
		    if (jTextArea.getLineCount()== historySize+HISTORY_EXCESS) {
			// Remove HISTORY_EXCESS number of lines from text
			int offset;
			try {
			    offset = jTextArea.getLineStartOffset(HISTORY_EXCESS+1);
			}
			catch (BadLocationException badLocationExcep) {
			    throw new RuntimeException("MovementLogPane:update() : implementation error");
			}
			jTextArea.replaceRange("", 0, offset);
		    }
		    
		    jTextArea.append(output);
		    jTextArea.setCaretPosition(jTextArea.getDocument().getLength());
		}
	    };
	SwingUtilities.invokeLater(logadjuster);
    }


    


}

    
