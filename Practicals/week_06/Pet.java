/*
 * Copyright © 2010 Jan Minář <rdancer@rdancer.org>
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 2 (two),
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

/* Pet class design developed in cooperation with Ms Jola Olifimihan */


class Pet {
    /*
     * To make the design simple, most of the fields are two-state
     */

    private boolean happy;
    private boolean hungry;
    private boolean interacting;
    private long long age; // seconds
    private int size; // just a number
    private int hairAmount; // just a number


    public void play() {
	// increment happiness
	happy = true;
    }

    public void incrementAge() {
	// grow/lose hair
	// do NOT increment size
    }

    private void die() {
	// clean up and terminate program
    }

    public void feed() {
	// increment happiness
	happy = true;
	// increment size up to a limit set by age
    }

    public boolean hungry() {
	return hungry;
    }

    public void happy() {
	return happy;
    }
}
